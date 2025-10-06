import { getSupabaseAdmin } from './supabase';
import type { CreditTransaction, UserCredits } from './types';

/**
 * Get user's available credits (excluding expired credits)
 */
export async function getAvailableCredits(userId: string): Promise<number> {
  const supabase = getSupabaseAdmin();

  // Calculate available credits by summing up non-expired transactions
  const { data, error } = await supabase.rpc('get_available_credits', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error getting available credits:', error);
    // Fallback: check user_credits table
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('credits_balance')
      .eq('user_id', userId)
      .single();

    return userCredits?.credits_balance || 0;
  }

  return data || 0;
}

/**
 * Get user's credit balance from user_credits table
 * Note: This may include expired credits. Use getAvailableCredits() for accurate balance.
 */
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting user credits:', error);
    return null;
  }

  return data;
}

/**
 * Add credits to user account (e.g., from subscription renewal)
 */
export async function addCredits(
  userId: string,
  amount: number,
  transactionType: 'subscription_renewal' | 'refund' | 'admin_adjustment',
  description?: string,
  subscriptionId?: string
): Promise<CreditTransaction | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('credit_transactions')
    .insert([
      {
        user_id: userId,
        amount,
        transaction_type: transactionType,
        description,
        subscription_id: subscriptionId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding credits:', error);
    return null;
  }

  return data;
}

/**
 * Spend credits (e.g., to purchase a pattern)
 * Uses FIFO (First In First Out) - oldest non-expired credits are spent first
 */
export async function spendCredits(
  userId: string,
  amount: number,
  patternId: string,
  description?: string
): Promise<{ success: boolean; error?: string; transaction?: CreditTransaction }> {
  const supabase = getSupabaseAdmin();

  // Check if user has enough available credits
  const availableCredits = await getAvailableCredits(userId);

  if (availableCredits < amount) {
    return {
      success: false,
      error: `Insufficient credits. You have ${availableCredits} credits but need ${amount}.`,
    };
  }

  // Create a negative transaction to spend credits
  const { data, error } = await supabase
    .from('credit_transactions')
    .insert([
      {
        user_id: userId,
        amount: -amount,
        transaction_type: 'pattern_purchase',
        pattern_id: patternId,
        description: description || `Purchased pattern with ${amount} credit(s)`,
        expires_at: null, // Spent credits don't expire
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error spending credits:', error);
    return {
      success: false,
      error: 'Failed to spend credits. Please try again.',
    };
  }

  return {
    success: true,
    transaction: data,
  };
}

/**
 * Get credit transaction history for a user
 */
export async function getCreditTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting credit transactions:', error);
    return [];
  }

  return data || [];
}

/**
 * Expire credits that are older than 90 days
 * This should be run periodically (e.g., daily cron job)
 */
export async function expireOldCredits(): Promise<{
  expiredCount: number;
  creditsExpired: number;
}> {
  const supabase = getSupabaseAdmin();

  // Find credits that have expired but not marked as expired
  const { data: expiredCredits, error: selectError } = await supabase
    .from('credit_transactions')
    .select('*')
    .gt('amount', 0) // Only credits added (positive amounts)
    .eq('is_expired', false)
    .lt('expires_at', new Date().toISOString());

  if (selectError) {
    console.error('Error finding expired credits:', selectError);
    return { expiredCount: 0, creditsExpired: 0 };
  }

  if (!expiredCredits || expiredCredits.length === 0) {
    return { expiredCount: 0, creditsExpired: 0 };
  }

  let totalCreditsExpired = 0;
  let expiredTransactionCount = 0;

  // Process each expired credit batch
  for (const credit of expiredCredits) {
    // Mark the original credit as expired
    const { error: updateError } = await supabase
      .from('credit_transactions')
      .update({ is_expired: true })
      .eq('id', credit.id);

    if (updateError) {
      console.error('Error marking credit as expired:', updateError);
      continue;
    }

    // Create a negative transaction to deduct the expired credits
    const { error: insertError } = await supabase
      .from('credit_transactions')
      .insert([
        {
          user_id: credit.user_id,
          amount: -credit.amount,
          transaction_type: 'expiration',
          description: `${credit.amount} credit(s) expired after 90 days`,
          expires_at: null,
        },
      ]);

    if (insertError) {
      console.error('Error creating expiration transaction:', insertError);
      continue;
    }

    totalCreditsExpired += credit.amount;
    expiredTransactionCount++;
  }

  console.log(
    `Expired ${totalCreditsExpired} credits across ${expiredTransactionCount} transactions`
  );

  return {
    expiredCount: expiredTransactionCount,
    creditsExpired: totalCreditsExpired,
  };
}

/**
 * Get credits expiring soon (within next 7 days)
 */
export async function getExpiringCredits(
  userId: string
): Promise<{ amount: number; expiresAt: string }[]> {
  const supabase = getSupabaseAdmin();

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('amount, expires_at')
    .eq('user_id', userId)
    .gt('amount', 0)
    .eq('is_expired', false)
    .lt('expires_at', sevenDaysFromNow.toISOString())
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true });

  if (error) {
    console.error('Error getting expiring credits:', error);
    return [];
  }

  return (
    data?.map((item) => ({
      amount: item.amount,
      expiresAt: item.expires_at!,
    })) || []
  );
}
