import type { Product } from "@/lib/payments/constants";
import { resolveProductImage } from "@/lib/product-images";

export interface WishlistItemData {
  stripeProductId: string;
  stripePriceId: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  currency: string;
  collection: string | null;
  addedAt: string;
}

export function productToWishlistItem(product: Product): WishlistItemData {
  return {
    stripeProductId: product.id,
    stripePriceId: product.priceId,
    name: product.name,
    slug: product.slug,
    image: resolveProductImage(product.images[0]),
    price: product.price,
    currency: product.currency,
    collection: product.metadata.collection ?? null,
    addedAt: new Date().toISOString(),
  };
}

export function wishlistItemKey(
  item: Pick<WishlistItemData, "stripePriceId">
): string {
  return item.stripePriceId;
}
