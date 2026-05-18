import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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
      collection: z.string().nullable().optional(),
    })
  ),
});

function mapWishlistRow(row: Record<string, unknown>) {
  return {
    stripeProductId: row.stripe_product_id,
    stripePriceId: row.stripe_price_id,
    name: row.product_name,
    slug: row.product_slug,
    image: row.product_image,
    price: row.unit_price_cents,
    currency: row.currency,
    collection: row.product_collection,
    addedAt: row.created_at,
  };
}

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

  for (const item of parsed.data.items) {
    await supabase.from("wishlists").upsert(
      {
        user_id: user.id,
        stripe_product_id: item.stripeProductId,
        stripe_price_id: item.stripePriceId,
        product_name: item.name,
        product_slug: item.slug,
        product_image: item.image,
        unit_price_cents: item.price,
        currency: item.currency,
        product_collection: item.collection ?? null,
      },
      { onConflict: "user_id,stripe_price_id" }
    );
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Wishlist sync fetch error:", error);
    return NextResponse.json(
      { error: "Failed to sync wishlist" },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: (data ?? []).map(mapWishlistRow) });
}
