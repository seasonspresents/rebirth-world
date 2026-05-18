BEGIN;

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_stripe_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response TEXT,
  admin_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reviews_one_per_order_item_user UNIQUE (order_item_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_status_created_at
  ON public.reviews(product_stripe_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_created_at
  ON public.reviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_order_item_id
  ON public.reviews(order_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status_created_at
  ON public.reviews(status, created_at DESC);

CREATE OR REPLACE FUNCTION public.prevent_review_purchase_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.order_item_id IS DISTINCT FROM OLD.order_item_id
    OR NEW.user_id IS DISTINCT FROM OLD.user_id
    OR NEW.product_stripe_id IS DISTINCT FROM OLD.product_stripe_id
    OR NEW.verified_purchase IS DISTINCT FROM OLD.verified_purchase
    OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Review purchase fields cannot be changed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_reviews_purchase_changes ON public.reviews;
CREATE TRIGGER prevent_reviews_purchase_changes
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_review_purchase_changes();

DROP TRIGGER IF EXISTS set_reviews_updated_at ON public.reviews;
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
CREATE POLICY "Public can read approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

DROP POLICY IF EXISTS "Users can read their own reviews" ON public.reviews;
CREATE POLICY "Users can read their own reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create pending reviews for purchases" ON public.reviews;
CREATE POLICY "Users can create pending reviews for purchases"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND status = 'pending'
    AND verified_purchase IS TRUE
    AND admin_response IS NULL
    AND admin_response_at IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.order_items oi
      INNER JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.id = reviews.order_item_id
        AND oi.stripe_product_id = reviews.product_stripe_id
        AND o.user_id = (SELECT auth.uid())
        AND o.payment_status = 'paid'
        AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
    )
  );

DROP POLICY IF EXISTS "Users can update their own pending reviews" ON public.reviews;
CREATE POLICY "Users can update their own pending reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id AND status = 'pending')
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND status = 'pending'
    AND verified_purchase IS TRUE
    AND admin_response IS NULL
    AND admin_response_at IS NULL
  );

DROP POLICY IF EXISTS "Service role can manage reviews" ON public.reviews;
CREATE POLICY "Service role can manage reviews"
  ON public.reviews FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

COMMIT;
