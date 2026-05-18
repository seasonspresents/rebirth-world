import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { buildShippoWebhookUpdate } from "@/lib/shippo-webhook";

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

export async function POST(req: NextRequest) {
  // Optional webhook signature verification
  const webhookSecret = process.env.SHIPPO_WEBHOOK_SECRET;
  if (webhookSecret) {
    // Support both query param (legacy) and Authorization header (preferred)
    const queryToken = req.nextUrl.searchParams.get("token");
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");

    const isValid =
      queryToken === webhookSecret || bearerToken === webhookSecret;
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

  const { tracking_number, tracking_status } = payload.data;

  if (!tracking_number || !tracking_status?.status) {
    return NextResponse.json(
      { error: "Missing tracking data" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Find order by tracking number
  const { data: order, error: findError } = await supabase
    .from("orders")
    .select("id, status")
    .eq("tracking_number", tracking_number)
    .single();

  if (findError || !order) {
    console.warn(
      `[Shippo Webhook] No order found for tracking: ${tracking_number}`
    );
    return NextResponse.json({ received: true });
  }

  const result = buildShippoWebhookUpdate(order.status, tracking_status);
  if (result.reason === "unknown_status") {
    console.warn(`[Shippo Webhook] Unknown status: ${tracking_status.status}`);
    return NextResponse.json({ received: true });
  }

  // Don't downgrade status (e.g. delivered -> transit)
  if (result.skipped) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(result.updateData!)
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
