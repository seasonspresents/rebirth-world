-- Add product display columns to cart_items
-- These are needed by the cart API to return product info without extra lookups
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS product_name TEXT,
  ADD COLUMN IF NOT EXISTS product_slug TEXT,
  ADD COLUMN IF NOT EXISTS product_image TEXT,
  ADD COLUMN IF NOT EXISTS unit_price_cents INTEGER,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';

-- Update the unique constraint to match the upsert conflict target
-- The existing constraint includes engraving_text, but the API upserts on (user_id, stripe_price_id, variant_name)
-- We need to drop the old one and create the correct one
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS unique_cart_item;
ALTER TABLE public.cart_items ADD CONSTRAINT unique_cart_item UNIQUE (user_id, stripe_price_id, variant_name);
