-- ============================================================================
-- Backfill: this migration was applied directly to prod via SQL editor
-- without being tracked. Recording it here for repo/prod parity.
-- ============================================================================
-- site_settings — single-row config table for store-wide settings (brand_theme,
-- future flags). The id is fixed to 'default' so there's only ever one row.
--
-- RLS: anon + authenticated can READ (so the storefront can read brand_theme
-- without auth). Mutations are service-role only — service_role bypasses RLS,
-- so we don't need an explicit UPDATE policy.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id          TEXT PRIMARY KEY DEFAULT 'default',
  brand_theme TEXT DEFAULT 'film-portra',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Default singleton row
INSERT INTO public.site_settings (id, brand_theme)
VALUES ('default', 'film-portra')
ON CONFLICT (id) DO NOTHING;
