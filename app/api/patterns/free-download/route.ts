import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { FreeDownloadEmail } from '@/emails/FreeDownload';
import { addSubscriberToMailerlite } from '@/lib/mailerlite';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, patternId } = body;

    if (!email || !patternId) {
      return NextResponse.json(
        { error: 'Email and pattern ID are required' },
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

    // Get pattern details
    const { data: pattern, error: patternError } = await supabase
      .from('patterns')
      .select('id, name, slug, free_image_url')
      .eq('id', patternId)
      .single();

    if (patternError || !pattern) {
      return NextResponse.json(
        { error: 'Pattern not found' },
        { status: 404 }
      );
    }

    // Check if user already downloaded this free pattern
    const { data: existingDownload } = await supabase
      .from('downloads')
      .select('id')
      .eq('email', email)
      .eq('pattern_id', patternId)
      .eq('is_free', true)
      .single();

    if (existingDownload) {
      return NextResponse.json(
        { error: 'You have already downloaded this free pattern. Check your email!' },
        { status: 400 }
      );
    }

    // Add to newsletter subscriptions (if not already subscribed)
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingSubscription) {
      const { error: subscriptionError } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email,
            subscribed_at: new Date().toISOString(),
            source: 'free_download',
          },
        ]);

      if (subscriptionError) {
        console.error('Newsletter subscription error:', subscriptionError);
        // Don't fail the request if newsletter signup fails
      }
    }

    // Add to Mailerlite
    const mailerliteResult = await addSubscriberToMailerlite(email, 'free_download');
    if (!mailerliteResult.success) {
      console.error('Mailerlite sync error:', mailerliteResult.error);
      // Don't fail the request if Mailerlite sync fails - we still have the email in Supabase
    }

    // Generate unique download token
    const downloadToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Create download record
    const { error: downloadError } = await supabase
      .from('downloads')
      .insert([
        {
          email,
          pattern_id: patternId,
          is_free: true,
          download_token: downloadToken,
        },
      ]);

    if (downloadError) {
      console.error('Download record error:', downloadError);
      return NextResponse.json(
        { error: 'Failed to create download record' },
        { status: 500 }
      );
    }

    // Send email with free download link
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${downloadToken}`;

    try {
      await resend.emails.send({
        from: 'Pattern Pioneer <orders@patternpioneerstudio.com>',
        to: [email],
        subject: `Your Free ${pattern.name} Pattern is Ready!`,
        react: FreeDownloadEmail({
          patternName: pattern.name,
          downloadUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails - they can still access downloads
    }

    return NextResponse.json({
      success: true,
      message: 'Free pattern download initiated! Check your email for the download link.',
    });
  } catch (error) {
    console.error('Free download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
