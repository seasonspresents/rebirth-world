-- ============================================================================
-- Supabase red-tier roundtable hardening (R-S1 through R-S6)
-- Roundtable doc: ~/AgentVault/agent-shared/handoffs/2026-04-24_rebirth-world-supabase-slice-roundtable.md
-- ============================================================================
-- Pattern: same as RYR red tier from 2026-04-21. Single migration, atomic.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- R-S1 — Secure the abandoned_carts view.
--
-- The view JOINs auth.users to expose buyer email; previously it ran as
-- SECURITY DEFINER which bypassed RLS entirely, leaking auth.users data to
-- anon and authenticated readers via PostgREST.
--
-- Fix: switch to security_invoker (respects caller's RLS) AND revoke direct
-- SELECT from anon + authenticated (only service_role consumes this from the
-- abandoned-cart cron at /api/cron/abandoned-carts, which uses the secret
-- key). service_role bypasses RLS, so the cron continues to work.
-- ---------------------------------------------------------------------------
ALTER VIEW public.abandoned_carts SET (security_invoker = on);
REVOKE SELECT ON public.abandoned_carts FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- R-S2 — Remove open UPDATE policy on site_settings.
--
-- The policy "Service role can update site settings" was named correctly but
-- implemented to apply to the `public` role with `qual=true, with_check=true`,
-- which let any anon connection UPDATE the table. service_role bypasses RLS
-- automatically, so no explicit UPDATE policy is needed.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Service role can update site settings" ON public.site_settings;

-- ---------------------------------------------------------------------------
-- R-S5 — Covering index for payment_history.order_id foreign key.
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_payment_history_order_id
  ON public.payment_history (order_id);

-- ---------------------------------------------------------------------------
-- R-S4 — Wrap auth.uid() in subselect across 11 policies.
--
-- Without the wrap, Postgres re-evaluates auth.uid() once per row scanned.
-- (SELECT auth.uid()) is treated as a scalar constant — evaluated once per
-- query. 5-10x faster on tables with thousands of rows.
-- See: https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations
-- ---------------------------------------------------------------------------

-- cart_items
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.cart_items;
CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- order_items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
    )
  );

-- payment_history
DROP POLICY IF EXISTS "Users can view their own payment history" ON public.payment_history;
CREATE POLICY "Users can view their own payment history"
  ON public.payment_history FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- shipping_addresses
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.shipping_addresses;
CREATE POLICY "Users can manage their own addresses"
  ON public.shipping_addresses FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- user_subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscription"
  ON public.user_subscriptions FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- user_profiles (4 policies)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- R-S6 — Backfill payment_history for the 48 historical orders.
--
-- Pre-2026-04-24, the webhook gated payment_history insert on `if (!isGuest)`,
-- silently dropping records for guest checkouts. The forward-fix shipped in
-- 953968b. This backfills paid orders that have no corresponding row.
--
-- Note: payment_history.user_id was NOT NULL in the original schema (boilerplate
-- assumption that all buyers were logged in). The new webhook tries to insert
-- with NULL user_id for guests; without this ALTER, those inserts silently
-- log a constraint error. This unblocks both the backfill AND the live
-- guest-purchase flow.
-- ---------------------------------------------------------------------------
ALTER TABLE public.payment_history
  ALTER COLUMN user_id DROP NOT NULL;

INSERT INTO public.payment_history (user_id, order_id, amount, currency, status, description, created_at)
SELECT
  user_id,
  id,
  total,
  currency,
  'succeeded',
  'Order ' || order_number || ' (backfilled 2026-04-24)',
  created_at
FROM public.orders o
WHERE payment_status = 'paid'
  AND NOT EXISTS (
    SELECT 1 FROM public.payment_history ph WHERE ph.order_id = o.id
  );

-- ---------------------------------------------------------------------------
-- O-S10 (cosmetic) — Explicit deny-all on stripe_webhook_events
-- to silence the rls_enabled_no_policy advisor lint. service_role bypasses
-- RLS so the webhook handler is unaffected.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Deny all public access" ON public.stripe_webhook_events;
CREATE POLICY "Deny all public access"
  ON public.stripe_webhook_events FOR ALL
  USING (false) WITH CHECK (false);

COMMIT;
