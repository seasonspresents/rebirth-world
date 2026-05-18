import type Stripe from "stripe";

export function getUserIdFromCheckoutMetadata(
  metadata: Stripe.Metadata | null
): string | null {
  const id = metadata?.user_id;
  return id && id !== "guest" ? id : null;
}

export function getShippoRateIdFromCheckoutMetadata(
  metadata: Stripe.Metadata | null
): string | null {
  const rateId = metadata?.shippo_rate_id;
  return rateId && rateId !== "free_shipping" ? rateId : null;
}

export function parseCheckoutItemVariants(
  metadata: Stripe.Metadata | null
): Record<string, string> {
  const variants: Record<string, string> = {};
  const raw = metadata?.item_variants;
  if (!raw) return variants;

  const parsed = JSON.parse(raw) as Array<{
    priceId?: unknown;
    variant?: unknown;
  }>;

  for (const item of parsed) {
    if (typeof item.priceId === "string" && typeof item.variant === "string") {
      variants[item.priceId] = item.variant;
    }
  }

  return variants;
}

export function getExpandedProduct(
  price: Stripe.Price | null | undefined
): Stripe.Product | null {
  const product = price?.product;
  if (!product || typeof product === "string") return null;
  if ("deleted" in product && product.deleted) return null;

  return product as Stripe.Product;
}

export function buildOrderItemsFromStripeLineItems(
  orderId: string,
  lineItems: Stripe.LineItem[],
  itemVariantsMap: Record<string, string>
) {
  return lineItems.map((lineItem) => {
    const price = lineItem.price;
    const product = getExpandedProduct(price);
    const unitPrice = price?.unit_amount ?? 0;
    const quantity = lineItem.quantity ?? 1;
    const variantRaw = price?.id ? itemVariantsMap[price.id] : null;
    let variantName: string | null = null;
    let engravingText: string | null = null;

    if (variantRaw) {
      const parts = variantRaw.split("|");
      variantName = parts[0] || null;
      engravingText = parts[1] || null;
    }

    return {
      order_id: orderId,
      stripe_product_id: product?.id ?? null,
      stripe_price_id: price?.id ?? null,
      product_name: lineItem.description ?? product?.name ?? "Unknown",
      product_image_url: product?.images?.[0] ?? null,
      variant_name: variantName,
      engraving_text: engravingText,
      collection: product?.metadata?.collection ?? null,
      unit_price: unitPrice,
      quantity,
      total_price: unitPrice * quantity,
    };
  });
}
