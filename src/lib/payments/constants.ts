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
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "earrings", label: "Earrings" },
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
