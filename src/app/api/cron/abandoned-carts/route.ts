import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyAbandonedCart } from "@/lib/ghl";

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get("dry_run") === "true";
  const supabase = createServiceClient();

  const { data: abandonedCarts, error } = await supabase
    .from("abandoned_carts")
    .select("*");

  if (error || !abandonedCarts) {
    console.error("Abandoned cart query failed:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";
  const payloads = abandonedCarts.map((cart) => ({
    email: cart.email,
    first_name: cart.full_name?.split(" ")[0],
    item_count: cart.item_count,
    cart_value: cart.cart_value ?? 0,
    recovery_url: `${siteUrl}/cart`,
    last_activity: cart.last_activity,
  }));

  if (!dryRun) {
    for (const payload of payloads) {
      notifyAbandonedCart(payload);
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
      cart_value: payload.cart_value,
      last_activity: payload.last_activity,
    })),
  });
}
