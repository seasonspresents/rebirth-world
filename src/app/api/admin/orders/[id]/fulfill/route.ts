import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/emails";

const fulfillSchema = z.object({
  tracking_number: z.string().min(1, "Tracking number is required"),
  tracking_url: z.string().url().optional().or(z.literal("")),
  carrier: z.string().optional(),
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
  const parsed = fulfillSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Pre-flight: check order exists and is in a fulfillable state
  const { data: existing } = await supabase
    .from("orders")
    .select("id, status, email, order_number")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existing.status === "shipped" || existing.status === "delivered") {
    return NextResponse.json(
      { error: "Order is already fulfilled" },
      { status: 409 }
    );
  }

  if (existing.status === "cancelled" || existing.status === "refunded") {
    return NextResponse.json(
      { error: "Cannot fulfill a cancelled or refunded order" },
      { status: 400 }
    );
  }

  // Update order to shipped
  const { data: order, error: updateError } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      fulfillment_status: "fulfilled",
      tracking_number: parsed.data.tracking_number,
      tracking_url: parsed.data.tracking_url || null,
      shipped_at: new Date().toISOString(),
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

  // Send shipping notification email
  let emailSent = false;
  try {
    await sendEmail("shipping-notification", order.email, {
      orderNumber: order.order_number,
      trackingNumber: parsed.data.tracking_number,
      trackingUrl: parsed.data.tracking_url || undefined,
      carrier: parsed.data.carrier || undefined,
      shippingName: order.shipping_name || undefined,
    });
    emailSent = true;
  } catch (emailError) {
    console.error("Failed to send shipping notification:", emailError);
  }

  return NextResponse.json({ order, emailSent });
}
