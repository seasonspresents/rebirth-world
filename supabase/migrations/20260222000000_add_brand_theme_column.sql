-- ============================================================================
-- Backfill: this migration was applied directly to prod via SQL editor
-- without being tracked. Recording it here for repo/prod parity.
-- ============================================================================
-- Adds brand_theme column to user_profiles. Default 'film-portra' is a stylistic
-- preset name (one of the 4 named CSS schemes — warm/dark/ocean/earth/film-*).
-- ============================================================================

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS brand_theme TEXT DEFAULT 'film-portra';
