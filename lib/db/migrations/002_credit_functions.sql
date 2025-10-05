-- PostgreSQL function to calculate available (non-expired) credits for a user
-- This is more efficient than calculating in application code

CREATE OR REPLACE FUNCTION get_available_credits(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total_added INTEGER;
  v_total_spent INTEGER;
  v_total_expired INTEGER;
BEGIN
  -- Sum up all credits added (positive amounts) that haven't expired
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_added
  FROM credit_transactions
  WHERE user_id = p_user_id
    AND amount > 0
    AND is_expired = false
    AND (expires_at IS NULL OR expires_at > NOW());

  -- Sum up all credits spent (negative amounts)
  SELECT COALESCE(ABS(SUM(amount)), 0)
  INTO v_total_spent
  FROM credit_transactions
  WHERE user_id = p_user_id
    AND amount < 0;

  -- Calculate available credits
  RETURN GREATEST(v_total_added - v_total_spent, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get credit summary for a user
CREATE OR REPLACE FUNCTION get_credit_summary(p_user_id UUID)
RETURNS TABLE (
  total_earned INTEGER,
  total_spent INTEGER,
  total_expired INTEGER,
  available_credits INTEGER,
  expiring_soon INTEGER,
  expiring_soon_date TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  WITH credit_stats AS (
    SELECT
      COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as earned,
      COALESCE(ABS(SUM(CASE WHEN amount < 0 AND transaction_type != 'expiration' THEN amount ELSE 0 END)), 0) as spent,
      COALESCE(ABS(SUM(CASE WHEN transaction_type = 'expiration' THEN amount ELSE 0 END)), 0) as expired
    FROM credit_transactions
    WHERE user_id = p_user_id
  ),
  expiring AS (
    SELECT
      COALESCE(SUM(amount), 0) as expiring_amount,
      MIN(expires_at) as next_expiry
    FROM credit_transactions
    WHERE user_id = p_user_id
      AND amount > 0
      AND is_expired = false
      AND expires_at IS NOT NULL
      AND expires_at > NOW()
      AND expires_at < NOW() + INTERVAL '7 days'
  )
  SELECT
    cs.earned::INTEGER,
    cs.spent::INTEGER,
    cs.expired::INTEGER,
    get_available_credits(p_user_id)::INTEGER,
    e.expiring_amount::INTEGER,
    e.next_expiry
  FROM credit_stats cs
  CROSS JOIN expiring e;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_available_credits IS 'Returns the number of available (non-expired, non-spent) credits for a user';
COMMENT ON FUNCTION get_credit_summary IS 'Returns detailed credit statistics for a user including expiring credits';
