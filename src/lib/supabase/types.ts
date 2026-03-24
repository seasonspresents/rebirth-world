/**
 * Database Types
 *
 * TypeScript interfaces that match the Supabase database schema.
 * These types provide type safety and serve as a single source of truth
 * for database structures throughout the application.
 */

/**
 * User Profile
 * Maps to the `user_profiles` table
 */
export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  profile_image_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  phone: string | null;
  birth_date: string | null; // ISO date string
  language: string;
  timezone: string;
  is_private: boolean;
  email_notifications: boolean;
  marketing_emails: boolean;
  push_notifications: string; // "all" | "mentions" | "none"
  communication_emails: boolean;
  social_emails: boolean;
  security_emails: boolean;
  mobile_notifications_different: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Payment History
 * Maps to the `payment_history` table
 */
export interface PaymentHistory {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  order_id?: string;
  amount: number; // Amount in cents
  currency: string;
  status: string;
  description: string | null;
  invoice_url: string | null;
  created_at: string; // ISO timestamp
}

/**
 * Order
 * Maps to the `orders` table
 */
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  shipping_name: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  shipping_method: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  notes: string | null;
  customer_notes: string | null;
  coupon_code: string | null;
  stripe_coupon_id: string | null;
  shippo_transaction_id: string | null;
  shippo_rate_id: string | null;
  shippo_label_url: string | null;
  shipping_carrier: string | null;
  shipping_rate_amount: number | null; // cents
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

/**
 * Order Item
 * Maps to the `order_items` table
 */
export interface OrderItem {
  id: string;
  order_id: string;
  stripe_product_id: string;
  stripe_price_id: string;
  product_name: string;
  product_image_url: string | null;
  variant_name: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  engraving_text: string | null;
  engraving_graphic_url: string | null;
  collection: string | null;
  created_at: string;
}

/**
 * Cart Item
 * Maps to the `cart_items` table
 */
export interface CartItem {
  id: string;
  user_id: string;
  stripe_product_id: string;
  stripe_price_id: string;
  quantity: number;
  engraving_text: string | null;
  engraving_graphic_url: string | null;
  variant_name: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Shipping Address
 * Maps to the `shipping_addresses` table
 */
export interface ShippingAddress {
  id: string;
  user_id: string;
  is_default: boolean;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Email Subscriber
 * Maps to the `email_subscribers` table
 */
export interface EmailSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  source: string;
  subscribed: boolean;
  created_at: string;
}

/**
 * Type for creating/updating a user profile
 * Omits system-generated fields
 */
export type UserProfileUpdate = Partial<
  Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">
>;

