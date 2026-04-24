-- ============================================================================
-- stripe_webhook_events — outbox table for Stripe webhook idempotency + replay
-- ============================================================================
-- Roundtable 2026-04-24 / Red-tier R1+R2.
--
-- Pattern: insert-first webhook handler. The handler inserts the event into
-- this table BEFORE processing. On duplicate stripe_event_id (23505
-- unique_violation), the handler returns 200 immediately with
-- {duplicate: true}, letting Stripe know delivery succeeded without
-- re-running side effects.
--
-- On handler error, the handler returns 500 (NOT 200) so Stripe retries with
-- exponential backoff for up to 3 days. processing_error stores the last
-- failure reason for the durable-queue partial index.
--
-- NOTE: This is the OPPOSITE of the Resend webhook pattern. Resend retries
-- aggressively on non-200 and we want to swallow errors there. Stripe retries
-- intelligently and we WANT it to retry on 500. Do not copy Resend's
-- return-200-after-log pattern into this handler.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id      TEXT UNIQUE NOT NULL,
  event_type           TEXT NOT NULL,
  api_version          TEXT,
  livemode             BOOLEAN NOT NULL,
  stripe_created_at    TIMESTAMPTZ NOT NULL,
  received_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload              JSONB NOT NULL,
  processed_at         TIMESTAMPTZ,
  processing_error     TEXT
);

-- Durable queue of stuck events (unprocessed) — cheap partial index
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_unprocessed
  ON public.stripe_webhook_events (received_at)
  WHERE processed_at IS NULL;

-- Lookup by type + time for ops dashboards
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type_received
  ON public.stripe_webhook_events (event_type, received_at DESC);

-- RLS: service-role only (no policies = deny-all for anon/authenticated)
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.stripe_webhook_events IS
  'Outbox for Stripe webhook events. Insert-first idempotency via stripe_event_id UNIQUE. Handler returns 500 on error so Stripe retries. Matches RYR K1 pattern.';
