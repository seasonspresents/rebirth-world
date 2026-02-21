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
