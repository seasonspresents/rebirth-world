import "server-only";

import Stripe from "stripe";

// Pin apiVersion to the SDK's native clover version so webhook event types
// match what SDK v19.3.1 parses. The webhook endpoint is pinned to the same
// version via Stripe API so events arrive at the schema the SDK expects.
// See roundtable 2026-04-24 / O10. To bump: upgrade stripe SDK, update this
// string to the SDK's new default, then update the Dashboard webhook.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});
