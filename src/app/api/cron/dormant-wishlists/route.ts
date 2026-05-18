import { NextRequest, NextResponse } from "next/server";
import { notifyDormantWishlist } from "@/lib/ghl";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get("dry_run") === "true";
  const supabase = createServiceClient();

  const { data: dormantWishlists, error } = await supabase
    .from("dormant_wishlists")
    .select("*");

  if (error || !dormantWishlists) {
    console.error("Dormant wishlist query failed:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";
  const payloads = dormantWishlists.map((wishlist) => ({
    email: wishlist.email,
    first_name: wishlist.full_name?.split(" ")[0],
    item_count: wishlist.item_count,
    wishlist_value: wishlist.wishlist_value ?? 0,
    wishlist_url: `${siteUrl}/wishlist`,
    item_names:
      typeof wishlist.item_names === "string"
        ? wishlist.item_names.split(", ").filter(Boolean)
        : [],
    last_activity: wishlist.last_activity,
  }));

  if (!dryRun) {
    for (const payload of payloads) {
      notifyDormantWishlist(payload);
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    eligible: payloads.length,
    notified: dryRun ? 0 : payloads.length,
    sample: payloads.slice(0, 5).map((payload) => ({
      email: payload.email,
      item_count: payload.item_count,
      wishlist_value: payload.wishlist_value,
      last_activity: payload.last_activity,
    })),
  });
}
