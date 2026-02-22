/**
 * Shared product types and constants
 * (No server-only imports — safe to use in client components)
 */

/**
 * Product metadata from Stripe
 */
export interface ProductMetadata {
  collection?: string;
  material?: string;
  ring_sizes?: string; // comma-separated: "6,7,8,9,10,11,12"
  slug?: string;
  featured?: string; // "true" | "false"
  subtitle?: string; // poetic material descriptor
  story?: string; // 1-2 sentence origin story
  care_instructions?: string;
  handmade_note?: string; // artisan callout
  lead_time?: string; // days to craft, e.g. "5-7"
  weight?: string; // grams
  engraving_available?: string; // "true" | "false"
  compare_at_price?: string; // cents, for strikethrough pricing
  badge_text?: string; // custom badge text
  sort_order?: string; // numeric string for manual ordering
}

/**
 * Product with price info, resolved from Stripe
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  metadata: ProductMetadata;
  marketingFeatures: string[];
  slug: string;
  price: number; // in cents
  priceId: string;
  currency: string;
  active: boolean;
}

/**
 * Available collections
 */
export const COLLECTIONS = [
  { slug: "skateboard-rings", label: "Skateboard Rings" },
  { slug: "wedding-bands", label: "Wedding Bands" },
  { slug: "apparel", label: "Apparel" },
] as const;

/**
 * Per-collection color theming.
 * Each collection maps to a primary/accent pair for product cards,
 * shop headers, and product detail pages.
 */
export const COLLECTION_COLORS: Record<
  string,
  { primary: string; accent: string; bg: string; muted: string }
> = {
  "skateboard-rings": {
    primary: "#2a9d8f",
    accent: "#e07a3a",
    bg: "#f5f0e8",
    muted: "#8a8578",
  },
  "wedding-bands": {
    primary: "#8b7355",
    accent: "#c76b8a",
    bg: "#f2ede5",
    muted: "#a09a8e",
  },
  apparel: {
    primary: "#4a7c59",
    accent: "#e07a3a",
    bg: "#f0ede6",
    muted: "#8a8578",
  },
};

/**
 * Get CSS custom property style object for a collection.
 * Apply to a container to enable `text-[var(--collection-primary)]` etc.
 */
export function getCollectionStyle(
  collection?: string
): React.CSSProperties | undefined {
  if (!collection || !COLLECTION_COLORS[collection]) return undefined;
  const colors = COLLECTION_COLORS[collection];
  return {
    "--collection-primary": colors.primary,
    "--collection-accent": colors.accent,
    "--collection-bg": colors.bg,
    "--collection-muted": colors.muted,
  } as React.CSSProperties;
}

/**
 * Format price in cents to display string
 */
export function formatPrice(amountInCents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountInCents / 100);
}
