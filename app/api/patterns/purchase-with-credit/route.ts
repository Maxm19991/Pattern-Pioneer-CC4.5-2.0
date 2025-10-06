import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { spendCredits, getAvailableCredits } from '@/lib/credits';
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

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

    // Rate limiting
    const rateLimitResult = checkRateLimit(req, {
      ...RateLimitPresets.checkout,
      maxRequests: 20,
      identifier: `credit-purchase:${session.user.email}`,
    });
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { patternId } = await req.json();

    if (!patternId) {
      return NextResponse.json(
        { error: 'Pattern ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get pattern details
    const { data: pattern, error: patternError } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', patternId)
      .eq('is_active', true)
      .single();

    if (patternError || !pattern) {
      return NextResponse.json(
        { error: 'Pattern not found' },
        { status: 404 }
      );
    }

    // Check if user already has access to this pattern
    const { data: existingDownload } = await supabase
      .from('downloads')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('pattern_id', patternId)
      .single();

    if (existingDownload) {
      return NextResponse.json(
        { error: 'You already have access to this pattern' },
        { status: 400 }
      );
    }

    // Check if user has an active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .in('status', ['active', 'trialing'])
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Active subscription required to use credits' },
        { status: 403 }
      );
    }

    // Check available credits
    const availableCredits = await getAvailableCredits(session.user.id);

    if (availableCredits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. You need 1 credit to download this pattern.' },
        { status: 400 }
      );
    }

    // Spend 1 credit
    const result = await spendCredits(
      session.user.id,
      1,
      patternId,
      `Purchased "${pattern.name}" with 1 credit`
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to spend credit' },
        { status: 500 }
      );
    }

    // Grant download access
    const { data: download, error: downloadError } = await supabase
      .from('downloads')
      .insert([
        {
          user_id: session.user.id,
          email: session.user.email,
          pattern_id: patternId,
          order_id: null,
          is_free: false,
        },
      ])
      .select()
      .single();

    if (downloadError) {
      console.error('Error creating download record:', downloadError);
      return NextResponse.json(
        { error: 'Failed to grant access. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pattern purchased successfully with 1 credit',
      download,
      remainingCredits: availableCredits - 1,
    });
  } catch (error: any) {
    console.error('Credit purchase error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to purchase pattern' },
      { status: 500 }
    );
  }
}
