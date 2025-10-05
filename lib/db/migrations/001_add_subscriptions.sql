-- Migration: Add subscription and credit system
-- Credits expire after 90 days from when they are added

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,
  plan_type VARCHAR(20) NOT NULL, -- 'monthly' or 'yearly'
  status VARCHAR(50) NOT NULL, -- 'active', 'canceled', 'past_due', 'incomplete', 'trialing'
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User credits table (aggregated balance)
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  credits_balance INTEGER DEFAULT 0 CHECK (credits_balance >= 0),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit transactions (audit trail with expiration tracking)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- positive for credits added, negative for spent
  transaction_type VARCHAR(50) NOT NULL, -- 'subscription_renewal', 'pattern_purchase', 'refund', 'admin_adjustment', 'expiration'
  pattern_id UUID REFERENCES patterns(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  description TEXT,
  expires_at TIMESTAMP, -- null for spent credits, set to created_at + 90 days for added credits
  is_expired BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_expires_at ON credit_transactions(expires_at);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_is_expired ON credit_transactions(is_expired);

-- Function to automatically set expiration date for new credits
CREATE OR REPLACE FUNCTION set_credit_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set expiration for credits being added (positive amount)
  IF NEW.amount > 0 AND NEW.expires_at IS NULL THEN
    NEW.expires_at := NEW.created_at + INTERVAL '90 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set expiration date automatically
DROP TRIGGER IF EXISTS trigger_set_credit_expiration ON credit_transactions;
CREATE TRIGGER trigger_set_credit_expiration
  BEFORE INSERT ON credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_credit_expiration();

-- Function to update user_credits balance
CREATE OR REPLACE FUNCTION update_user_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user_credits balance
  INSERT INTO user_credits (user_id, credits_balance, updated_at)
  VALUES (
    NEW.user_id,
    NEW.amount,
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    credits_balance = user_credits.credits_balance + NEW.amount,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update balance when transaction is created
DROP TRIGGER IF EXISTS trigger_update_user_credits_balance ON credit_transactions;
CREATE TRIGGER trigger_update_user_credits_balance
  AFTER INSERT ON credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_balance();

-- Add subscription_id to users table (optional, for quick access)
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Comments for documentation
COMMENT ON TABLE subscriptions IS 'Stores active and historical subscription data';
COMMENT ON TABLE user_credits IS 'Aggregated credit balance per user (calculated from credit_transactions)';
COMMENT ON TABLE credit_transactions IS 'Audit trail of all credit additions and usage. Credits expire 90 days after being added.';
COMMENT ON COLUMN credit_transactions.expires_at IS 'Expiration date for added credits (created_at + 90 days). NULL for spent credits.';
