-- Remove the credits_balance check constraint
-- The user_credits table is just a cache; the real source of truth is credit_transactions
-- and the get_available_credits() function which properly handles expiration

ALTER TABLE user_credits DROP CONSTRAINT IF EXISTS user_credits_credits_balance_check;

-- Add comment explaining why there's no constraint
COMMENT ON COLUMN user_credits.credits_balance IS 'Cached balance from credit_transactions. Can be negative due to expired credits. Use get_available_credits() for accurate available balance.';
