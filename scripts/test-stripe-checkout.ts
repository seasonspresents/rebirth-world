/**
 * Verify Stripe checkout metadata handling for Rebirth orders.
 * Run: pnpm exec tsx scripts/test-stripe-checkout.ts
 *
 * Optional integration mode:
 * STRIPE_CHECKOUT_TEST_MODE=integration pnpm exec tsx scripts/test-stripe-checkout.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import Stripe from "stripe";
import {
  buildOrderItemsFromStripeLineItems,
  getShippoRateIdFromCheckoutMetadata,
  parseCheckoutItemVariants,
} from "../src/lib/stripe-checkout-webhook";

config({ path: ".env.local" });

const BASE_URL =
  process.env.STRIPE_CHECKOUT_TEST_BASE_URL || "http://localhost:3000";
const TEST_MODE = process.env.STRIPE_CHECKOUT_TEST_MODE || "fixture";
const TEST_RATE_ID =
  process.env.STRIPE_CHECKOUT_TEST_SHIPPO_RATE_ID || "shippo_test_rate_rebirth";
const TEST_COLLECTION =
  process.env.STRIPE_CHECKOUT_TEST_COLLECTION || "skateboard-rings";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function buildFixtureLineItem(): Stripe.LineItem {
  return {
    id: "li_test_rebirth",
    object: "item",
    amount_discount: 0,
    amount_subtotal: 7600,
    amount_tax: 0,
    amount_total: 7600,
    currency: "usd",
    description: "Rebirth Test Ring",
    discounts: [],
    price: {
      id: "price_test_rebirth",
      object: "price",
      active: true,
      billing_scheme: "per_unit",
      created: 1,
      currency: "usd",
      custom_unit_amount: null,
      livemode: false,
      lookup_key: null,
      metadata: {},
      nickname: null,
      product: {
        id: "prod_test_rebirth",
        object: "product",
        active: true,
        attributes: [],
        created: 1,
        default_price: null,
        description: "Fixture product",
        images: ["https://rebirth.world/test-product.jpg"],
        livemode: false,
        marketing_features: [],
        metadata: {
          collection: TEST_COLLECTION,
        },
        name: "Rebirth Test Ring",
        package_dimensions: null,
        shippable: true,
        statement_descriptor: null,
        tax_code: null,
        type: "service",
        unit_label: null,
        updated: 1,
        url: null,
      },
      recurring: null,
      tax_behavior: "unspecified",
      tiers_mode: null,
      transform_quantity: null,
      type: "one_time",
      unit_amount: 7600,
      unit_amount_decimal: "7600",
    },
    quantity: 1,
  } as Stripe.LineItem;
}

function runFixtureAssertions() {
  console.log("Stripe checkout fixture assertions");

  const metadata = {
    shippo_rate_id: TEST_RATE_ID,
    item_variants: JSON.stringify([
      { priceId: "price_test_rebirth", variant: "Size 8|REBIRTH" },
    ]),
  };
  const freeShippingMetadata = { shippo_rate_id: "free_shipping" };

  assert(
    getShippoRateIdFromCheckoutMetadata(metadata) === TEST_RATE_ID,
    "Expected selected Shippo rate metadata to be persisted"
  );
  assert(
    getShippoRateIdFromCheckoutMetadata(freeShippingMetadata) === null,
    "Expected free_shipping marker not to be stored as purchasable Shippo rate"
  );

  const variants = parseCheckoutItemVariants(metadata);
  assert(
    variants.price_test_rebirth === "Size 8|REBIRTH",
    "Expected item variant metadata to map by price ID"
  );

  const items = buildOrderItemsFromStripeLineItems(
    "order_test_rebirth",
    [buildFixtureLineItem()],
    variants
  );
  const item = items[0];

  assert(
    item.collection === TEST_COLLECTION,
    "Expected collection metadata on order item"
  );
  assert(
    item.stripe_price_id === "price_test_rebirth",
    "Expected Stripe price ID"
  );
  assert(
    item.stripe_product_id === "prod_test_rebirth",
    "Expected Stripe product ID"
  );
  assert(item.variant_name === "Size 8", "Expected variant name from metadata");
  assert(item.engraving_text === "REBIRTH", "Expected engraving from metadata");
  assert(
    item.total_price === 7600,
    "Expected total price to use Stripe unit amount"
  );

  console.log("  PASS  shippo_rate_id and collection metadata mapping");
}

function assertIntegrationEnv() {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  assert(
    stripeKey.startsWith("sk_test_"),
    "Integration mode requires STRIPE_SECRET_KEY to be a Stripe test key. Refusing to run against live mode."
  );
  assert(
    webhookSecret.startsWith("whsec_"),
    "Integration mode requires STRIPE_WEBHOOK_SECRET from `stripe listen --forward-to localhost:3000/api/webhooks/stripe`."
  );
  assert(
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
    ),
    "Integration mode requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY."
  );
}

async function runIntegrationTest() {
  assertIntegrationEnv();
  console.log("\nStripe checkout local integration");
  console.log(`Target: ${BASE_URL}/api/webhooks/stripe`);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const product = await stripe.products.create({
    name: "Rebirth Stripe Harness Product",
    active: true,
    metadata: { collection: TEST_COLLECTION },
  });
  const price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
    unit_amount: 7600,
  });
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: price.id, quantity: 1 }],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 599, currency: "usd" },
          display_name: "USPS Ground Advantage",
        },
      },
    ],
    customer_email: `rebirth-stripe-harness-${Date.now()}@example.com`,
    metadata: {
      brand: "rebirth-world",
      user_id: "guest",
      order_source: "website",
      shipping_rate_source: "selected_shippo_rate",
      shippo_rate_id: TEST_RATE_ID,
      item_variants: JSON.stringify([{ priceId: price.id, variant: "Size 8" }]),
    },
    success_url: `${BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/cart?canceled=true`,
  });

  const event = {
    id: `evt_test_rebirth_${Date.now()}`,
    object: "event",
    api_version: "2025-11-17.clover",
    created: Math.floor(Date.now() / 1000),
    data: { object: session },
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type: "checkout.session.completed",
  };
  const payload = JSON.stringify(event);
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  });

  const response = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body: payload,
  });
  const responseBody = await response.json().catch(() => ({}));
  assert(
    response.ok,
    `Expected webhook 200, got ${response.status}: ${JSON.stringify(responseBody)}`
  );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, shippo_rate_id")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  assert(!orderError && order, `Expected order for session ${session.id}`);
  assert(
    order.shippo_rate_id === TEST_RATE_ID,
    "Expected order.shippo_rate_id"
  );

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, collection")
    .eq("order_id", order.id);

  assert(!itemsError && items?.length === 1, "Expected one order item");
  assert(
    items[0].collection === TEST_COLLECTION,
    `Expected collection ${TEST_COLLECTION}, got ${items?.[0]?.collection}`
  );

  await supabase.from("order_items").delete().eq("order_id", order.id);
  await supabase.from("payment_history").delete().eq("order_id", order.id);
  await supabase.from("orders").delete().eq("id", order.id);
  await supabase
    .from("stripe_webhook_events")
    .delete()
    .eq("stripe_event_id", event.id);
  await stripe.products.update(product.id, { active: false });

  console.log(
    "  PASS  webhook inserted order metadata and order item collection"
  );
}

async function main() {
  runFixtureAssertions();

  if (TEST_MODE === "integration") {
    await runIntegrationTest();
    return;
  }

  console.log(
    "\nIntegration mode skipped. To run it safely, use Stripe test keys and:"
  );
  console.log(
    "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
  );
  console.log(
    "  STRIPE_CHECKOUT_TEST_MODE=integration pnpm exec tsx scripts/test-stripe-checkout.ts"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
