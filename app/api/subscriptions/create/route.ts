import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover' as any,
});

// Set these in your .env.local after creating Stripe products
const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID || '';
const YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID || '';

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const session = await auth();

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Rate limiting: 5 subscription attempts per hour per user
    const rateLimitResult = checkRateLimit(req, {
      ...RateLimitPresets.checkout,
      maxRequests: 5,
      identifier: `subscription:${session.user.email}`,
    });
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { planType } = await req.json();

    if (!planType || !['monthly', 'yearly'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .in('status', ['active', 'trialing'])
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId: string;

    // Check if user has a Stripe customer ID
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (userData?.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });

      customerId = customer.id;

      // Save customer ID to user record
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }

    // Select price based on plan type
    const priceId = planType === 'monthly' ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Subscription plan not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session for subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/subscription?canceled=true`,
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planType,
        },
        trial_period_days: 7, // 7-day free trial
      },
      allow_promotion_codes: true, // Allow discount codes
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
