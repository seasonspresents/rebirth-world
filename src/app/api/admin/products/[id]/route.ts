import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { stripe } from "@/lib/payments/stripe";
import { getProduct } from "@/lib/payments/products";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  active: z.boolean().optional(),
  price: z.number().int().positive().optional(), // cents
  metadata: z
    .object({
      collection: z.string().optional(),
      material: z.string().optional(),
      ring_sizes: z.string().optional(),
      slug: z.string().optional(),
      featured: z.string().optional(),
      subtitle: z.string().optional(),
      story: z.string().optional(),
      care_instructions: z.string().optional(),
      handmade_note: z.string().optional(),
      lead_time: z.string().optional(),
      weight: z.string().optional(),
      engraving_available: z.string().optional(),
      compare_at_price: z.string().optional(),
      badge_text: z.string().optional(),
      sort_order: z.string().optional(),
    })
    .optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;

  try {
    // Fetch directly from Stripe to include inactive products
    const stripeProduct = await stripe.products.retrieve(id, {
      expand: ["default_price"],
    });

    if (!stripeProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const price = stripeProduct.default_price;
    const priceObj = typeof price === "object" && price ? price : null;

    return NextResponse.json({
      product: {
        id: stripeProduct.id,
        name: stripeProduct.name,
        description: stripeProduct.description,
        images: stripeProduct.images,
        metadata: stripeProduct.metadata,
        active: stripeProduct.active,
        price: priceObj?.unit_amount ?? 0,
        priceId: priceObj?.id ?? "",
        currency: priceObj?.currency ?? "usd",
      },
    });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { price: newPrice, metadata, ...productFields } = parsed.data;

  try {
    // Build Stripe product update payload
    const updatePayload: Record<string, unknown> = {};

    if (productFields.name !== undefined) updatePayload.name = productFields.name;
    if (productFields.description !== undefined) updatePayload.description = productFields.description;
    if (productFields.images !== undefined) updatePayload.images = productFields.images;
    if (productFields.active !== undefined) updatePayload.active = productFields.active;
    if (metadata) updatePayload.metadata = metadata;

    // If price changed, create a new Stripe Price and set as default
    if (newPrice !== undefined) {
      // Get current product to check existing price
      const current = await stripe.products.retrieve(id, {
        expand: ["default_price"],
      });
      const currentPrice =
        typeof current.default_price === "object" && current.default_price
          ? current.default_price.unit_amount
          : null;

      if (currentPrice !== newPrice) {
        const priceObj = await stripe.prices.create({
          product: id,
          unit_amount: newPrice,
          currency: "usd",
        });
        updatePayload.default_price = priceObj.id;
      }
    }

    // Update the product in Stripe
    if (Object.keys(updatePayload).length > 0) {
      await stripe.products.update(id, updatePayload);
    }

    // Re-fetch the updated product
    const product = await getProduct(id);

    return NextResponse.json({ product });
  } catch (err) {
    console.error("Failed to update product:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update product" },
      { status: 500 }
    );
  }
}
