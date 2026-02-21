/**
 * GoHighLevel (GHL) Webhook Integration
 *
 * Fire-and-forget webhooks to GHL for marketing automation.
 * GHL failures must NEVER break the e-commerce flow.
 */

// ---------------------------------------------------------------------------
// Payload interfaces
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

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

/**
 * Fire-and-forget webhook to GoHighLevel.
 * Non-blocking — never throws, never fails the parent operation.
 */
export function fireGHLWebhook(
  webhookUrl: string | undefined,
  payload: Record<string, unknown>,
): void {
  if (!webhookUrl) {
    console.log("[GHL] No webhook URL configured, skipping");
    return;
  }

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
  }).catch((err) => {
    console.error("[GHL] Webhook delivery failed:", err.message);
  });
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

export function notifyPurchase(data: PurchasePayload) {
  fireGHLWebhook(process.env.GHL_WEBHOOK_PURCHASE, {
    event: "purchase_completed",
    ...data,
    source: "rebirth.world",
  });
}

export function notifyNewsletterSignup(data: NewsletterPayload) {
  fireGHLWebhook(process.env.GHL_WEBHOOK_NEWSLETTER, {
    event: "newsletter_signup",
    ...data,
  });
}

export function notifyAbandonedCart(data: AbandonedCartPayload) {
  fireGHLWebhook(process.env.GHL_WEBHOOK_ABANDONED_CART, {
    event: "cart_abandoned",
    ...data,
  });
}

export function notifyAccountCreated(data: AccountPayload) {
  fireGHLWebhook(process.env.GHL_WEBHOOK_ACCOUNT_CREATED, {
    event: "account_created",
    ...data,
  });
}
