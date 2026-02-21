# Rebirth World × GoHighLevel Integration Plan

> **Purpose:** Connect the Rebirth World e-commerce platform to GoHighLevel for marketing automation  
> **Scope:** Event-driven webhooks from Rebirth World → GHL workflows  
> **Date:** February 20, 2026

---

## Architecture

```
REBIRTH WORLD (rebirth.world)          GoHighLevel
┌─────────────────────────┐            ┌──────────────────────────┐
│                         │            │                          │
│  Stripe Webhook fires   │            │  INBOUND WEBHOOKS        │
│  ──────────────────►    │            │  (catch all events)      │
│  /api/webhooks/stripe   │            │                          │
│         │               │   HTTP     │  ┌──────────────────┐    │
│         ▼               │  ──────►   │  │ New Purchase     │    │
│  Create order in DB     │  POST      │  │ workflow trigger  │    │
│  Send confirmation      │            │  └──────────────────┘    │
│  (Resend — instant)     │            │                          │
│         │               │            │  ┌──────────────────┐    │
│         ▼               │  ──────►   │  │ New Subscriber   │    │
│  Fire GHL webhook       │  POST      │  │ workflow trigger  │    │
│  (async, non-blocking)  │            │  └──────────────────┘    │
│                         │            │                          │
│  Newsletter form fires  │            │  ┌──────────────────┐    │
│  ──────────────────►    │  ──────►   │  │ Cart Abandoned   │    │
│  /api/newsletter        │  POST      │  │ workflow trigger  │    │
│                         │            │  └──────────────────┘    │
│  Cron / Edge Function   │            │                          │
│  checks abandoned_carts │  ──────►   │  WORKFLOWS               │
│  view every hour        │  POST      │  • Welcome sequence      │
│                         │            │  • Post-purchase drip     │
└─────────────────────────┘            │  • Abandon cart recovery  │
                                       │  • Drop announcements     │
                                       │  • Wedding band nurture   │
                                       │  • SMS campaigns          │
                                       └──────────────────────────┘
```

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

## Events to Send to GHL

### Event 1: New Purchase

**Trigger:** Stripe `checkout.session.completed` webhook  
**When:** Immediately after order creation in Supabase  
**Where to add:** Inside the existing webhook handler at `/api/webhooks/stripe/route.ts`

**Payload:**
```json
{
  "event": "purchase_completed",
  "email": "customer@email.com",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "",
  "order_number": "RB-1042",
  "order_total": 7500,
  "currency": "usd",
  "items": [
    {
      "product_name": "Ocean Wave Skateboard Ring",
      "variant": "Size 9",
      "quantity": 1,
      "price": 2500
    }
  ],
  "shipping_address": {
    "city": "Haleiwa",
    "state": "HI",
    "country": "US"
  },
  "source": "rebirth.world",
  "timestamp": "2026-02-20T15:30:00Z"
}
```

**GHL workflow triggered:** Post-Purchase Sequence
- Day 1: Thank you + care instructions
- Day 7: "Share your ring" — encourage UGC
- Day 14: Cross-sell / referral ask
- Day 30: New drop preview

**Tags to apply in GHL:** `customer`, `purchased`, collection name (e.g., `skateboard-rings`)

---

### Event 2: Newsletter Signup

**Trigger:** Form submission on website (footer, popup, or dedicated page)  
**When:** After inserting into `email_subscribers` table  
**Where to add:** New API route `/api/newsletter/route.ts`

**Payload:**
```json
{
  "event": "newsletter_signup",
  "email": "subscriber@email.com",
  "first_name": "Jane",
  "source": "website_footer",
  "timestamp": "2026-02-20T15:30:00Z"
}
```

**GHL workflow triggered:** Welcome Sequence (from PRD Section 11.3)
- Email 1: Daniel's story + brand origin (immediate)
- Email 2: How the rings are made (Day 2)
- Email 3: Customer stories / social proof (Day 4)
- Email 4: The humanitarian mission (Day 7)
- Email 5: First purchase incentive (Day 10)

**Tags to apply in GHL:** `subscriber`, `lead`, source tag

---

### Event 3: Abandoned Cart

**Trigger:** Cron job or Vercel Edge Function (every hour)  
**When:** User has items in cart >1 hour, no order placed after  
**Source data:** `abandoned_carts` Supabase view (already exists in schema)

**Payload:**
```json
{
  "event": "cart_abandoned",
  "email": "shopper@email.com",
  "first_name": "Mike",
  "item_count": 2,
  "cart_value": 5000,
  "last_activity": "2026-02-20T14:00:00Z",
  "recovery_url": "https://rebirth.world/cart",
  "timestamp": "2026-02-20T15:30:00Z"
}
```

**GHL workflow triggered:** Abandon Cart Recovery (from PRD Section 11.3)
- Email 1: "Still thinking about it?" + product reminder (1 hour)
- Email 2: Social proof + craft story (24 hours)
- Email 3: Personal note from Daniel + soft urgency (48 hours)

**Tags to apply in GHL:** `abandoned_cart`  
**Remove tag when:** Purchase completed (Event 1 fires)

---

### Event 4: Account Created

**Trigger:** Successful signup (email verification confirmed)  
**When:** OAuth callback or email confirmation  
**Where to add:** In the auth callback handler or via a Supabase database trigger

**Payload:**
```json
{
  "event": "account_created",
  "email": "newuser@email.com",
  "first_name": "Sarah",
  "auth_method": "google_oauth",
  "timestamp": "2026-02-20T15:30:00Z"
}
```

**GHL action:** Create/update contact, apply `account` tag

---

### Event 5: Wedding Band Interest (Future)

**Trigger:** User views wedding band products, clicks wedding band CTA, or submits wedding band lead form  
**When:** Product page interaction tracking (PostHog event → webhook, or dedicated form)

**Payload:**
```json
{
  "event": "wedding_interest",
  "email": "groom@email.com",
  "first_name": "Alex",
  "wedding_date": "2026-09-15",
  "ring_size": "10",
  "preferred_material": "steel-bog-oak",
  "timestamp": "2026-02-20T15:30:00Z"
}
```

**GHL workflow triggered:** Wedding Band Nurture Sequence
- Custom ring consultation CTA
- Material education series
- Matching set upsell
- Anniversary reminder loop (long-term)

**Tags to apply in GHL:** `wedding_lead`, `hot_lead`

---

## Implementation

### Step 1: Create GHL Webhook URLs

In GoHighLevel, set up **Inbound Webhooks** for each workflow:

1. Go to Automations → Create Workflow → Trigger: Inbound Webhook
2. Copy the webhook URL for each workflow
3. Store these URLs as environment variables:

```bash
# .env.local
GHL_WEBHOOK_PURCHASE=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_NEWSLETTER=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_ABANDONED_CART=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_ACCOUNT_CREATED=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_WEDDING_INTEREST=https://services.leadconnectorhq.com/hooks/xxxxx
```

### Step 2: Create GHL Helper Library

```typescript
// src/lib/ghl.ts

/**
 * Fire-and-forget webhook to GoHighLevel
 * Non-blocking — never fails the parent operation
 */
export async function fireGHLWebhook(
  webhookUrl: string | undefined,
  payload: Record<string, unknown>
): Promise<void> {
  if (!webhookUrl) {
    console.log("[GHL] No webhook URL configured, skipping");
    return;
  }

  try {
    // Fire and forget — don't await in critical paths
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Log but never throw — GHL failures must not break checkout
      console.error("[GHL] Webhook delivery failed:", err.message);
    });
  } catch (err) {
    console.error("[GHL] Webhook setup failed:", err);
  }
}

// Convenience wrappers
export function notifyPurchase(data: PurchasePayload) {
  return fireGHLWebhook(process.env.GHL_WEBHOOK_PURCHASE, {
    event: "purchase_completed",
    ...data,
  });
}

export function notifyNewsletterSignup(data: NewsletterPayload) {
  return fireGHLWebhook(process.env.GHL_WEBHOOK_NEWSLETTER, {
    event: "newsletter_signup",
    ...data,
  });
}

export function notifyAbandonedCart(data: AbandonedCartPayload) {
  return fireGHLWebhook(process.env.GHL_WEBHOOK_ABANDONED_CART, {
    event: "cart_abandoned",
    ...data,
  });
}

export function notifyAccountCreated(data: AccountPayload) {
  return fireGHLWebhook(process.env.GHL_WEBHOOK_ACCOUNT_CREATED, {
    event: "account_created",
    ...data,
  });
}

// TypeScript interfaces
interface PurchasePayload {
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

interface NewsletterPayload {
  email: string;
  first_name?: string;
  source: string;
}

interface AbandonedCartPayload {
  email: string;
  first_name?: string;
  item_count: number;
  cart_value: number;
  recovery_url: string;
  last_activity: string;
}

interface AccountPayload {
  email: string;
  first_name?: string;
  auth_method: string;
}
```

### Step 3: Add to Stripe Webhook Handler

In `/api/webhooks/stripe/route.ts`, after order creation:

```typescript
case "checkout.session.completed":
  // ... existing order creation logic ...

  // After order + items are created and confirmation email sent:
  // Fire GHL webhook (non-blocking)
  notifyPurchase({
    email: session.customer_details?.email || order.email,
    first_name: session.customer_details?.name?.split(" ")[0],
    last_name: session.customer_details?.name?.split(" ").slice(1).join(" "),
    order_number: order.order_number,
    order_total: order.total,
    currency: order.currency,
    items: orderItems.map(item => ({
      product_name: item.product_name,
      variant: item.variant_name,
      quantity: item.quantity,
      price: item.unit_price,
    })),
    shipping_address: {
      city: session.shipping_details?.address?.city,
      state: session.shipping_details?.address?.state,
      country: session.shipping_details?.address?.country,
    },
  });

  break;
```

### Step 4: Create Newsletter API Route

```typescript
// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewsletterSignup } from "@/lib/ghl";

const schema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  source: z.string().default("website"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Insert into email_subscribers (upsert to handle duplicates)
  const { error } = await supabase
    .from("email_subscribers")
    .upsert(
      {
        email: parsed.data.email,
        first_name: parsed.data.first_name || null,
        source: parsed.data.source,
        subscribed: true,
      },
      { onConflict: "email" }
    );

  if (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }

  // Fire GHL webhook (non-blocking)
  notifyNewsletterSignup({
    email: parsed.data.email,
    first_name: parsed.data.first_name,
    source: parsed.data.source,
  });

  return NextResponse.json({ success: true });
}
```

### Step 5: Abandoned Cart Cron (Vercel Cron or Edge Function)

```typescript
// src/app/api/cron/abandoned-carts/route.ts
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyAbandonedCart } from "@/lib/ghl";

// Vercel cron config in vercel.json:
// { "crons": [{ "path": "/api/cron/abandoned-carts", "schedule": "0 * * * *" }] }

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: abandonedCarts, error } = await supabase
    .from("abandoned_carts")
    .select("*");

  if (error || !abandonedCarts) {
    console.error("Abandoned cart query failed:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  // Fire GHL webhook for each abandoned cart
  for (const cart of abandonedCarts) {
    notifyAbandonedCart({
      email: cart.email,
      first_name: cart.full_name?.split(" ")[0],
      item_count: cart.item_count,
      cart_value: 0, // Would need to join with prices for actual value
      recovery_url: "https://rebirth.world/cart",
      last_activity: cart.last_activity,
    });
  }

  return NextResponse.json({
    success: true,
    processed: abandonedCarts.length,
  });
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/abandoned-carts",
      "schedule": "0 * * * *"
    }
  ]
}
```

Add `CRON_SECRET` to environment variables.

---

## GHL Workflow Setup Guide

### Workflow 1: Welcome Sequence

**Trigger:** Inbound Webhook (`newsletter_signup` event)

```
→ Create/Update Contact (email, first_name, tags: ["subscriber", "lead"])
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

**Trigger:** Inbound Webhook (`purchase_completed` event)

```
→ Create/Update Contact (email, name, tags: ["customer", "purchased"])
→ Remove Tag: "abandoned_cart" (if exists)
→ Wait 0 min
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

**Trigger:** Inbound Webhook (`cart_abandoned` event)

```
→ Create/Update Contact (email, tags: ["abandoned_cart"])
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

**Trigger:** Inbound Webhook (`wedding_interest` event)

```
→ Create/Update Contact (email, tags: ["wedding_lead", "hot_lead"])
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

## Environment Variables to Add

```bash
# GoHighLevel Webhook URLs
GHL_WEBHOOK_PURCHASE=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_NEWSLETTER=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_ABANDONED_CART=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_ACCOUNT_CREATED=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_WEDDING_INTEREST=https://services.leadconnectorhq.com/hooks/xxxxx

# Cron authentication
CRON_SECRET=your-random-secret-here
```

---

## Testing Checklist

| Test | How |
|------|-----|
| Purchase → GHL contact created | Make test purchase, verify contact appears in GHL with `customer` tag |
| Newsletter → Welcome sequence starts | Submit newsletter form, verify GHL workflow triggers |
| Abandoned cart → Recovery emails | Add items to cart, wait 1+ hour, check GHL for `abandoned_cart` tag |
| Purchase cancels abandon flow | Start abandon flow, then complete purchase — verify recovery stops |
| GHL failure doesn't break checkout | Temporarily set invalid webhook URL, verify checkout still completes |
| Duplicate contacts handled | Submit same email twice, verify GHL doesn't create duplicates |

---

## Key Principle

**GHL webhook failures must NEVER break the e-commerce flow.** The `fireGHLWebhook` function is fire-and-forget by design. If GHL is down, unreachable, or returns an error:

- Orders still complete ✅
- Confirmation emails still send (via Resend) ✅
- Cart still clears ✅
- Customer still sees success page ✅

GHL is the marketing layer. The transaction layer (Stripe + Supabase + Resend) runs independently.
