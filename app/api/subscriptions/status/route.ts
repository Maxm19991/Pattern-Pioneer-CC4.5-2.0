import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAvailableCredits, getCreditTransactions, getExpiringCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Require authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get available credits
    const availableCredits = await getAvailableCredits(session.user.id);

    // Get recent credit transactions
    const transactions = await getCreditTransactions(session.user.id, 10);

    // Get expiring credits
    const expiringCredits = await getExpiringCredits(session.user.id);

    return NextResponse.json({
      subscription: subscription || null,
      availableCredits,
      transactions,
      expiringCredits,
    });
  } catch (error: any) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
