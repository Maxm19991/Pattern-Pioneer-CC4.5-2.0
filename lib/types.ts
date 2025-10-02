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
