export interface Pattern {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  email_verified?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  email: string;
  total: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  pattern_id?: string;
  pattern_name: string;
  price: number;
  created_at: string;
}

export interface Download {
  id: string;
  user_id?: string;
  email: string;
  pattern_id?: string;
  order_id?: string;
  is_free: boolean;
  download_count: number;
  last_downloaded_at?: string;
  created_at: string;
}

export interface CartItem {
  pattern: Pattern;
  quantity: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  plan_type: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  credits_balance: number;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'subscription_renewal' | 'pattern_purchase' | 'refund' | 'admin_adjustment' | 'expiration';
  pattern_id?: string;
  subscription_id?: string;
  description?: string;
  expires_at?: string;
  is_expired: boolean;
  created_at: string;
}
