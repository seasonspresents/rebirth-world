-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,  -- Human-readable: RB-0001, RB-0002
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- nullable for guest checkout
  email TEXT NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, confirmed, processing, shipped, delivered, cancelled, refunded
  payment_status TEXT NOT NULL DEFAULT 'unpaid',  -- unpaid, paid, refunded, partially_refunded
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled',  -- unfulfilled, partial, fulfilled

  -- Financials (all in cents)
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',

  -- Shipping
  shipping_name TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  shipping_method TEXT,
  tracking_number TEXT,
  tracking_url TEXT,

  -- Metadata
  notes TEXT,  -- internal admin notes
  customer_notes TEXT,  -- notes from customer at checkout
  coupon_code TEXT,
  stripe_coupon_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_email ON public.orders(email);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  -- Product info (snapshot at time of purchase)
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT,

  -- Variant info
  variant_name TEXT,  -- e.g., "Size 7", "Black Steel + Irish Bog Oak"

  -- Pricing (cents)
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,

  -- Customization
  engraving_text TEXT,  -- up to 10 characters
  engraving_graphic_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- CART ITEMS TABLE (persistent cart)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,

  -- Customization
  engraving_text TEXT,
  engraving_graphic_url TEXT,
  variant_name TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate product+variant combos per user
  CONSTRAINT unique_cart_item UNIQUE (user_id, stripe_price_id, variant_name, engraving_text)
);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SHIPPING ADDRESSES TABLE (saved addresses)
-- ============================================
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipping_addresses_user_id ON public.shipping_addresses(user_id);

ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses"
  ON public.shipping_addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- EMAIL SUBSCRIBERS TABLE (newsletter)
-- ============================================
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  source TEXT DEFAULT 'website',  -- website, checkout, popup, footer
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Public insert (anyone can subscribe)
CREATE POLICY "Anyone can subscribe"
  ON public.email_subscribers FOR INSERT
  WITH CHECK (true);

-- ============================================
-- ABANDONED CARTS VIEW (for recovery emails)
-- ============================================
CREATE VIEW public.abandoned_carts AS
SELECT
  ci.user_id,
  up.full_name,
  u.email,
  COUNT(ci.id) as item_count,
  MAX(ci.updated_at) as last_activity
FROM public.cart_items ci
JOIN auth.users u ON u.id = ci.user_id
LEFT JOIN public.user_profiles up ON up.user_id = ci.user_id
WHERE ci.updated_at < NOW() - INTERVAL '1 hour'
AND NOT EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.user_id = ci.user_id
  AND o.created_at > ci.updated_at
)
GROUP BY ci.user_id, up.full_name, u.email;

-- ============================================
-- UPDATE payment_history to reference orders
-- ============================================
ALTER TABLE public.payment_history
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id),
  ALTER COLUMN stripe_subscription_id DROP NOT NULL;

-- ============================================
-- ORDER NUMBER SEQUENCE
-- ============================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RB-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_shipping_addresses_updated_at
  BEFORE UPDATE ON public.shipping_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
