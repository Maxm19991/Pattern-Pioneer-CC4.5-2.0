import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
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
        console.error('Error creating user:', userError);
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
      console.error('Error creating order:', orderError);
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
        console.error('Error creating order item:', itemError);
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
          console.error('Error creating download record:', downloadError);
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
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }

    console.log('Checkout session processed successfully');
  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}
