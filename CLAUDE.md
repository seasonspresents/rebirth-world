# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rebirth World** (`rebirth.world`) is a production e-commerce storefront for handcrafted recycled skateboard jewelry and wood-lined metal wedding bands. Built by converting a SaaS boilerplate into a one-time-purchase e-commerce platform.

**Founder:** Daniel Malzl — skateboarder, jeweler, son of Austrian master jeweler Christoph Malzl (trained at Koppenwallner's, Salzburg). Based on the North Shore of Oahu, Hawaii.

**Brand identity:** Recycled skateboard rings, premium wood-lined wedding bands, apparel. Tagline: "Embrace Change 🪷"

### What's Implemented

- **Storefront** — Homepage, shop page, product detail, collection filters
- **Cart system** — LocalStorage + Supabase persistence, drawer + full page
- **Stripe checkout** — One-time payments, shipping address collection, webhooks
- **Order management** — Dashboard with order list, detail, status tracking
- **Authentication** — Supabase (email/password + Google OAuth)
- **Blog** — MDX-based with 3 jewelry-focused posts
- **Email** — Resend integration (order confirmation, auth emails)
- **70+ UI components** — shadcn/ui + Magic UI
- **Legal pages** — Privacy, Terms, Cookie Policy (e-commerce specific)
- **SEO** — Sitemap, robots.txt, Open Graph, JSON-LD structured data

Build passes with 0 errors, 41 pages generated.

## Development Commands

```bash
# Install dependencies (uses pnpm — NOT npm or yarn)
pnpm install

# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# E2E tests
pnpm test:e2e
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, RSC) | 16.0.10 |
| UI | React | 19.2.0 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui (New York) + Magic UI | 70+ components |
| Animation | motion (Framer Motion) | 12.x |
| Auth | Supabase (@supabase/ssr) | 0.7.0 / 2.81.1 |
| Database | Supabase (PostgreSQL + RLS) | — |
| Payments | Stripe (one-time checkout) | 19.3.1 |
| Email | Resend + React Email | 6.5.0 |
| Charts | Recharts | 2.15.4 |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Dark mode | next-themes | 0.4.6 |
| Toasts | Sonner | 2.0.7 |
| Content | MDX (next-mdx-remote-client) | 2.1.7 |
| Testing | Playwright | 1.56.1 |
| Analytics | PostHog (optional), Vercel Analytics | — |
| Hosting | Vercel | — |

## Project Architecture

### Route Structure

```text
src/app/
├── (marketing)/          # Public storefront — has header + footer layout
│   ├── page.tsx          # Homepage (hero, products, value props, testimonials, FAQ, newsletter)
│   ├── layout.tsx        # Header + Footer wrapper
│   ├── shop/
│   │   └── page.tsx      # Product catalog with collection filter
│   ├── shop/[slug]/
│   │   └── page.tsx      # Product detail (images, variants, sizing, engraving, add-to-cart)
│   ├── pricing/          # Pricing tiers (retained, may repurpose)
│   └── contact/          # Contact form with Zod validation
│
├── (auth)/               # Authentication pages
│   ├── actions.ts        # Server actions (signIn, signUp, signInWithOAuth, etc.)
│   ├── sign-in/          # Login (email/password + Google OAuth)
│   ├── sign-up/          # Registration
│   ├── forgot-password/  # Password reset request
│   └── reset-password/   # Password reset form
│
├── (dashboard)/          # Protected area (auth required via middleware)
│   └── dashboard/
│       ├── page.tsx          # Overview (KPI cards + order volume chart from Supabase)
│       ├── layout.tsx        # Sidebar layout
│       ├── orders/
│       │   ├── page.tsx      # Order list table with status badges
│       │   └── [id]/page.tsx # Order detail (items, shipping, financials)
│       └── settings/
│           ├── general/      # Store settings
│           ├── account/      # Profile, email, password
│           ├── billing/      # Billing info
│           └── notifications/# Notification preferences
│
├── (legal)/              # Legal pages (MDX content)
│   ├── privacy/
│   ├── terms-of-service/
│   └── cookie-policy/
│
├── blog/                 # Blog (MDX)
│   ├── page.tsx          # Blog listing
│   └── [slug]/page.tsx   # Individual post
│
├── cart/                 # Full-page cart view
│   └── page.tsx
│
├── order/
│   └── success/page.tsx  # Order confirmation with confetti
│
├── api/                  # API routes (see below)
├── auth/callback/        # Supabase OAuth callback
├── layout.tsx            # Root layout (fonts, theme, auth provider, JSON-LD)
├── globals.css           # Tailwind + Rebirth color palette
├── sitemap.ts            # Dynamic sitemap
├── robots.ts             # Robots.txt
└── not-found.tsx         # 404 page
```

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/products` | GET | List active Stripe products with prices |
| `/api/products/[id]` | GET | Single product with all prices |
| `/api/cart` | GET | Fetch user's server-side cart |
| `/api/cart` | POST | Add/update cart items |
| `/api/cart` | DELETE | Remove cart items |
| `/api/cart/sync` | POST | Sync localStorage cart → Supabase on login |
| `/api/checkout` | POST | Create Stripe Checkout Session (one-time payment) |
| `/api/webhooks/stripe` | POST | Handle `checkout.session.completed`, create order + items |
| `/api/contact` | POST | Contact form submission |
| `/api/send` | POST | Send transactional email via Resend |
| `/api/checkout_sessions` | POST | Legacy subscription checkout (from boilerplate, may remove) |

### Component Organization

```text
src/components/
├── ui/                   # 70+ shadcn/ui + Magic UI components (DO NOT MODIFY)
│   ├── button, card, dialog, input, table, tabs, etc.
│   ├── border-beam, shine-border, particles, marquee      (Magic UI)
│   ├── animated-beam, animated-list, animated-shiny-text   (Magic UI)
│   ├── bento-grid, number-ticker, orbiting-circles         (Magic UI)
│   ├── confetti, interactive-grid-pattern                  (Magic UI)
│   └── ... (57+ total components)
│
├── shop/                 # E-commerce components
│   ├── product-card.tsx          # Product card for grid display
│   ├── collection-filter.tsx     # Category filter tabs
│   └── add-to-cart-button.tsx    # Size selector + engraving + add to cart
│
├── cart/                 # Cart system
│   ├── cart-context.tsx          # CartProvider (localStorage + Supabase sync)
│   └── cart-drawer.tsx           # Slide-out cart drawer
│
├── marketing/            # Storefront marketing sections
│   ├── hero.tsx                  # Brand hero section
│   ├── social-proof.tsx          # Customer count / review stats
│   ├── pricing.tsx               # Pricing tiers
│   ├── testimonials.tsx          # Customer testimonials
│   ├── faq.tsx                   # FAQ accordion
│   ├── cta.tsx                   # Call-to-action (links to /shop)
│   └── contact-form.tsx          # Contact form with Zod validation
│
├── dashboard/            # Dashboard components
│   ├── app-sidebar.tsx           # Sidebar (Orders, Resources, Settings)
│   ├── chart-area-interactive.tsx # Order volume chart (Recharts, accepts props)
│   ├── section-cards.tsx         # KPI cards (accepts props, fetched from Supabase)
│   ├── data-table.tsx            # Generic data table
│   ├── nav-main.tsx              # Main nav items
│   ├── nav-secondary.tsx         # Secondary nav
│   ├── nav-user.tsx              # User menu in sidebar
│   ├── header-user-menu.tsx      # Header user dropdown
│   └── notifications-dropdown.tsx
│
├── auth/                 # Authentication
│   ├── auth-context.tsx          # AuthProvider (wraps app in root layout)
│   ├── auth-page-layout.tsx      # Auth page layout wrapper
│   └── oauth-buttons.tsx         # Google OAuth button
│
├── email/                # React Email templates
│   ├── welcome.tsx               # Welcome email
│   ├── confirm-signup.tsx        # Email confirmation
│   └── order-confirmation.tsx    # Order confirmation email
│
├── shared/               # Layout components
│   ├── header.tsx                # Site header (Shop, Our Story, Blog, Contact, cart icon)
│   ├── footer.tsx                # Site footer
│   ├── mobile-nav.tsx            # Mobile nav drawer
│   ├── logo.tsx                  # Rebirth World logo
│   ├── theme-toggle.tsx          # Theme toggle
│   └── mode-toggle.tsx           # Dark/light mode
│
├── theme-provider.tsx    # next-themes provider
└── posthog-provider.tsx  # PostHog analytics (optional)
```

### Library Code

```text
src/lib/
├── payments/
│   ├── stripe.ts         # Stripe client initialization
│   ├── products.ts       # Stripe Products API helpers (fetch, format, cache)
│   └── index.ts          # Exports
│
├── supabase/
│   ├── client.ts         # Browser client (@supabase/ssr)
│   ├── server.ts         # Server client + service client (for webhooks)
│   ├── middleware.ts      # Auth middleware (protects /dashboard)
│   └── types.ts          # TypeScript types for all tables
│
├── emails.ts             # Resend email system (type-safe send function)
├── posts.ts              # Blog post utilities (MDX)
└── utils.ts              # cn() utility for Tailwind class merging
```

### Content

```text
src/content/
├── blog/
│   ├── the-story-behind-recycled-jewelry.mdx
│   ├── how-to-care-for-your-handcrafted-jewelry.mdx
│   └── the-complete-ring-sizing-guide.mdx
│
└── legal/
    ├── privacy.mdx           # REBIRTH WORLD LLC privacy policy
    ├── terms-of-service.mdx  # E-commerce terms (shipping, returns, warranty)
    └── cookie-policy.mdx
```

## Database Schema

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `user_profiles` | User profile data (name, avatar, preferences) | Users see own |
| `orders` | Order records (status, financials in cents, shipping, tracking) | Users see own |
| `order_items` | Line items with product snapshots at purchase time | Users see own (via order) |
| `cart_items` | Persistent server-side cart | Users manage own |
| `shipping_addresses` | Saved customer addresses | Users manage own |
| `email_subscribers` | Newsletter signups | Public insert |
| `payment_history` | Payment records (linked to orders) | Users see own |
| `user_subscriptions` | Legacy from boilerplate (may remove) | Users see own |

### Views

| View | Purpose |
|------|---------|
| `abandoned_carts` | Users with cart items >1 hour old and no subsequent order |

### Key Design Decisions

- **All money values stored in cents** (integers) — no floating point
- **Order numbers** use PostgreSQL sequence: `RB-1001`, `RB-1002`, etc.
- **Product snapshots** in `order_items` — name, price, image captured at purchase time
- **Guest checkout supported** — `orders.user_id` is nullable
- **Cart deduplication** — unique constraint on `(user_id, stripe_price_id, variant_name, engraving_text)`

### Creating a New Migration

```bash
# Create migration file
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_description.sql
```

Always:
1. Enable RLS on new tables
2. Create policies for user access
3. Add indexes on foreign keys and common query columns
4. Update `src/lib/supabase/types.ts` with new TypeScript types

## E-Commerce Flow

```
Browse /shop
  → View product /shop/[slug]
  → Select ring size + optional engraving
  → Add to Cart (CartProvider: localStorage + Supabase if logged in)
  → Review cart (CartDrawer slide-out or /cart page)
  → "Checkout" → POST /api/checkout
  → Stripe Checkout (collects payment + shipping address)
  → Stripe fires checkout.session.completed webhook
  → Webhook: creates order + order_items in Supabase, sends confirmation email
  → Customer redirected to /order/success (confetti, cart cleared)
  → Customer views order history at /dashboard/orders
```

## Stripe Integration

### Product Catalog

Products are managed in the **Stripe Dashboard** (single source of truth). No local products table.

**Product metadata fields in Stripe:**
- `collection` — "skateboard-rings" | "wedding-bands" | "apparel"
- `material` — "recycled-skateboard" | "steel-bog-oak" | "steel-koa"
- `ring_sizes` — "5,6,7,8,9,10,11,12"
- `featured` — "true" | "false"
- `slug` — URL-friendly product identifier

**Fetching products:**
```typescript
import { getProducts, getProductBySlug } from "@/lib/payments/products";

// All active products
const products = await getProducts();

// Single product by slug
const product = await getProductBySlug("ocean-wave-ring");
```

### Checkout

The checkout creates a **one-time payment** (not a subscription):

```typescript
// POST /api/checkout
const session = await stripe.checkout.sessions.create({
  line_items: cartItems.map(item => ({
    price: item.stripe_price_id,
    quantity: item.quantity,
  })),
  mode: "payment",  // NOT "subscription"
  shipping_address_collection: { allowed_countries: ['US', 'CA', ...] },
  shipping_options: [/* standard + express */],
  // ...
});
```

### Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create order + order_items, send confirmation email, record payment |

The webhook handler lives at `/api/webhooks/stripe/route.ts`.

## Brand & Design

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary Dark | Charcoal Black | `#1a1a1a` |
| Primary Light | Warm White | `#f5f0e8` |
| Accent 1 | Ocean Teal | `#2a9d8f` |
| Accent 2 | Burnt Amber | `#e07a3a` |
| Accent 3 | Lotus Pink | `#d4a0a0` |
| Neutral | Driftwood Gray | `#8a8578` |
| Earth Tone | Moss Green | `#5a6b4a` |

### Typography

| Role | Font |
|------|------|
| Body | DM Sans |
| Display/Headlines | Instrument Serif |

### Design Principles

1. **Handmade over polished** — imperfection is the aesthetic
2. **Story over specs** — lead with meaning, follow with materials
3. **Warmth over minimalism** — organic, human, not cold tech
4. **Authenticity over aspiration** — real photos, real stories, real craft
5. **Community over commerce** — broken boards donated by local skaters

### Voice & Tone

- **We sound like:** A wise, grounded skater friend who's also a master craftsman
- **Not corporate, not salesy, not try-hard**
- **Key phrases:** "Embrace Change," "Handmade with intention," "Reborn," "One of a kind," "Crafted, not manufactured"
- **Avoid:** "Luxury" (unless wedding bands), "cheap," "eco-friendly" as lead, corporate jargon

## Cart System

The cart uses a **dual-storage strategy:**

1. **LocalStorage** — always available, works for guests
2. **Supabase `cart_items`** — syncs for logged-in users

```typescript
// CartProvider wraps the app in (marketing) layout
// Access cart anywhere:
const { items, addItem, removeItem, updateQuantity, clearCart, itemCount, total } = useCart();
```

On login, `POST /api/cart/sync` merges localStorage cart into Supabase.
On checkout completion, `/order/success` clears both stores.

## Email System

Resend handles **transactional emails only** (instant delivery):

| Email Type | Template | Trigger |
|------------|----------|---------|
| `welcome` | `email/welcome.tsx` | User signup |
| `confirm-signup` | `email/confirm-signup.tsx` | Email verification |
| `order-confirmation` | `email/order-confirmation.tsx` | Stripe webhook |

```typescript
import { sendEmail } from "@/lib/emails";

await sendEmail("order-confirmation", customerEmail, {
  orderNumber: "RB-1001",
  items: [...],
  total: "$75.00",
});
```

**Marketing emails** (sequences, drips, newsletters) are handled externally by GoHighLevel (GHL), not Resend.

## Environment Variables

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://rebirth.world

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# Stripe (currently TEST mode)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

All configured in `.env.local` and Vercel production environment.

## Adding New Features

### New Product Page / Collection

Products are managed in Stripe. To add a new collection:
1. Create products in Stripe Dashboard with `collection` metadata
2. Collection filter in `/shop` auto-discovers collections from product metadata
3. No code changes needed for new products

### New Email Template

1. Create React Email component in `src/components/email/`
2. Add type and config to `src/lib/emails.ts`
3. Call `sendEmail()` from webhook or API route

### New Dashboard Page

```typescript
// src/app/(dashboard)/dashboard/[new-page]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Fetch data from Supabase
  const { data } = await supabase.from('orders').select('*');

  return <YourComponent data={data} />;
}
```

Then add nav item to `src/components/dashboard/app-sidebar.tsx`.

### New API Route

```typescript
// src/app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ /* validation */ });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClient();
  // ... your logic

  return NextResponse.json({ success: true });
}
```

### New Blog Post

1. Create `.mdx` file in `src/content/blog/` (kebab-case filename)
2. Add frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   description: "SEO description"
   date: "2026-02-20"
   author:
     name: "Daniel Malzl"
     picture: "/blog/authors/daniel.png"
   thumbnail: "/blog/thumbnails/post.png"
   tags: ["jewelry", "sustainability", "craft"]
   ---
   ```
3. Post auto-appears on `/blog` sorted by date

## Important Notes

### Package Manager
This project uses **pnpm**. Always `pnpm install`, `pnpm add`, etc. Never npm or yarn.

### Tailwind CSS v4
CSS-first configuration. Use `@import "tailwindcss"` not `@tailwind` directives. Native CSS variables.

### Stripe Mode
Currently in **test mode**. Switch to live keys before launch. Update webhook endpoint URL when deploying to production domain.

### Money
All financial values in the database are stored in **cents** (integers). Display formatting divides by 100.

### Legacy Code
Some boilerplate artifacts may remain:
- `/api/checkout_sessions` — subscription-based checkout (not used)
- `user_subscriptions` table — from SaaS era (not actively used)
- `/pricing` page — may be repurposed or removed

These don't affect functionality but can be cleaned up.

## Deployment

Hosted on **Vercel**. Domain: `rebirth.world`

**Production deploy:**
```bash
vercel --prod --yes
```

**Post-deploy checklist:**
1. Verify Stripe webhook endpoint is `https://rebirth.world/api/webhooks/stripe`
2. Test full checkout flow (add to cart → checkout → order confirmation)
3. Verify order appears in `/dashboard/orders`
4. Check confirmation email delivery
5. Verify sitemap at `/sitemap.xml`
6. Test auth flows (signup, login, OAuth, password reset)
