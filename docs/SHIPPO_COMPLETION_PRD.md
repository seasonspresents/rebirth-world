# Shippo Integration Completion PRD

**Project:** Rebirth World — Complete Shipping Integration
**Date:** 2026-03-10
**Status:** Draft

---

## Objective

Complete the Shippo shipping integration so the full flow — from customer checkout through label purchase, tracking updates, and delivery confirmation — is fully connected and testable locally before any production deploy.

---

## Current State

### What's Working
- Shippo API client (rates, labels, refunds, address validation)
- Admin fulfillment UI (get rates → buy label → fulfill → email)
- Shippo tracking webhook (`/api/webhooks/shippo`)
- Label refunds with 90-day window
- Shipping notification email template
- Database schema with all Shippo columns
- Address validation endpoint (`/api/shipping/validate-address`)
- Checkout rates endpoint (`/api/shipping/rates`) — exists but not wired to checkout

### What's Broken / Missing
1. **Checkout uses hardcoded shipping rates** — customers see "$0 standard / $15 express" instead of live Shippo rates
2. **Admin rate fetch ignores product collection** — parcel sizing defaults to "mixed" instead of pulling collection from Stripe metadata
3. **Stripe webhook doesn't store collection metadata on order items** — so fulfillment can't determine parcel type
4. **No local test harness** — can't validate webhooks or rate fetching without deploying
5. **Shippo webhook not registered** — no evidence it's been set up in Shippo Dashboard

---

## Implementation Plan

### Phase 1: Fix Data Flow (Foundation)

**Chunk 1A — Store product collection on order items**

File: `src/app/api/webhooks/stripe/route.ts` (`handleCheckoutCompleted`)

- When inserting `order_items`, extract `collection` from Stripe product metadata (`product.metadata.collection`) and store it on the order item
- Requires adding `collection` column to `order_items` table

Migration: `supabase/migrations/YYYYMMDD_add_collection_to_order_items.sql`
```sql
ALTER TABLE order_items ADD COLUMN collection text;
```

Update: `src/lib/supabase/types.ts` — add `collection` to `OrderItem` type

**Chunk 1B — Fix admin rates to use collection metadata**

File: `src/app/api/admin/orders/[id]/shipping/rates/route.ts`

- Fetch `order_items` with `collection` column (instead of `SELECT quantity` only)
- Pass `collection` to `getParcelForItems()` so parcel sizing works correctly

---

### Phase 2: Wire Live Rates into Checkout

**Chunk 2A — Pass cart metadata through Stripe checkout**

File: `src/app/api/checkout/route.ts`

- Before creating the Stripe session, call `getCheckoutShippingRates()` with the customer's shipping address and cart items
- Problem: Stripe hosted checkout collects the address *during* checkout, not before
- **Solution:** Use Stripe's `shipping_options` with dynamically generated rates
  - Create a pre-checkout step: customer enters shipping zip/country on the cart page
  - Hit `/api/shipping/rates` with that address + cart items
  - Convert Shippo rates into Stripe `shipping_rate_data` objects
  - Pass those into `stripe.checkout.sessions.create()`

**Chunk 2B — Cart page shipping estimator component**

File: `src/components/cart/shipping-estimator.tsx` (new)

- Simple form: country dropdown + zip code input
- On submit, calls `POST /api/shipping/rates` with address + cart items
- Displays available rates with prices and delivery estimates
- Selected rate stored in cart context and passed to checkout API

**Chunk 2C — Update checkout API to accept selected shipping rate**

File: `src/app/api/checkout/route.ts`

- Accept `shippingRateId` and `shippingAddress` in the request body
- If a Shippo rate was selected:
  - Re-fetch the rate to verify it's still valid
  - Convert to Stripe `shipping_rate_data` with the actual Shippo price
  - For "free_shipping" rate: use $0 fixed amount
- If no rate selected (fallback): keep current hardcoded options
- Store the selected Shippo rate ID in session metadata for post-purchase label creation

**Chunk 2D — Update cart context to track shipping selection**

File: `src/components/cart/cart-context.tsx`

- Add `selectedShippingRate` and `shippingAddress` to cart state
- Expose `setShippingRate()` and `setShippingAddress()` methods
- Pass these to checkout API call

---

### Phase 3: Post-Purchase Automation

**Chunk 3A — Store Shippo shipment data on order creation**

File: `src/app/api/webhooks/stripe/route.ts`

- After order is created, if session metadata contains a Shippo rate ID:
  - Store it on the order (`shippo_rate_id` column) so admin can one-click buy label
- Migration: add `shippo_rate_id` column to orders table

**Chunk 3B — One-click label purchase in admin**

File: `src/app/api/admin/orders/[id]/shipping/label/route.ts`

- If order already has a `shippo_rate_id`, allow purchasing directly from that rate
- Skip the "get rates" step — admin just clicks "Buy Label"
- Existing flow still works as fallback (fetch fresh rates → select → buy)

---

### Phase 4: Testing & Validation

**Chunk 4A — Local test script for Shippo rates**

File: `scripts/test-shippo.ts`

- Standalone script that:
  1. Validates a test address via Shippo API
  2. Fetches checkout rates for test cart items (jewelry, apparel, mixed)
  3. Verifies parcel sizing logic
  4. Prints formatted rate table
- Run: `npx tsx scripts/test-shippo.ts`

**Chunk 4B — Local webhook testing script**

File: `scripts/test-shippo-webhook.ts`

- Sends simulated Shippo `track_updated` payloads to `localhost:3000/api/webhooks/shippo`
  or the `SHIPPO_WEBHOOK_TEST_BASE_URL` override.
- Tests all status transitions: PRE_TRANSIT → TRANSIT → DELIVERED
- Tests edge cases: FAILURE, RETURNED, status downgrade prevention
- Tests auth: valid token, invalid token, missing token
- Setup notes: `docs/SHIPPO_WEBHOOK_SETUP.md`
- Run: `SHIPPO_WEBHOOK_TEST_BASE_URL=http://localhost:3000/api/webhooks/shippo pnpm exec tsx scripts/test-shippo-webhook.ts`

**Chunk 4C — Local Stripe webhook test for order + collection storage**

File: `scripts/test-stripe-checkout.ts`

- Creates a test Stripe checkout session with product metadata
- Verifies the webhook stores `collection` on order items
- Verifies shipping cost is recorded correctly
- Run: `npx tsx scripts/test-stripe-checkout.ts` (requires `stripe listen --forward-to localhost:3000/api/webhooks/stripe`)

**Chunk 4D — End-to-end local validation checklist**

Test sequence (manual, run locally with `pnpm dev`):
1. Start dev server + Stripe CLI listener
2. Run `test-shippo.ts` — verify rates come back ✓
3. Go to `/shop` → add item → go to `/cart`
4. Enter shipping zip → see live Shippo rates ✓
5. Select a rate → click Checkout
6. Complete Stripe test checkout (card `4242...`)
7. Verify order created in Supabase with `collection` on items ✓
8. Go to admin `/dashboard/orders/[id]` → click "Get Rates" → verify correct parcel ✓
9. Click "Buy Label" → verify tracking number populated ✓
10. Run `test-shippo-webhook.ts` against local → verify order status updates ✓
11. Click "Fulfill Order" → verify shipping email sent ✓

---

## Deployment Rules

- **NO deploys to Vercel until all chunks are committed and validated locally**
- Work in chunks, commit each chunk to git separately
- User (Seasons) decides when to deploy — explicit approval required
- All testing happens on `localhost:3000` with `pnpm dev`
- Stripe testing uses test mode keys + `stripe listen` CLI
- Shippo testing uses test API key (already configured)

---

## Commit Plan

| Order | Chunk | Commit Message |
|-------|-------|---------------|
| 1 | 1A | `feat: store product collection on order items` |
| 2 | 1B | `fix: use collection metadata for admin shipping rates parcel sizing` |
| 3 | 2B | `feat: add shipping rate estimator to cart page` |
| 4 | 2C+2D | `feat: wire live Shippo rates into Stripe checkout` |
| 5 | 3A+3B | `feat: store Shippo rate on order for one-click label purchase` |
| 6 | 4A+4B | `feat: add local Shippo test scripts` |
| 7 | — | `test: validate full shipping flow end-to-end locally` |

Each commit is independently functional. No commit breaks the existing flow.

---

## Out of Scope (For Now)

- Return labels — not needed for launch
- Auto-purchase labels on order creation — manual is fine for now
- Live API key switch — do this at launch time, not during development
- Product weight in Stripe metadata — hardcoded defaults are close enough for jewelry/apparel
