import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Shippo Tracking Webhook
 *
 * Receives tracking status updates from Shippo and updates order status.
 * Register this URL in Shippo Dashboard → Webhooks → Track Updated
 * URL: https://rebirth.world/api/webhooks/shippo
 */

interface ShippoTrackingEvent {
  data: {
    tracking_number: string;
    tracking_status: {
      status: string; // UNKNOWN | PRE_TRANSIT | TRANSIT | DELIVERED | RETURNED | FAILURE
      status_details: string;
      status_date: string;
      location?: {
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
      };
    };
    tracking_history: Array<{
      status: string;
      status_details: string;
      status_date: string;
    }>;
    carrier: string;
    eta?: string;
  };
  event: string;
  test: boolean;
}

const STATUS_MAP: Record<string, { status: string; fulfillment_status: string }> = {
  PRE_TRANSIT: { status: "shipped", fulfillment_status: "fulfilled" },
  TRANSIT: { status: "shipped", fulfillment_status: "fulfilled" },
  DELIVERED: { status: "delivered", fulfillment_status: "fulfilled" },
  RETURNED: { status: "returned", fulfillment_status: "returned" },
  FAILURE: { status: "shipped", fulfillment_status: "fulfilled" }, // keep as shipped, flag in notes
};

export async function POST(req: NextRequest) {
  // Optional webhook signature verification
  const webhookSecret = process.env.SHIPPO_WEBHOOK_SECRET;
  if (webhookSecret) {
    // Support both query param (legacy) and Authorization header (preferred)
    const queryToken = req.nextUrl.searchParams.get("token");
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");
    
    const isValid = queryToken === webhookSecret || bearerToken === webhookSecret;
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let payload: ShippoTrackingEvent;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event !== "track_updated") {
    // Acknowledge unknown events gracefully
    console.log(`[Shippo Webhook] Ignoring event: ${payload.event}`);
    return NextResponse.json({ received: true });
  }

  const { tracking_number, tracking_status, carrier } = payload.data;

  if (!tracking_number || !tracking_status?.status) {
    return NextResponse.json({ error: "Missing tracking data" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Find order by tracking number
  const { data: order, error: findError } = await supabase
    .from("orders")
    .select("id, status")
    .eq("tracking_number", tracking_number)
    .single();

  if (findError || !order) {
    console.warn(`[Shippo Webhook] No order found for tracking: ${tracking_number}`);
    return NextResponse.json({ received: true });
  }

  // Don't downgrade status (e.g. delivered → transit)
  const statusPriority = ["pending", "processing", "shipped", "delivered", "returned"];
  const mapped = STATUS_MAP[tracking_status.status];
  if (!mapped) {
    console.warn(`[Shippo Webhook] Unknown status: ${tracking_status.status}`);
    return NextResponse.json({ received: true });
  }

  const currentPriority = statusPriority.indexOf(order.status);
  const newPriority = statusPriority.indexOf(mapped.status);

  if (newPriority <= currentPriority && mapped.status !== "returned") {
    return NextResponse.json({ received: true, skipped: true });
  }

  const updateData: Record<string, unknown> = {
    status: mapped.status,
    fulfillment_status: mapped.fulfillment_status,
    updated_at: new Date().toISOString(),
  };

  if (tracking_status.status === "DELIVERED") {
    updateData.delivered_at = tracking_status.status_date || new Date().toISOString();
  }

  if (tracking_status.status === "FAILURE") {
    updateData.notes = `Shipping failure: ${tracking_status.status_details}`;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", order.id);

  if (updateError) {
    console.error("[Shippo Webhook] Failed to update order:", updateError);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  console.log(
    `[Shippo Webhook] Order ${order.id} updated: ${tracking_status.status} (${tracking_status.status_details})`
  );

  return NextResponse.json({ received: true, updated: true });
}
