import type { Product } from "@/lib/payments/constants";

/**
 * Enriched cart item with display info + Stripe IDs
 */
export interface CartItemData {
  stripeProductId: string;
  stripePriceId: string;
  name: string;
  slug: string;
  image: string | null;
  price: number; // in cents
  currency: string;
  quantity: number;
  variant: string | null; // e.g. ring size
  collection: string | null; // e.g. "skateboard-rings", "wedding-bands", "apparel"
}

/**
 * Cart reducer actions
 */
export type CartAction =
  | { type: "ADD_ITEM"; item: CartItemData }
  | { type: "REMOVE_ITEM"; key: string }
  | { type: "UPDATE_QUANTITY"; key: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_ITEMS"; items: CartItemData[] };

/**
 * Build a CartItemData from a Product
 */
export function productToCartItem(
  product: Product,
  quantity: number,
  variant: string | null = null
): CartItemData {
  return {
    stripeProductId: product.id,
    stripePriceId: product.priceId,
    name: product.name,
    slug: product.slug,
    image: product.images[0] ?? null,
    price: product.price,
    currency: product.currency,
    quantity,
    variant,
    collection: product.metadata.collection ?? null,
  };
}

/**
 * Deduplication key matching DB constraint (stripe_price_id, variant_name)
 */
export function cartItemKey(item: CartItemData): string {
  return `${item.stripePriceId}::${item.variant ?? ""}`;
}
