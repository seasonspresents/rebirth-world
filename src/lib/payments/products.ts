import "server-only";

import { stripe } from "./stripe";
import Stripe from "stripe";
import type { Product } from "./constants";

// Re-export shared types and constants for server-side consumers
export { formatPrice, COLLECTIONS, type Product, type ProductMetadata } from "./constants";

function toProduct(product: Stripe.Product, price: Stripe.Price): Product {
  const metadata = product.metadata as Product["metadata"];
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    metadata,
    slug: metadata.slug || product.id,
    price: price.unit_amount ?? 0,
    priceId: price.id,
    currency: price.currency,
    active: product.active,
  };
}

/**
 * List all active products with their default prices
 */
export async function listProducts(): Promise<Product[]> {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
    limit: 100,
  });

  return products.data
    .filter((p) => p.default_price && typeof p.default_price !== "string")
    .map((p) => toProduct(p, p.default_price as Stripe.Price));
}

/**
 * Get a single product by ID
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
 * Get a product by its slug metadata
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await stripe.products.search({
    query: `active:'true' AND metadata['slug']:'${slug}'`,
    expand: ["data.default_price"],
    limit: 1,
  });

  const product = products.data[0];
  if (!product || !product.default_price) return null;
  return toProduct(product, product.default_price as Stripe.Price);
}

/**
 * Get products by collection metadata
 */
export async function getProductsByCollection(
  collection: string
): Promise<Product[]> {
  const products = await stripe.products.search({
    query: `active:'true' AND metadata['collection']:'${collection}'`,
    expand: ["data.default_price"],
    limit: 100,
  });

  return products.data
    .filter((p) => p.default_price && typeof p.default_price !== "string")
    .map((p) => toProduct(p, p.default_price as Stripe.Price));
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await stripe.products.search({
    query: `active:'true' AND metadata['featured']:'true'`,
    expand: ["data.default_price"],
    limit: 8,
  });

  return products.data
    .filter((p) => p.default_price && typeof p.default_price !== "string")
    .map((p) => toProduct(p, p.default_price as Stripe.Price));
}
