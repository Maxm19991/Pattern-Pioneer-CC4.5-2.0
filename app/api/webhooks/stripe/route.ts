import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { logError } from '@/lib/error-handling';
import { addCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    logError('Webhook signature verification', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session, supabase);
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription, supabase);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(deletedSubscription, supabase);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice, supabase);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(failedInvoice, supabase);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    console.log('Processing checkout session:', session.id);

    // Get line items from session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    // Calculate total
    const total = (session.amount_total || 0) / 100; // Convert from cents

    // Get customer email
    const email = session.customer_email || session.customer_details?.email;

    if (!email) {
      console.error('No email found in session');
      return;
    }

    // Check if user exists, if not create one
    let userId = null;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{ email }])
        .select('id')
        .single();

      if (userError) {
        logError('Webhook user creation', userError);
      } else {
        userId = newUser?.id;
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          email,
          total,
          currency: session.currency?.toUpperCase() || 'EUR',
          status: 'completed',
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_checkout_session_id: session.id,
        },
      ])
      .select()
      .single();

    if (orderError) {
      logError('Webhook order creation', orderError);
      return;
    }

    console.log('Order created:', order.id);

    // Get pattern IDs from metadata
    const patternIds = session.metadata?.items
      ? JSON.parse(session.metadata.items)
      : [];

    // Create order items and download records
    const emailItems = [];

    for (const item of lineItems.data) {
      const patternName = item.description || 'Pattern';
      const price = (item.amount_total || 0) / 100;

      // Find matching pattern ID (if available in metadata)
      const patternIndex = lineItems.data.indexOf(item);
      const patternId = patternIds[patternIndex] || null;

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: order.id,
            pattern_id: patternId,
            pattern_name: patternName,
            price,
          },
        ]);

      if (itemError) {
        logError('Webhook order item creation', itemError);
      }

      // Create download record (grants access)
      if (patternId) {
        const { error: downloadError } = await supabase
          .from('downloads')
          .insert([
            {
              user_id: userId,
              email,
              pattern_id: patternId,
              order_id: order.id,
              is_free: false,
            },
          ]);

        if (downloadError) {
          logError('Webhook download record creation', downloadError);
        }

        // Add to email items
        emailItems.push({
          patternName,
          price: `€${price.toFixed(2)}`,
          downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/downloads`,
        });
      }
    }

    // Send order confirmation email
    try {
      const customerName = session.customer_details?.name || email.split('@')[0];

      await resend.emails.send({
        from: 'Pattern Pioneer <orders@patternpioneerstudio.com>',
        to: [email],
        subject: `Order Confirmation - ${order.id}`,
        react: OrderConfirmationEmail({
          customerName,
          orderNumber: order.id,
          orderDate: new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          items: emailItems,
          total: `€${total.toFixed(2)}`,
        }),
      });

      console.log('Order confirmation email sent to:', email);
    } catch (emailError) {
      logError('Webhook order confirmation email', emailError);
      // Don't fail the webhook if email fails
    }

    console.log('Checkout session processed successfully');
  } catch (error) {
    logError('Webhook checkout session handler', error);
  }
}

async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    console.log('Processing subscription update:', subscription.id);

    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;

    // Determine plan type from price metadata or ID
    const price = subscription.items.data[0]?.price;
    const planType = price?.recurring?.interval === 'year' ? 'yearly' : 'monthly';

    // Get user by stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Upsert subscription
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          plan_type: planType,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_subscription_id' }
      );

    if (subscriptionError) {
      logError('Webhook subscription upsert', subscriptionError);
    }

    console.log('Subscription updated successfully');
  } catch (error) {
    logError('Webhook subscription update handler', error);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    console.log('Processing subscription deletion:', subscription.id);

    // Update subscription status to canceled
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logError('Webhook subscription deletion', error);
    }

    console.log('Subscription deleted successfully');
  } catch (error) {
    logError('Webhook subscription deletion handler', error);
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    console.log('Processing successful invoice payment:', invoice.id);

    // Only process subscription invoices (not one-time payments)
    if (!invoice.subscription) {
      console.log('Not a subscription invoice, skipping');
      return;
    }

    const customerId = invoice.customer as string;

    // Get user by stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Get subscription details
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', invoice.subscription as string)
      .single();

    if (subError || !subscription) {
      console.error('Subscription not found:', invoice.subscription);
      return;
    }

    // Add 12 credits for successful payment (both monthly and yearly get 12 credits per billing cycle)
    const creditsToAdd = 12;
    const result = await addCredits(
      user.id,
      creditsToAdd,
      'subscription_renewal',
      `${creditsToAdd} credits added for ${subscription.plan_type} subscription renewal`,
      subscription.id
    );

    if (result) {
      console.log(`Added ${creditsToAdd} credits to user ${user.id}`);
    } else {
      console.error('Failed to add credits');
    }

    console.log('Invoice payment processed successfully');
  } catch (error) {
    logError('Webhook invoice payment succeeded handler', error);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    console.log('Processing failed invoice payment:', invoice.id);

    // Only process subscription invoices
    if (!invoice.subscription) {
      return;
    }

    // Update subscription status to past_due
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string);

    if (error) {
      logError('Webhook invoice payment failed', error);
    }

    console.log('Subscription marked as past_due');
  } catch (error) {
    logError('Webhook invoice payment failed handler', error);
  }
}
