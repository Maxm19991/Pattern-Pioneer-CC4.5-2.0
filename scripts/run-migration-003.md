# Run Migration 003: Remove Credits Check Constraint

## Problem
The `user_credits` table has a CHECK constraint that prevents negative balances, but the balance can become out of sync with actual available credits due to expiration. The `get_available_credits()` function is the source of truth.

## Solution
Run this SQL in your Supabase SQL Editor:

```sql
-- Remove the credits_balance check constraint
ALTER TABLE user_credits DROP CONSTRAINT IF EXISTS user_credits_credits_balance_check;

-- Add comment explaining why there's no constraint
COMMENT ON COLUMN user_credits.credits_balance IS 'Cached balance from credit_transactions. Can be negative due to expired credits. Use get_available_credits() for accurate available balance.';
```

## Steps
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Paste the SQL above
5. Click "Run"

That's it! The credit purchase should now work.
