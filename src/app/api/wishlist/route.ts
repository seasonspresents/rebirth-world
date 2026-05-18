import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyWishlistCreated } from "@/lib/ghl";
import { createClient } from "@/lib/supabase/server";

const wishlistItemSchema = z.object({
  stripeProductId: z.string(),
  stripePriceId: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  price: z.number(),
  currency: z.string(),
  collection: z.string().nullable().optional(),
  addedAt: z.string().optional(),
});

const deleteItemSchema = z.object({
  stripePriceId: z.string(),
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

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: (data ?? []).map(mapWishlistRow) });
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
  const parsed = wishlistItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const item = parsed.data;
  const { error } = await supabase.from("wishlists").upsert(
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

  if (error) {
    console.error("Wishlist upsert error:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }

  if (user.email) {
    notifyWishlistCreated({
      email: user.email,
      first_name:
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.split(" ")[0]
          : undefined,
      item_count: 1,
      wishlist_value: item.price,
      wishlist_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world"}/wishlist`,
      item_names: [item.name],
      last_activity: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = deleteItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("stripe_price_id", parsed.data.stripePriceId);

  if (error) {
    console.error("Wishlist delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove wishlist item" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
