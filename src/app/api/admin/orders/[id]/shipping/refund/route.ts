import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { refundLabel } from "@/lib/shippo";

/**
 * Admin endpoint: Request a refund for an unused Shippo shipping label
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, shippo_transaction_id, status, tracking_number")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!order.shippo_transaction_id) {
    return NextResponse.json(
      { error: "No shipping label to refund" },
      { status: 400 }
    );
  }

  if (order.status === "delivered") {
    return NextResponse.json(
      { error: "Cannot refund label for a delivered order" },
      { status: 400 }
    );
  }

  try {
    const refund = await refundLabel(order.shippo_transaction_id);

    // Clear shipping label fields on the order
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        shippo_transaction_id: null,
        shippo_label_url: null,
        tracking_number: null,
        tracking_url: null,
        shipping_carrier: null,
        shipping_rate_amount: null,
        fulfillment_status: "unfulfilled",
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update order after refund:", updateError);
      return NextResponse.json(
        { error: "Refund processed but order update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ refund, message: "Label refund requested" });
  } catch (err) {
    console.error("Failed to refund label:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Refund failed" },
      { status: 500 }
    );
  }
}
