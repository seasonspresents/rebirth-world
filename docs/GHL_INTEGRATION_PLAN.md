# Rebirth World × GoHighLevel Integration Plan

> **Purpose:** Connect the Rebirth World e-commerce platform to GoHighLevel for marketing automation
> **Scope:** REST API v2 integration — Rebirth World upserts contacts & tags → GHL triggers workflows
> **Date:** February 20, 2026

---

## Architecture

```
REBIRTH WORLD (rebirth.world)          GoHighLevel (REST API v2)
┌─────────────────────────┐            ┌──────────────────────────┐
│                         │            │                          │
│  Stripe Webhook fires   │            │  CONTACTS API            │
│  ──────────────────►    │            │  POST /contacts/upsert   │
│  /api/webhooks/stripe   │            │                          │
│         │               │   REST     │  ┌──────────────────┐    │
│         ▼               │  ──────►   │  │ Contact created   │    │
│  Create order in DB     │  upsert    │  │ tags: [customer,  │    │
│  Send confirmation      │  + tags    │  │   purchased]      │    │
│  (Resend — instant)     │            │  └──────────────────┘    │
│         │               │            │          │               │
│         ▼               │            │          ▼               │
│  Upsert GHL contact     │            │  TAG-BASED TRIGGERS      │
│  (async, non-blocking)  │            │  (configured in GHL UI)  │
│                         │            │                          │
│  Newsletter form fires  │   REST     │  ┌──────────────────┐    │
│  ──────────────────►    │  ──────►   │  │ "subscriber" tag  │    │
│  /api/subscribe         │  upsert    │  │ → Welcome sequence│    │
│                         │  + tags    │  └──────────────────┘    │
│                         │            │                          │
│  Cron checks abandoned  │   REST     │  ┌──────────────────┐    │
│  carts view daily       │  ──────►   │  │ "abandoned_cart"  │    │
│                         │  upsert    │  │ tag → Recovery    │    │
│                         │  + tags    │  │ workflow          │    │
└─────────────────────────┘            │  └──────────────────┘    │
                                       │                          │
                                       │  WORKFLOWS               │
                                       │  • Welcome sequence      │
                                       │  • Post-purchase drip    │
                                       │  • Abandon cart recovery  │
                                       │  • Drop announcements     │
                                       │  • Wedding band nurture   │
                                       │  • SMS campaigns          │
                                       └──────────────────────────┘
```

**How workflows trigger:** In the GHL dashboard, each workflow uses a **Tag Added** trigger (e.g., when `purchased` tag is added → Post-Purchase Sequence fires). This is more reliable than inbound webhooks and keeps all automation logic inside GHL.

## The Split (Resend vs GHL)

| Responsibility | Tool | Why |
|---------------|------|-----|
| Order confirmation email | **Resend** | Fires instantly from webhook, must land in <5 seconds |
| Shipping notification | **Resend** | Fires instantly when admin marks fulfilled |
| Auth emails (signup, password reset) | **Resend** (via Supabase) | Built into auth system |
| Welcome sequence (5 emails / 10 days) | **GHL** | Drip timing, automation logic |
| Abandon cart recovery (3 emails / 48 hrs) | **GHL** | Delay triggers, conditional logic |
| Post-purchase sequence (4 emails / 30 days) | **GHL** | Timed drip, cross-sell logic |
| Drop announcements | **GHL** | Bulk sends, segmentation |
| Newsletter campaigns | **GHL** | List management, templates |
| SMS campaigns | **GHL** | SMS is GHL's strength |
| Wedding band nurture sequence | **GHL** | Long-form drip for engaged leads |

---

## Events Sent to GHL

### Event 1: New Purchase

**Trigger:** Stripe `checkout.session.completed` webhook
**When:** Immediately after order creation in Supabase
**API call:** `POST /contacts/upsert` with tags `["customer", "purchased"]`

**Contact data sent:**
- `email`, `firstName`, `lastName`
- Tags: `customer`, `purchased`
- Custom fields: `last_order_number`, `last_order_total`, `last_order_currency`, `last_order_items`

**GHL workflow triggered by:** Tag `purchased` added
- Day 7: "Share your ring" — encourage UGC
- Day 14: Cross-sell / referral ask
- Day 30: New drop preview

**Tags applied:** `customer`, `purchased`

---

### Event 2: Newsletter Signup

**Trigger:** Form submission on website (footer, popup, or dedicated page)
**When:** After inserting into `email_subscribers` table
**API call:** `POST /contacts/upsert` with tags `["subscriber", "lead"]`

**Contact data sent:**
- `email`, `firstName`
- Tags: `subscriber`, `lead`
- Source: form source (e.g., `website_footer`)

**GHL workflow triggered by:** Tag `subscriber` added
- Email 1: Daniel's story + brand origin (immediate)
- Email 2: How the rings are made (Day 2)
- Email 3: Customer stories / social proof (Day 4)
- Email 4: The humanitarian mission (Day 7)
- Email 5: First purchase incentive (Day 10)

**Tags applied:** `subscriber`, `lead`

---

### Event 3: Abandoned Cart

**Trigger:** Vercel cron job (daily)
**When:** User has items in cart >1 hour, no order placed after
**API call:** `POST /contacts/upsert` with tag `["abandoned_cart"]`

**Contact data sent:**
- `email`, `firstName`
- Tags: `abandoned_cart`
- Custom fields: `abandoned_cart_items`, `abandoned_cart_value`, `abandoned_cart_url`

**GHL workflow triggered by:** Tag `abandoned_cart` added
- Email 1: "Still thinking about it?" + product reminder (1 hour)
- Email 2: Social proof + craft story (24 hours)
- Email 3: Personal note from Daniel + soft urgency (48 hours)

**Tags applied:** `abandoned_cart`
**Remove tag when:** Purchase completed (contact is upserted with `customer` tag; configure GHL workflow to remove `abandoned_cart` on `purchased` tag)

---

### Event 4: Account Created

**Trigger:** Successful signup (email verification confirmed)
**API call:** `POST /contacts/upsert` with tag `["account"]`

**Contact data sent:**
- `email`, `firstName`
- Tags: `account`
- Custom fields: `auth_method`

---

### Event 5: Wedding Band Interest (Future)

**Trigger:** User views wedding band products or submits wedding band lead form
**API call:** `POST /contacts/upsert` with tags `["wedding_lead", "hot_lead"]`

**GHL workflow triggered by:** Tag `wedding_lead` added
- Custom ring consultation CTA
- Material education series
- Matching set upsell
- Anniversary reminder loop (long-term)

---

## Implementation

### Step 1: Set Up GHL Private Integration

1. In GoHighLevel → Settings → Integrations → Create Private Integration
2. Copy the **Private Integration Token** (this is the API key)
3. Note your **Location ID** (sub-account ID)
4. Store as environment variables:

```bash
# .env.local
GHL_API_KEY=your-private-integration-token
GHL_LOCATION_ID=your-location-id

# Cron authentication (unchanged)
CRON_SECRET=your-random-secret-here
```

### Step 2: GHL Helper Library (API-based)

```typescript
// src/lib/ghl.ts — uses GHL REST API v2

const GHL_BASE_URL = "https://services.leadconnectorhq.com";

// Core helper: POST/DELETE to GHL API with auth headers
function ghlApi(path, body, method = "POST") {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return Promise.resolve(null);

  return fetch(`${GHL_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
      Version: "2021-07-28",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.ok ? res.json() : null)
    .catch(() => null);
}

// Upsert contact — returns contact ID
function upsertContact({ email, firstName, lastName, tags, source, customFields }) {
  return ghlApi("/contacts/upsert", {
    locationId: process.env.GHL_LOCATION_ID,
    email, firstName, lastName, tags, source, customFields,
  }).then((res) => res?.contact?.id ?? null);
}

// Convenience wrappers (same public API — callers don't change)
export function notifyPurchase(data) {
  upsertContact({ email: data.email, ..., tags: ["customer", "purchased"] });
}
export function notifyNewsletterSignup(data) {
  upsertContact({ email: data.email, ..., tags: ["subscriber", "lead"] });
}
export function notifyAbandonedCart(data) {
  upsertContact({ email: data.email, ..., tags: ["abandoned_cart"] });
}
export function notifyAccountCreated(data) {
  upsertContact({ email: data.email, ..., tags: ["account"] });
}
```

### Step 3: Configure Tag-Based Workflows in GHL

In GoHighLevel, set up workflows with **Tag Added** triggers instead of Inbound Webhooks:

| Workflow | Trigger | Tag |
|----------|---------|-----|
| Post-Purchase Sequence | Tag Added: `purchased` | `purchased` |
| Welcome Sequence | Tag Added: `subscriber` | `subscriber` |
| Abandon Cart Recovery | Tag Added: `abandoned_cart` | `abandoned_cart` |
| Wedding Band Nurture | Tag Added: `wedding_lead` | `wedding_lead` |

This approach is simpler — all automation logic stays in GHL, triggered by tags the API applies.

### Step 4: Create Custom Fields in GHL

Create these custom fields in GHL → Contacts → Custom Fields:

| Field Key | Type | Purpose |
|-----------|------|---------|
| `last_order_number` | Text | Most recent order number |
| `last_order_total` | Text | Order total (formatted) |
| `last_order_currency` | Text | Currency code |
| `last_order_items` | Text | Product names |
| `abandoned_cart_items` | Text | Number of items in cart |
| `abandoned_cart_value` | Text | Cart value (formatted) |
| `abandoned_cart_url` | Text | Recovery URL |
| `auth_method` | Text | How the user signed up |

---

## GHL Workflow Setup Guide

### Workflow 1: Welcome Sequence

**Trigger:** Tag Added → `subscriber`

```
→ Wait 0 min
→ Send Email: "Daniel's Story" (origin story, brand intro, shop link)
→ Wait 2 days
→ Send Email: "How the Rings Are Made" (craft process, material story)
→ Wait 2 days
→ Send Email: "Meet Our Community" (customer stories, social proof, UGC)
→ Wait 3 days
→ Send Email: "More Than a Ring" (humanitarian mission, Pushing for Pink, Mexico/Samoa)
→ Wait 3 days
→ Send Email: "Something Special for You" (first purchase incentive — 10% off or free engraving)
→ Add Tag: "welcome_complete"
```

### Workflow 2: Post-Purchase Sequence

**Trigger:** Tag Added → `purchased`

```
→ Remove Tag: "abandoned_cart" (if exists)
→ (Resend handles instant confirmation — GHL skips Day 0)
→ Wait 7 days
→ Send Email: "Share Your Ring" (encourage UGC, Instagram tag request, photo contest)
→ Wait 7 days
→ Send Email: "Know Someone Who'd Love This?" (referral program, share link)
→ Wait 16 days
→ Send Email: "Something New Just Dropped" (new collection preview, early access)
→ Add Tag: "post_purchase_complete"
```

### Workflow 3: Abandon Cart Recovery

**Trigger:** Tag Added → `abandoned_cart`

```
→ IF Contact has tag "purchased" in last 48 hours → STOP (they already bought)
→ Wait 1 hour
→ Send Email: "Still thinking about it?" (product image, cart link, social proof)
→ Wait 23 hours
→ IF Contact has tag "purchased" → STOP
→ Send Email: "Here's the story behind your ring" (craft narrative, material story)
→ Wait 24 hours
→ IF Contact has tag "purchased" → STOP
→ Send Email: "A quick note from Daniel" (personal message, soft urgency, maybe free engraving offer)
→ Remove Tag: "abandoned_cart"
→ Add Tag: "recovery_attempted"
```

### Workflow 4: Wedding Band Nurture (Future)

**Trigger:** Tag Added → `wedding_lead`

```
→ Wait 0 min
→ Send Email: "Your Ring Should Mean Something" (wedding band collection, Daniel's jeweler heritage)
→ Wait 3 days
→ Send Email: "The Wood Inside Your Ring" (material education — bog oak, koa, stabilized wood)
→ Wait 4 days
→ Send Email: "Custom Consultation" (CTA for custom ring discussion, size guide)
→ Wait 7 days
→ Send Email: "Made for Two" (matching sets, his & hers options)
→ Wait 14 days
→ IF no purchase → Send Email: "Still planning?" (gentle follow-up, seasonal offer)
→ Add Tag: "wedding_nurture_complete"
```

---

## Environment Variables

```bash
# GoHighLevel REST API v2
GHL_API_KEY=your-private-integration-token
GHL_LOCATION_ID=your-location-id

# Cron authentication
CRON_SECRET=your-random-secret-here
```

**Removed** (no longer needed):
- `GHL_WEBHOOK_PURCHASE`
- `GHL_WEBHOOK_NEWSLETTER`
- `GHL_WEBHOOK_ABANDONED_CART`
- `GHL_WEBHOOK_ACCOUNT_CREATED`
- `GHL_WEBHOOK_WEDDING_INTEREST`

---

## Testing Checklist

| Test | How |
|------|-----|
| Purchase → GHL contact created | Make test purchase, verify contact appears in GHL with `customer` + `purchased` tags |
| Newsletter → Welcome sequence starts | Submit newsletter form, verify GHL contact has `subscriber` tag, workflow triggers |
| Abandoned cart → Recovery emails | Add items to cart, wait for cron, check GHL for `abandoned_cart` tag |
| Purchase cancels abandon flow | Start abandon flow, then complete purchase — verify `purchased` tag triggers removal of `abandoned_cart` |
| GHL failure doesn't break checkout | Unset `GHL_API_KEY`, verify checkout still completes |
| Duplicate contacts handled | Submit same email twice, verify GHL upserts (no duplicates) |
| Custom fields populated | After purchase, verify `last_order_number` etc. appear on GHL contact |

---

## Key Principle

**GHL API failures must NEVER break the e-commerce flow.** All API calls are fire-and-forget by design. If GHL is down, unreachable, or returns an error:

- Orders still complete
- Confirmation emails still send (via Resend)
- Cart still clears
- Customer still sees success page

GHL is the marketing layer. The transaction layer (Stripe + Supabase + Resend) runs independently.
