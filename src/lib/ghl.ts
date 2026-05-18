/**
 * GoHighLevel (GHL) REST API v2 Integration
 *
 * Uses the GHL REST API to upsert contacts and apply tags for marketing automation.
 * GHL failures must NEVER break the e-commerce flow.
 *
 * Env vars:
 *   GHL_API_KEY      — Private Integration Token from GHL
 *   GHL_LOCATION_ID  — Sub-account/Location ID from GHL
 */

const GHL_BASE_URL = "https://services.leadconnectorhq.com";

export const GHL_CUSTOM_FIELDS = {
  lastOrderNumber: "contact.last_order_number",
  lastOrderTotal: "contact.last_order_total",
  lastOrderCurrency: "contact.last_order_currency",
  lastOrderItems: "contact.last_order_items",
  abandonedCartItems: "contact.abandoned_cart_items",
  abandonedCartValue: "contact.abandoned_cart_value",
  abandonedCartUrl: "contact.abandoned_cart_url",
  wishlistItems: "contact.wishlist_items",
  wishlistValue: "contact.wishlist_value",
  wishlistUrl: "contact.wishlist_url",
  authMethod: "contact.auth_method",
  rebirthSource: "contact.rebirth_source",
  rebirthSourceDetail: "contact.rebirth_source_detail",
  contactMessage: "contact.contact_message",
} as const;

// ---------------------------------------------------------------------------
// Payload interfaces (unchanged — calling code stays the same)
// ---------------------------------------------------------------------------

export interface PurchasePayload {
  email: string;
  first_name?: string;
  last_name?: string;
  order_number: string;
  order_total: number;
  currency: string;
  items: Array<{
    product_name: string;
    variant?: string;
    quantity: number;
    price: number;
  }>;
  shipping_address?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface NewsletterPayload {
  email: string;
  first_name?: string;
  source: string;
}

export interface AbandonedCartPayload {
  email: string;
  first_name?: string;
  item_count: number;
  cart_value: number;
  recovery_url: string;
  last_activity: string;
}

export interface AccountPayload {
  email: string;
  first_name?: string;
  auth_method: string;
}

export interface WishlistPayload {
  email: string;
  first_name?: string;
  item_count: number;
  wishlist_value: number;
  wishlist_url: string;
  item_names: string[];
  last_activity: string;
}

// ---------------------------------------------------------------------------
// Core API helper
// ---------------------------------------------------------------------------

/**
 * Fire-and-forget call to the GHL REST API v2.
 * Non-blocking — never throws, never fails the parent operation.
 * Returns the parsed JSON response, or null on failure.
 */
function ghlApi(
  path: string,
  body: Record<string, unknown>,
  method: "POST" | "DELETE" = "POST"
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) {
    console.log("[GHL] No API key configured, skipping");
    return Promise.resolve(null);
  }

  return fetch(`${GHL_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          console.error(`[GHL] API error ${res.status} on ${path}:`, text);
          return null;
        });
      }
      return res.json() as Promise<Record<string, unknown>>;
    })
    .catch((err) => {
      console.error("[GHL] API request failed:", err.message);
      return null;
    });
}

// ---------------------------------------------------------------------------
// Contact operations
// ---------------------------------------------------------------------------

/**
 * Create or update a contact by email.
 * Returns the contact ID from the response, or null on failure.
 */
function upsertContact(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  source?: string;
  customFields?: Array<{ key: string; field_value: string }>;
}): Promise<string | null> {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) {
    console.log("[GHL] No location ID configured, skipping");
    return Promise.resolve(null);
  }

  return ghlApi("/contacts/upsert", {
    locationId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    tags: data.tags,
    source: data.source,
    customFields: data.customFields,
  }).then((res) => {
    if (!res) return null;
    const contact = res.contact as Record<string, unknown> | undefined;
    return (contact?.id as string) ?? null;
  });
}

/**
 * Add tags to an existing contact.
 */
function addTags(contactId: string, tags: string[]): Promise<void> {
  ghlApi(`/contacts/${contactId}/tags`, { tags });
  return Promise.resolve();
}

/**
 * Remove tags from an existing contact.
 */
function removeTags(contactId: string, tags: string[]): Promise<void> {
  ghlApi(`/contacts/${contactId}/tags`, { tags }, "DELETE");
  return Promise.resolve();
}

/**
 * Enroll a contact in a GHL workflow.
 */
function addToWorkflow(contactId: string, workflowId: string): Promise<void> {
  ghlApi(`/contacts/${contactId}/workflow/${workflowId}`, {});
  return Promise.resolve();
}

// ---------------------------------------------------------------------------
// Convenience wrappers (same public API as before)
// ---------------------------------------------------------------------------

export function notifyPurchase(data: PurchasePayload): void {
  upsertContact({
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    tags: ["customer", "purchased"],
    source: "rebirth.world",
    customFields: [
      {
        key: GHL_CUSTOM_FIELDS.lastOrderNumber,
        field_value: data.order_number,
      },
      {
        key: GHL_CUSTOM_FIELDS.lastOrderTotal,
        field_value: (data.order_total / 100).toFixed(2),
      },
      { key: GHL_CUSTOM_FIELDS.lastOrderCurrency, field_value: data.currency },
      {
        key: GHL_CUSTOM_FIELDS.lastOrderItems,
        field_value: data.items.map((i) => i.product_name).join(", "),
      },
      { key: GHL_CUSTOM_FIELDS.rebirthSource, field_value: "purchase" },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSourceDetail,
        field_value: "stripe_checkout",
      },
    ],
  })
    .then((contactId) => {
      if (contactId) {
        removeTags(contactId, ["abandoned_cart"]);
      }
    })
    .catch(() => {
      // already logged inside ghlApi
    });
}

export function notifyNewsletterSignup(data: NewsletterPayload): void {
  upsertContact({
    email: data.email,
    firstName: data.first_name,
    tags: ["subscriber", "lead"],
    source: data.source || "rebirth.world",
    customFields: [
      { key: GHL_CUSTOM_FIELDS.rebirthSource, field_value: "newsletter" },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSourceDetail,
        field_value: data.source || "rebirth.world",
      },
    ],
  }).catch(() => {
    // already logged inside ghlApi
  });
}

export function notifyAbandonedCart(data: AbandonedCartPayload): void {
  upsertContact({
    email: data.email,
    firstName: data.first_name,
    tags: ["abandoned_cart"],
    source: "rebirth.world",
    customFields: [
      {
        key: GHL_CUSTOM_FIELDS.abandonedCartItems,
        field_value: String(data.item_count),
      },
      {
        key: GHL_CUSTOM_FIELDS.abandonedCartValue,
        field_value: (data.cart_value / 100).toFixed(2),
      },
      {
        key: GHL_CUSTOM_FIELDS.abandonedCartUrl,
        field_value: data.recovery_url,
      },
      { key: GHL_CUSTOM_FIELDS.rebirthSource, field_value: "abandoned_cart" },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSourceDetail,
        field_value: data.last_activity,
      },
    ],
  }).catch(() => {
    // already logged inside ghlApi
  });
}

export function notifyWishlistCreated(data: WishlistPayload): void {
  upsertContact({
    email: data.email,
    firstName: data.first_name,
    tags: ["wishlist", "lead"],
    source: "rebirth.world",
    customFields: [
      {
        key: GHL_CUSTOM_FIELDS.wishlistItems,
        field_value: data.item_names.join(", "),
      },
      {
        key: GHL_CUSTOM_FIELDS.wishlistValue,
        field_value: (data.wishlist_value / 100).toFixed(2),
      },
      {
        key: GHL_CUSTOM_FIELDS.wishlistUrl,
        field_value: data.wishlist_url,
      },
      { key: GHL_CUSTOM_FIELDS.rebirthSource, field_value: "wishlist" },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSourceDetail,
        field_value: data.last_activity,
      },
    ],
  }).catch(() => {
    // already logged inside ghlApi
  });
}

export function notifyDormantWishlist(data: WishlistPayload): void {
  upsertContact({
    email: data.email,
    firstName: data.first_name,
    tags: ["wishlist", "wishlist_dormant"],
    source: "rebirth.world",
    customFields: [
      {
        key: GHL_CUSTOM_FIELDS.wishlistItems,
        field_value: data.item_names.join(", "),
      },
      {
        key: GHL_CUSTOM_FIELDS.wishlistValue,
        field_value: (data.wishlist_value / 100).toFixed(2),
      },
      {
        key: GHL_CUSTOM_FIELDS.wishlistUrl,
        field_value: data.wishlist_url,
      },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSource,
        field_value: "wishlist_dormant",
      },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSourceDetail,
        field_value: data.last_activity,
      },
    ],
  }).catch(() => {
    // already logged inside ghlApi
  });
}

export function notifyAccountCreated(data: AccountPayload): void {
  upsertContact({
    email: data.email,
    firstName: data.first_name,
    tags: ["account"],
    source: "rebirth.world",
    customFields: [
      { key: GHL_CUSTOM_FIELDS.authMethod, field_value: data.auth_method },
      { key: GHL_CUSTOM_FIELDS.rebirthSource, field_value: "account" },
      {
        key: GHL_CUSTOM_FIELDS.rebirthSourceDetail,
        field_value: data.auth_method,
      },
    ],
  }).catch(() => {
    // already logged inside ghlApi
  });
}

// Re-export for advanced usage (e.g., future workflow enrollment)
export { upsertContact, addTags, removeTags, addToWorkflow };
