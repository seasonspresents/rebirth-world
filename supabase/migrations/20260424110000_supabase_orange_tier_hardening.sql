-- ============================================================================
-- Supabase orange-tier roundtable hardening (O-S2, O-S7, O-S8)
-- Roundtable doc: ~/AgentVault/agent-shared/handoffs/2026-04-24_rebirth-world-supabase-slice-roundtable.md
-- ============================================================================
-- Auth config changes (O-S1, O-S3, O-S4) are applied via the Management API
-- and don't go in this migration.
-- O-S5 (SMTP via Resend) and O-S6 (OAuth) are deferred — depend on Daniel's
-- new Resend key + Google Cloud project respectively.
-- O-S9 (email_subscribers rate limit) is deferred — needs edge rate limiting,
-- same blocked path as Stripe O7.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- O-S2 — Pin function search_path to prevent search-path injection
--
-- The advisor flagged both functions with mutable search_path. A user with
-- the ability to set their search_path could shadow built-in operators or
-- types and trigger unintended behavior. SET search_path in the function
-- body itself locks down resolution.
--
-- Empty search_path forces fully-qualified references, which is the strictest
-- interpretation. Both functions only use built-in pg_catalog symbols and
-- public.order_number_seq.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  RETURN 'RB-' || LPAD(nextval('public.order_number_seq')::TEXT, 4, '0');
END;
$$;

-- ---------------------------------------------------------------------------
-- O-S7 — Drop vestigial stripe_products table
--
-- 0 rows. No references in src/. Pricing is fetched live from Stripe API.
-- The "Anyone can view active products" RLS policy is dropped automatically
-- when the table is.
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS public.stripe_products CASCADE;

-- ---------------------------------------------------------------------------
-- O-S8 — Drop vestigial user_subscriptions table
--
-- Boilerplate leftover from the SaaS template. Rebirth has no subscriptions.
-- The UNIQUE constraint on user_id was also blocking future multi-product
-- expansion (RYR specifically dropped this same constraint). Cleanest path
-- is just to drop the whole table since src/ has no references.
--
-- payment_history.order_id (added in 20260220000000_create_ecommerce_tables)
-- already references orders.id directly, so payment tracking is unaffected.
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;

COMMIT;
