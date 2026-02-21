import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyAbandonedCart } from "@/lib/ghl";

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: abandonedCarts, error } = await supabase
    .from("abandoned_carts")
    .select("*");

  if (error || !abandonedCarts) {
    console.error("Abandoned cart query failed:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  for (const cart of abandonedCarts) {
    notifyAbandonedCart({
      email: cart.email,
      first_name: cart.full_name?.split(" ")[0],
      item_count: cart.item_count,
      cart_value: cart.cart_value ?? 0,
      recovery_url: "https://rebirth.world/cart",
      last_activity: cart.last_activity,
    });
  }

  return NextResponse.json({
    success: true,
    processed: abandonedCarts.length,
  });
}
