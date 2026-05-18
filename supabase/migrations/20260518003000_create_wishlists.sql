BEGIN;

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  product_name TEXT NOT NULL DEFAULT '',
  product_slug TEXT NOT NULL DEFAULT '',
  product_image TEXT,
  unit_price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  product_collection TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_wishlist_item UNIQUE (user_id, stripe_price_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id
  ON public.wishlists(user_id);

CREATE INDEX IF NOT EXISTS idx_wishlists_created_at
  ON public.wishlists(created_at DESC);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own wishlists" ON public.wishlists;
CREATE POLICY "Users manage own wishlists"
  ON public.wishlists FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP TRIGGER IF EXISTS set_wishlists_updated_at ON public.wishlists;
CREATE TRIGGER set_wishlists_updated_at
  BEFORE UPDATE ON public.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE VIEW public.dormant_wishlists AS
SELECT
  w.user_id,
  up.full_name,
  u.email,
  COUNT(w.id) AS item_count,
  COALESCE(SUM(w.unit_price_cents), 0) AS wishlist_value,
  STRING_AGG(NULLIF(w.product_name, ''), ', ' ORDER BY w.created_at) AS item_names,
  MIN(w.created_at) AS first_saved_at,
  MAX(w.updated_at) AS last_activity
FROM public.wishlists w
JOIN auth.users u ON u.id = w.user_id
LEFT JOIN public.user_profiles up ON up.user_id = w.user_id
WHERE w.created_at < NOW() - INTERVAL '7 days'
AND NOT EXISTS (
  SELECT 1
  FROM public.orders o
  JOIN public.order_items oi ON oi.order_id = o.id
  WHERE o.user_id = w.user_id
  AND oi.stripe_price_id = w.stripe_price_id
  AND o.created_at > w.created_at
)
GROUP BY w.user_id, up.full_name, u.email;

ALTER VIEW public.dormant_wishlists SET (security_invoker = on);
REVOKE SELECT ON public.dormant_wishlists FROM anon, authenticated;

COMMIT;
