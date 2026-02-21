import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const upsertSchema = z.object({
  stripeProductId: z.string().optional(),
  stripePriceId: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
  image: z.string().nullable().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  variant: z.string().nullable().default(null),
});

const deleteItemSchema = z.object({
  stripePriceId: z.string(),
  variant: z.string().nullable().default(null),
});

/**
 * GET /api/cart — list current user's cart items
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }

  // Map DB rows to CartItemData shape
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

/**
 * POST /api/cart — upsert a cart item
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
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const item = parsed.data;

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: user.id,
      stripe_product_id: item.stripeProductId ?? "",
      stripe_price_id: item.stripePriceId,
      product_name: item.name ?? "",
      product_slug: item.slug ?? "",
      product_image: item.image ?? null,
      unit_price_cents: item.price ?? 0,
      currency: item.currency ?? "usd",
      quantity: item.quantity,
      variant_name: item.variant ?? null,
    },
    { onConflict: "user_id,stripe_price_id,variant_name" }
  );

  if (error) {
    console.error("Cart upsert error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/cart — remove a cart item, or clear entire cart if no body
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try parsing body — if present, delete single item; otherwise clear all
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // no body = clear all
  }

  if (body) {
    const parsed = deleteItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let query = supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("stripe_price_id", parsed.data.stripePriceId);

    if (parsed.data.variant) {
      query = query.eq("variant_name", parsed.data.variant);
    } else {
      query = query.is("variant_name", null);
    }

    const { error } = await query;
    if (error) {
      console.error("Cart delete error:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Cart clear error:", error);
      return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
