export interface ShippoTrackingStatus {
  status: string;
  status_details?: string;
  status_date?: string;
}

export interface ShippoStatusMapping {
  status: string;
  fulfillment_status: string;
}

export interface ShippoWebhookUpdateResult {
  skipped: boolean;
  mapped?: ShippoStatusMapping;
  updateData?: Record<string, unknown>;
  reason?: string;
}

const STATUS_PRIORITY = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "returned",
];

export const SHIPPO_STATUS_MAP: Record<string, ShippoStatusMapping> = {
  PRE_TRANSIT: { status: "shipped", fulfillment_status: "fulfilled" },
  TRANSIT: { status: "shipped", fulfillment_status: "fulfilled" },
  DELIVERED: { status: "delivered", fulfillment_status: "fulfilled" },
  RETURNED: { status: "returned", fulfillment_status: "returned" },
  FAILURE: { status: "shipped", fulfillment_status: "fulfilled" },
};

export function buildShippoWebhookUpdate(
  currentOrderStatus: string,
  trackingStatus: ShippoTrackingStatus,
  now = new Date()
): ShippoWebhookUpdateResult {
  const mapped = SHIPPO_STATUS_MAP[trackingStatus.status];
  if (!mapped) {
    return { skipped: true, reason: "unknown_status" };
  }

  const currentPriority = STATUS_PRIORITY.indexOf(currentOrderStatus);
  const newPriority = STATUS_PRIORITY.indexOf(mapped.status);

  if (newPriority <= currentPriority && mapped.status !== "returned") {
    return { skipped: true, mapped, reason: "downgrade_protected" };
  }

  const updateData: Record<string, unknown> = {
    status: mapped.status,
    fulfillment_status: mapped.fulfillment_status,
    updated_at: now.toISOString(),
  };

  if (trackingStatus.status === "DELIVERED") {
    updateData.delivered_at = trackingStatus.status_date || now.toISOString();
  }

  if (trackingStatus.status === "FAILURE") {
    updateData.notes = `Shipping failure: ${trackingStatus.status_details || "No carrier details provided"}`;
  }

  return { skipped: false, mapped, updateData };
}
