import "server-only";

import { Shippo } from "shippo";
import type { Order } from "@/lib/supabase/types";

let _shippo: Shippo | null = null;

function getShippo(): Shippo {
  if (!_shippo) {
    _shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY! });
  }
  return _shippo;
}

export const shippo = new Proxy({} as Shippo, {
  get(_, prop) {
    return (getShippo() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/**
 * Build the sender (from) address from env vars
 */
export function getFromAddress() {
  return {
    name: process.env.SHIPPO_FROM_NAME || "Rebirth World",
    street1: process.env.SHIPPO_FROM_STREET1 || "",
    city: process.env.SHIPPO_FROM_CITY || "",
    state: process.env.SHIPPO_FROM_STATE || "HI",
    zip: process.env.SHIPPO_FROM_ZIP || "",
    country: process.env.SHIPPO_FROM_COUNTRY || "US",
    phone: process.env.SHIPPO_FROM_PHONE || "",
    email: process.env.SHIPPO_FROM_EMAIL || "hello@rebirth.world",
  };
}

/**
 * Default parcel for jewelry (small box: 6x4x2in, 4oz)
 */
const DEFAULT_PARCEL = {
  length: "6",
  width: "4",
  height: "2",
  distanceUnit: "in" as const,
  weight: "4",
  massUnit: "oz" as const,
};

export interface ShippingRate {
  rateId: string;
  carrier: string;
  service: string;
  price: string;
  priceCents: number;
  currency: string;
  estimatedDays: number | null;
  durationTerms: string | null;
}

/**
 * Get shipping rates for an order
 */
export async function getShippingRates(order: Order): Promise<ShippingRate[]> {
  const fromAddress = getFromAddress();

  const shipment = await shippo.shipments.create({
    addressFrom: fromAddress,
    addressTo: {
      name: order.shipping_name || "",
      street1: order.shipping_address_line1 || "",
      street2: order.shipping_address_line2 || undefined,
      city: order.shipping_city || "",
      state: order.shipping_state || "",
      zip: order.shipping_postal_code || "",
      country: order.shipping_country || "US",
    },
    parcels: [DEFAULT_PARCEL],
    async: false,
  });

  return (shipment.rates || [])
    .map((rate) => ({
      rateId: rate.objectId,
      carrier: rate.provider,
      service: rate.servicelevel?.name || rate.servicelevel?.token || "Standard",
      price: rate.amount,
      priceCents: Math.round(parseFloat(rate.amount) * 100),
      currency: rate.currency,
      estimatedDays: rate.estimatedDays ?? null,
      durationTerms: rate.durationTerms ?? null,
    }))
    .sort((a, b) => a.priceCents - b.priceCents);
}

export interface LabelResult {
  trackingNumber: string;
  trackingUrl: string;
  labelUrl: string;
  transactionId: string;
  carrier: string;
  rateCents: number;
}

/**
 * Purchase a shipping label from a Shippo rate
 */
export async function purchaseLabel(rateId: string): Promise<LabelResult> {
  const transaction = await shippo.transactions.create({
    rate: rateId,
    labelFileType: "PDF",
    async: false,
  });

  if (transaction.status !== "SUCCESS") {
    const messages = transaction.messages?.map((m) => m.text).join("; ") || "Unknown error";
    throw new Error(`Label purchase failed: ${messages}`);
  }

  return {
    trackingNumber: transaction.trackingNumber || "",
    trackingUrl: transaction.trackingUrlProvider || "",
    labelUrl: transaction.labelUrl || "",
    transactionId: transaction.objectId || "",
    carrier: typeof transaction.rate === "object" ? transaction.rate?.provider || "" : "",
    rateCents: typeof transaction.rate === "object" ? Math.round(parseFloat(transaction.rate?.amount || "0") * 100) : 0,
  };
}
