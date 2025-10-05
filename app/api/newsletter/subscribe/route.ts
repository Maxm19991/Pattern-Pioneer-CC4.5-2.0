import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { addSubscriberToMailerlite } from '@/lib/mailerlite';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Check if already subscribed
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    // Add to Supabase
    const { error: subscriptionError } = await supabase
      .from('newsletter_subscriptions')
      .insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          source: 'homepage',
        },
      ]);

    if (subscriptionError) {
      console.error('Newsletter subscription error:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // Add to Mailerlite
    const mailerliteResult = await addSubscriberToMailerlite(email, 'homepage');
    if (!mailerliteResult.success) {
      console.error('Mailerlite sync error:', mailerliteResult.error);
      // Don't fail the request - we still have the email in Supabase
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error: any) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
