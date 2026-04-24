import "server-only";

import { unstable_cache } from "next/cache";
import { stripe } from "./stripe";
import Stripe from "stripe";
import type { Product } from "./constants";

// Re-export shared types and constants for server-side consumers
export { formatPrice, COLLECTIONS, type Product, type ProductMetadata } from "./constants";

// Cache TTL for the Stripe product list. 60s is a good balance between
// freshness (admins see updates within a minute) and Stripe API budget.
// Bump to 300s once the admin UI supports manual cache bust.
const PRODUCT_LIST_TTL_SECONDS = 60;

function toProduct(product: Stripe.Product, price: Stripe.Price): Product {
  const metadata = product.metadata as Product["metadata"];
  const marketingFeatures = (
    product.marketing_features ?? []
  ).map((f) => f.name ?? "").filter(Boolean);
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    metadata,
    marketingFeatures,
    slug: metadata.slug || product.id,
    price: price.unit_amount ?? 0,
    priceId: price.id,
    currency: price.currency,
    active: product.active,
  };
}

function sortProducts(products: Product[]): Product[] {
  return products.sort((a, b) => {
    const orderA = parseInt(a.metadata.sort_order ?? "999", 10);
    const orderB = parseInt(b.metadata.sort_order ?? "999", 10);
    return orderA - orderB;
  });
}

// ---------------------------------------------------------------------------
// Cached list
// ---------------------------------------------------------------------------
// O11 (roundtable 2026-04-24): We previously used stripe.products.search(),
// which is eventually consistent by up to ~60s — new products 404 on PDP
// for a minute. We also had zero caching, hitting Stripe on every page view.
//
// Fix: one cached list of ALL active products (expanded with default_price),
// filter in memory for every "search" case. At 27 products this is fast and
// avoids the search consistency lag entirely.
// ---------------------------------------------------------------------------

const _listAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
      limit: 100,
    });

    return sortProducts(
      products.data
        .filter((p) => p.default_price && typeof p.default_price !== "string")
        .map((p) => toProduct(p, p.default_price as Stripe.Price))
    );
  },
  ["stripe-products-active-list"],
  { revalidate: PRODUCT_LIST_TTL_SECONDS, tags: ["stripe-products"] }
);

/**
 * List all active products with their default prices (cached ~60s).
 */
export async function listProducts(): Promise<Product[]> {
  try {
    return await _listAllProducts();
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

/**
 * Get a single product by ID. Not cached — admin routes use this.
 */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await stripe.products.retrieve(id, {
      expand: ["default_price"],
    });
    if (!product.active || !product.default_price) return null;
    return toProduct(product, product.default_price as Stripe.Price);
  } catch {
    return null;
  }
}

/**
 * Get a product by its slug metadata.
 * Reads from the cached list + in-memory filter.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

/**
 * Get products by collection metadata.
 * Reads from the cached list + in-memory filter.
 */
export async function getProductsByCollection(
  collection: string
): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.metadata.collection === collection);
}

/**
 * Get featured products.
 * Reads from the cached list + in-memory filter.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.metadata.featured === "true").slice(0, 8);
}
