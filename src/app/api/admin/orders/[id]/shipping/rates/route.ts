import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { getShippingRates } from "@/lib/shippo";
import type { Order } from "@/lib/supabase/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: order, error: dbError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!order.shipping_address_line1) {
    return NextResponse.json(
      { error: "Order has no shipping address" },
      { status: 400 }
    );
  }

  try {
    const rates = await getShippingRates(order as Order);
    return NextResponse.json({ rates });
  } catch (err) {
    console.error("Failed to get shipping rates:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get rates" },
      { status: 500 }
    );
  }
}
