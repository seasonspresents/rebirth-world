import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const syncSchema = z.object({
  items: z.array(
    z.object({
      stripeProductId: z.string(),
      stripePriceId: z.string(),
      name: z.string(),
      slug: z.string(),
      image: z.string().nullable(),
      price: z.number(),
      currency: z.string(),
      quantity: z.number().int().min(1),
      variant: z.string().nullable(),
    })
  ),
});

/**
 * POST /api/cart/sync — merge localStorage items into DB, return merged cart
 *
 * Strategy: upsert localStorage items (increment quantity), then return the
 * full DB cart so the client can reconcile.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = syncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Upsert each localStorage item into the DB
  for (const item of parsed.data.items) {
    await supabase.from("cart_items").upsert(
      {
        user_id: user.id,
        stripe_product_id: item.stripeProductId,
        stripe_price_id: item.stripePriceId,
        product_name: item.name,
        product_slug: item.slug,
        product_image: item.image,
        unit_price_cents: item.price,
        currency: item.currency,
        quantity: item.quantity,
        variant_name: item.variant,
      },
      { onConflict: "user_id,stripe_price_id,variant_name" }
    );
  }

  // Return full merged cart
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Cart sync fetch error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }

  const items = (data ?? []).map((row: Record<string, unknown>) => ({
    stripeProductId: row.stripe_product_id,
    stripePriceId: row.stripe_price_id,
    name: row.product_name,
    slug: row.product_slug,
    image: row.product_image,
    price: row.unit_price_cents,
    currency: row.currency,
    quantity: row.quantity,
    variant: row.variant_name,
  }));

  return NextResponse.json({ items });
}
