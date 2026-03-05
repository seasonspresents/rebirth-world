import "server-only";

import { Shippo } from "shippo";
import type { Order } from "@/lib/supabase/types";

/* -------------------------------------------------------------------------- */
/*  Shippo Client (lazy singleton)                                            */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Sender (From) Address                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Dynamic Parcel Sizing                                                     */
/* -------------------------------------------------------------------------- */

export type ProductCategory = "jewelry" | "clothing" | "mixed";

interface ParcelDimensions {
  length: string;
  width: string;
  height: string;
  distanceUnit: "in";
  weight: string;
  massUnit: "oz";
}

const PARCEL_TEMPLATES: Record<ProductCategory, ParcelDimensions> = {
  jewelry: {
    length: "6",
    width: "4",
    height: "2",
    distanceUnit: "in",
    weight: "4",
    massUnit: "oz",
  },
  clothing: {
    length: "12",
    width: "10",
    height: "2",
    distanceUnit: "in",
    weight: "8",
    massUnit: "oz",
  },
  mixed: {
    length: "14",
    width: "10",
    height: "6",
    distanceUnit: "in",
    weight: "16",
    massUnit: "oz",
  },
};

interface CartItemForParcel {
  collection?: string;
  quantity: number;
  weight_oz?: number;
}

/**
 * Determine parcel size from cart items based on product collections.
 * - All jewelry → small box
 * - All clothing → poly mailer
 * - Mixed or unknown → medium box
 */
export function getParcelForItems(items: CartItemForParcel[]): ParcelDimensions {
  const collections = new Set(
    items.map((i) => {
      if (!i.collection) return "unknown";
      if (i.collection.includes("ring") || i.collection.includes("band")) return "jewelry";
      if (i.collection.includes("apparel") || i.collection.includes("clothing")) return "clothing";
      return "unknown";
    })
  );

  // Calculate total weight from items if provided
  const totalWeight = items.reduce((sum, item) => {
    return sum + (item.weight_oz || 0) * item.quantity;
  }, 0);

  let category: ProductCategory;
  if (collections.size === 1 && collections.has("jewelry")) {
    category = "jewelry";
  } else if (collections.size === 1 && collections.has("clothing")) {
    category = "clothing";
  } else {
    category = "mixed";
  }

  const parcel = { ...PARCEL_TEMPLATES[category] };

  // Override weight if we have actual item weights
  if (totalWeight > 0) {
    parcel.weight = String(Math.max(totalWeight, parseFloat(parcel.weight)));
  }

  return parcel;
}

/* -------------------------------------------------------------------------- */
/*  Address Validation                                                        */
/* -------------------------------------------------------------------------- */

export interface AddressInput {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AddressValidationResult {
  isValid: boolean;
  messages: string[];
  suggestedAddress: AddressInput | null;
}

/**
 * Validate a shipping address via Shippo.
 * Returns whether the address is valid plus any suggested corrections.
 */
export async function validateAddress(
  address: AddressInput
): Promise<AddressValidationResult> {
  const result = await shippo.addresses.create({
    name: address.name,
    street1: address.street1,
    street2: address.street2 || undefined,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
    validate: true,
  });

  const isValid = result.validationResults?.isValid ?? false;
  const messages =
    result.validationResults?.messages?.map(
      (m) => m.text || "Unknown validation issue"
    ) || [];

  const suggestedAddress: AddressInput | null = isValid
    ? null
    : {
        name: address.name,
        street1: result.street1 || address.street1,
        street2: result.street2 || address.street2 || "",
        city: result.city || address.city,
        state: result.state || address.state,
        zip: result.zip || address.zip,
        country: result.country || address.country,
      };

  return { isValid, messages, suggestedAddress };
}

/* -------------------------------------------------------------------------- */
/*  Shipping Rates                                                            */
/* -------------------------------------------------------------------------- */

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
 * Get shipping rates for an admin order (existing behavior)
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
    parcels: [PARCEL_TEMPLATES.jewelry], // Default for admin; dynamic when items available
    async: false,
  });

  return mapRates(shipment.rates || []);
}

/* -------------------------------------------------------------------------- */
/*  Checkout Rates (Public, with dynamic parcels + free shipping)             */
/* -------------------------------------------------------------------------- */

interface CheckoutCartItem {
  product_name: string;
  quantity: number;
  unit_price: number; // cents
  collection?: string;
  weight_oz?: number;
}

export interface CheckoutRatesResult {
  rates: ShippingRate[];
  freeShippingEligible: boolean;
  freeShippingThreshold: number; // cents
}

/**
 * Get shipping rates for checkout — includes free shipping logic and dynamic parcels
 */
export async function getCheckoutShippingRates(
  address: AddressInput,
  items: CheckoutCartItem[],
  subtotalCents: number
): Promise<CheckoutRatesResult> {
  const fromAddress = getFromAddress();
  const parcel = getParcelForItems(items);
  const thresholdCents = parseInt(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "10000",
    10
  );
  const freeShippingEligible = subtotalCents >= thresholdCents;

  // Build customs declaration for international shipments
  const isInternational = address.country !== "US";
  let customsDeclaration: string | undefined;

  if (isInternational) {
    const declaration = await buildCustomsDeclaration(items);
    customsDeclaration = declaration.objectId;
  }

  const shipmentPayload: Parameters<typeof shippo.shipments.create>[0] = {
    addressFrom: fromAddress,
    addressTo: {
      name: address.name,
      street1: address.street1,
      street2: address.street2 || undefined,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    },
    parcels: [parcel],
    async: false,
  };

  if (customsDeclaration) {
    shipmentPayload.customsDeclaration = customsDeclaration;
  }

  const shipment = await shippo.shipments.create(shipmentPayload);
  const rates = mapRates(shipment.rates || []);

  // Prepend free shipping option if eligible
  if (freeShippingEligible && rates.length > 0) {
    rates.unshift({
      rateId: "free_shipping",
      carrier: "Rebirth World",
      service: "Free Standard Shipping",
      price: "0.00",
      priceCents: 0,
      currency: "USD",
      estimatedDays: rates[0]?.estimatedDays
        ? rates[0].estimatedDays + 2
        : 7,
      durationTerms: "5-7 business days",
    });
  }

  return { rates, freeShippingEligible, freeShippingThreshold: thresholdCents };
}

/* -------------------------------------------------------------------------- */
/*  Customs Declarations (International)                                      */
/* -------------------------------------------------------------------------- */

interface CustomsItem {
  product_name: string;
  quantity: number;
  unit_price: number; // cents
  weight_oz?: number;
}

/**
 * Build a Shippo customs declaration for international shipments.
 * Creates customs items inline and passes them to the declaration.
 */
export async function buildCustomsDeclaration(items: CustomsItem[]) {
  const customsItems = items.map((item) => ({
    description: item.product_name.slice(0, 200),
    quantity: item.quantity,
    netWeight: String(item.weight_oz || 4),
    massUnit: "oz" as const,
    valueAmount: (item.unit_price / 100).toFixed(2),
    valueCurrency: "USD",
    originCountry: "US" as const,
  }));

  const declaration = await shippo.customsDeclarations.create({
    contentsType: "MERCHANDISE",
    nonDeliveryOption: "RETURN",
    certify: true,
    certifySigner: process.env.SHIPPO_FROM_NAME || "Rebirth World",
    items: customsItems,
  });

  return declaration;
}

/* -------------------------------------------------------------------------- */
/*  Label Purchase                                                            */
/* -------------------------------------------------------------------------- */

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
    const messages =
      transaction.messages?.map((m) => m.text).join("; ") || "Unknown error";
    throw new Error(`Label purchase failed: ${messages}`);
  }

  return {
    trackingNumber: transaction.trackingNumber || "",
    trackingUrl: transaction.trackingUrlProvider || "",
    labelUrl: transaction.labelUrl || "",
    transactionId: transaction.objectId || "",
    carrier:
      typeof transaction.rate === "object"
        ? transaction.rate?.provider || ""
        : "",
    rateCents:
      typeof transaction.rate === "object"
        ? Math.round(parseFloat(transaction.rate?.amount || "0") * 100)
        : 0,
  };
}

/* -------------------------------------------------------------------------- */
/*  Label Refunds                                                             */
/* -------------------------------------------------------------------------- */

export interface RefundResult {
  refundId: string;
  status: string;
}

/**
 * Request a refund for an unused shipping label
 */
export async function refundLabel(transactionId: string): Promise<RefundResult> {
  const refund = await shippo.refunds.create({
    transaction: transactionId,
    async: false,
  });

  return {
    refundId: refund.objectId || "",
    status: refund.status || "QUEUED",
  };
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function mapRates(
  rates: Array<{
    objectId: string;
    provider: string;
    servicelevel?: { name?: string; token?: string };
    amount: string;
    currency: string;
    estimatedDays?: number;
    durationTerms?: string;
  }>
): ShippingRate[] {
  return rates
    .map((rate) => ({
      rateId: rate.objectId,
      carrier: rate.provider,
      service:
        rate.servicelevel?.name || rate.servicelevel?.token || "Standard",
      price: rate.amount,
      priceCents: Math.round(parseFloat(rate.amount) * 100),
      currency: rate.currency,
      estimatedDays: rate.estimatedDays ?? null,
      durationTerms: rate.durationTerms ?? null,
    }))
    .sort((a, b) => a.priceCents - b.priceCents);
}
