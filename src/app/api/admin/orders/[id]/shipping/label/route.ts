import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { purchaseLabel } from "@/lib/shippo";

const labelSchema = z.object({
  rateId: z.string().min(1, "Rate ID is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = labelSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Verify order exists
  const { data: existing } = await supabase
    .from("orders")
    .select("id, shippo_transaction_id")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existing.shippo_transaction_id) {
    return NextResponse.json(
      { error: "A label has already been purchased for this order" },
      { status: 409 }
    );
  }

  try {
    const label = await purchaseLabel(parsed.data.rateId);

    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        tracking_number: label.trackingNumber,
        tracking_url: label.trackingUrl,
        shippo_transaction_id: label.transactionId,
        shippo_label_url: label.labelUrl,
        shipping_carrier: label.carrier,
        shipping_rate_amount: label.rateCents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError || !order) {
      return NextResponse.json(
        { error: updateError?.message || "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order, label });
  } catch (err) {
    console.error("Failed to purchase label:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to purchase label" },
      { status: 500 }
    );
  }
}
