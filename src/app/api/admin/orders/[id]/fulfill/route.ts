import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/emails";

const fulfillSchema = z.object({
  tracking_number: z.string().optional(),
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
    .select("id, status, email, order_number, tracking_number, tracking_url, shipping_carrier")
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

  // Use provided tracking number, or fall back to one already on the order (e.g. from Shippo label purchase)
  const trackingNumber = parsed.data.tracking_number || existing.tracking_number;
  if (!trackingNumber) {
    return NextResponse.json(
      { error: "Tracking number is required. Purchase a label or enter one manually." },
      { status: 400 }
    );
  }

  const trackingUrl = parsed.data.tracking_url || existing.tracking_url || null;
  const carrierName = parsed.data.carrier || existing.shipping_carrier || null;

  // Update order to shipped
  const { data: order, error: updateError } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      fulfillment_status: "fulfilled",
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      shipping_carrier: carrierName,
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
      trackingNumber,
      trackingUrl: trackingUrl || undefined,
      carrier: carrierName || undefined,
      shippingName: order.shipping_name || undefined,
    });
    emailSent = true;
  } catch (emailError) {
    console.error("Failed to send shipping notification:", emailError);
  }

  return NextResponse.json({ order, emailSent });
}
