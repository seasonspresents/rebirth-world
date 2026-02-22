# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

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
- **Animation system** — GSAP + Lenis smooth scroll, scroll-triggered reveals, text animations, parallax, magnetic buttons, custom cursor, 3D tilt
- **3D ring viewer** — React Three Fiber procedural ring with custom GLSL wood-stripe shader, scroll-driven 3D scene, interactive ring customizer with 5 wood presets
- **Section color schemes** — 4 named CSS schemes (warm/dark/ocean/earth) with dark mode variants
- **Fluid typography** — `clamp()`-based mega-typography utilities for editorial headlines
- **Branded preloader** — Session-based "REBIRTH / Embrace Change" intro animation
- **Announcement bar** — Marquee ticker with brand phrases

Build passes with 0 errors, 62 pages generated.

## Deep Context — Read These When Relevant

| Document | Path | Read When |
|----------|------|-----------|
| Brand PRD | `docs/REBIRTH_WORLD_PRD.md` | Writing copy, designing UI, making brand/marketing decisions. Has avatars, voice guide, competitive landscape, advisory council, funnel architecture. |
| UI/UX Playbook | `docs/UI_UX_TRANSFORMATION_PLAYBOOK.md` | Animation/interaction work, adding new scroll effects, understanding inspiration sites and pattern decisions. Has 14-site research, 10 implementation patterns, brand asset inventory. |
| GHL Integration | `docs/GHL_INTEGRATION_PLAN.md` | Working on webhook integrations, email/CRM flows |
| Conversion Blueprint | `docs/SABO_TO_REBIRTH_BLUEPRINT.md` | Understanding codebase origin and conversion decisions |
| Brand Skill | `.claude/skills/rebirth-brand/SKILL.md` | Auto-loaded when working on copy, UI, landing pages, product pages, emails |
| Claude Code Setup | `docs/CLAUDE_CODE_SETUP_GUIDE.md` | Reference for skills/plugins system and project setup |

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

# Supabase migrations
npx supabase db push

# Stripe webhook testing
npx stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, RSC) | 16.0.10 |
| UI | React | 19.2.0 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui (New York) + Magic UI + Aceternity UI | 70+ components |
| Animation (scroll) | GSAP + @gsap/react + ScrollTrigger + SplitText | 3.14.2 / 2.1.2 |
| Animation (motion) | motion (Framer Motion) | 12.x |
| Smooth scroll | Lenis | 1.3.17 |
| 3D | React Three Fiber + Drei + Three.js | 9.5.0 / 10.7.7 / 0.183.1 |
| Auth | Supabase (@supabase/ssr) | 0.7.0 / 2.81.1 |
| Database | Supabase (PostgreSQL + RLS) | — |
| Payments | Stripe (one-time checkout) | 19.3.1 |
| Email (transactional) | Resend + React Email | 6.5.0 |
| Email (marketing) | GoHighLevel (GHL) | — |
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
| `/api/newsletter` | POST | Newsletter signup → Supabase + GHL webhook |
| `/api/checkout_sessions` | POST | Legacy subscription checkout (from boilerplate, may remove) |

### Component Organization

```text
src/components/
├── 3d/                   # React Three Fiber 3D components
│   ├── ring-model.tsx            # Procedural torus with GLSL wood-stripe shader + engraving
│   ├── ring-viewer.tsx           # Self-contained Canvas with lighting, controls, shadows
│   ├── scroll-ring-scene.tsx     # Scroll-driven 3D ring section (GSAP ScrollTrigger)
│   ├── scroll-ring-scene-lazy.tsx # Client wrapper for dynamic import (ssr: false)
│   ├── ring-customizer.tsx       # 5 wood presets, engraving input, live 3D preview
│   └── index.ts                  # Barrel exports
│
├── ui/                   # 70+ shadcn/ui + Magic UI + animation components
│   ├── button, card, dialog, input, table, tabs, etc.
│   ├── border-beam, shine-border, particles, marquee      (Magic UI)
│   ├── animated-beam, animated-list, animated-shiny-text   (Magic UI)
│   ├── bento-grid, number-ticker, orbiting-circles         (Magic UI)
│   ├── confetti, interactive-grid-pattern                  (Magic UI)
│   ├── scroll-reveal.tsx         # Declarative GSAP scroll-triggered reveal wrapper
│   ├── text-reveal.tsx           # GSAP SplitText scroll-triggered text animation
│   ├── scroll-image.tsx          # Overflow-clip image reveal (scale 1.15→1.0 on scroll)
│   ├── magnetic.tsx              # GSAP magnetic pull-toward-cursor button effect
│   ├── custom-cursor.tsx         # Branded dot+ring cursor (desktop only, teal, mix-blend)
│   ├── parallax-layer.tsx        # Declarative GSAP parallax wrapper
│   ├── animated-icon.tsx         # SVG stroke-draw animation on scroll
│   └── ... (57+ total components)
│
├── providers/            # Context providers
│   └── smooth-scroll-provider.tsx # Lenis smooth scroll + GSAP ScrollTrigger sync
│
├── shop/                 # E-commerce components
│   ├── product-card.tsx          # Product card with 3D tilt, collection theming
│   ├── product-image-gallery.tsx # Gallery with ScrollImage cinematic reveal
│   ├── product-3d-toggle.tsx     # Photos/3D View tab toggle (ring products)
│   ├── product-story.tsx         # Product story with TextReveal
│   ├── collection-filter.tsx     # Category filter tabs
│   └── add-to-cart-button.tsx    # Size selector + engraving + add to cart
│
├── cart/                 # Cart system
│   ├── cart-context.tsx          # CartProvider (localStorage + Supabase sync)
│   └── cart-drawer.tsx           # Slide-out cart drawer (with useLenisPause)
│
├── marketing/            # Storefront marketing sections
│   ├── brand-hero.tsx            # Hero with Magnetic CTA, ParallaxLayer, fluid typography
│   ├── featured-products.tsx     # section-dark, TextReveal heading
│   ├── value-props.tsx           # section-earth, AnimatedIcon stroke-draw
│   ├── testimonials.tsx          # section-ocean, glassmorphism cards
│   ├── faq.tsx                   # section-earth, TextReveal
│   ├── newsletter-cta.tsx        # section-warm, TextReveal
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
│   ├── header.tsx                # Site header + AnnouncementBar
│   ├── footer.tsx                # Site footer
│   ├── mobile-nav.tsx            # Mobile nav drawer (with useLenisPause)
│   ├── announcement-bar.tsx      # Marquee ticker with brand phrases
│   ├── preloader.tsx             # Session-based branded preloader
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
├── gsap/
│   └── register.ts       # GSAP singleton — registers ScrollTrigger + SplitText once
│
├── payments/
│   ├── stripe.ts         # Stripe client initialization
│   ├── products.ts       # Stripe Products API helpers (fetch, format, cache)
│   ├── constants.ts      # Product types, COLLECTION_COLORS, getCollectionStyle()
│   └── index.ts          # Exports
│
├── supabase/
│   ├── client.ts         # Browser client (@supabase/ssr)
│   ├── server.ts         # Server client + service client (for webhooks)
│   ├── middleware.ts      # Auth middleware (protects /dashboard)
│   └── types.ts          # TypeScript types for all tables
│
├── ghl.ts                # GoHighLevel webhook helper
├── emails.ts             # Resend email system (type-safe send function)
├── posts.ts              # Blog post utilities (MDX)
└── utils.ts              # cn() utility for Tailwind class merging

src/hooks/
├── use-gsap-reveal.ts    # Reusable GSAP ScrollTrigger reveal (opacity+y, stagger)
├── use-text-reveal.ts    # GSAP SplitText scroll animation (chars/words/lines)
├── use-lenis-pause.ts    # Pause/resume Lenis smooth scroll for modals
├── use-parallax.ts       # GSAP ScrollTrigger parallax movement
└── use-tilt.ts           # 3D perspective tilt on hover (desktop only)
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
  → GHL webhook fires for purchase event (CRM + marketing automation)
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
| `checkout.session.completed` | Create order + order_items, send confirmation email, record payment, fire GHL webhook |

The webhook handler lives at `/api/webhooks/stripe/route.ts`.

## Brand & Design

**Full brand context lives in `docs/REBIRTH_WORLD_PRD.md`.** The brand skill at `.claude/skills/rebirth-brand/SKILL.md` auto-loads when working on copy, UI, or creative decisions. Below is the quick reference.

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary Dark | Charcoal Black | `#1a1a1a` | Text, headers, dark backgrounds |
| Primary Light | Warm White | `#f5f0e8` | Backgrounds, light sections |
| Accent 1 | Ocean Teal | `#2a9d8f` | CTAs, highlights, links |
| Accent 2 | Burnt Amber | `#e07a3a` | Skateboard wood warmth, secondary CTA |
| Accent 3 | Lotus Pink | `#d4a0a0` | Soft moments, gift guides |
| Neutral | Driftwood Gray | `#8a8578` | Body text, secondary info, borders |
| Earth Tone | Moss Green | `#5a6b4a` | Eco/sustainability callouts |

### Typography

| Role | Font | Notes |
|------|------|-------|
| Headlines | Clash Display | Bold, slightly condensed, -0.03em tracking |
| Body | DM Sans | Clean, warm, readable |
| System/Labels | DM Mono | Monospace for numbers, links, technical text |

**Do NOT use:** Inter, Roboto, Arial, or any generic system fonts.

### UI Patterns

- **Grain texture:** SVG noise overlay on backgrounds (kills AI-slop feel)
- **Smooth scroll:** Lenis with momentum (`lerp: 0.1, duration: 1.2`) on all marketing pages
- **Scroll reveals:** GSAP ScrollTrigger for new sections; Framer Motion `whileInView` for legacy
- **Text animations:** GSAP SplitText for headlines (chars/words/lines stagger)
- **Section color shifting:** 4 CSS schemes (`section-warm`, `section-dark`, `section-ocean`, `section-earth`) shift mood per section
- **Fluid typography:** `clamp()`-based mega utilities (`.text-mega`, `.text-fluid-display`, `.text-fluid-heading`)
- **Cinematic image reveals:** ScrollImage component (scale 1.15→1.0 with overflow clip)
- **Micro-interactions:** Magnetic buttons, custom cursor, 3D tilt hover, animated icon stroke-draw
- **3D viewer:** React Three Fiber ring with GLSL shader for product pages
- **Component libraries:** Aceternity UI for hero sections, Magic UI for interactive elements, shadcn/ui for core UI
- **Photography:** Natural lighting, golden hour, lifestyle > sterile product shots
- **Whitespace:** Generous — this isn't a cluttered marketplace
- **Dark mode:** Supported via next-themes

### Design Principles

1. **Handmade over polished** — imperfection is the aesthetic, not a flaw
2. **Story over specs** — lead with meaning, follow with materials
3. **Warmth over minimalism** — organic, human, not cold tech
4. **Authenticity over aspiration** — real photos, real stories, real craft
5. **Community over commerce** — broken boards donated by local skaters

### Voice & Tone

- **We sound like:** A wise, grounded skater friend who's also a master craftsman
- **Not corporate, not salesy, not try-hard**
- **Use:** "Embrace Change," "Handmade with intention," "Reborn," "One of a kind," "Crafted" (not "manufactured")
- **Avoid:** "Luxury" (say "premium" or "crafted"), "cheap," "eco-friendly" as lead, "handcrafted artisanal," corporate jargon

### Product Context (for accurate copy)

| Product | Price | Key Detail |
|---------|-------|-----------|
| Skateboard Rings | ~$25 | 7-layer recycled maple from donated boards |
| Wedding Bands | $75-200+ | Gold-plated steel shells + stabilized ancient wood liners |
| Apparel | $35-70 | Branded hoodies and tees |
| Laser Engraving | +$9 | Up to 10 chars text or custom graphic |

Interior finish is thin CA glue (NOT polyurethane). Sizing: Size 9 shell (18.8mm ID) + 0.8mm wood liner → wearable size 7.

## Animation & Interaction System

The storefront uses a dual animation architecture: **GSAP** for scroll-driven effects and **Framer Motion** for component-level transitions. These two systems coexist but must never be applied to the same DOM element.

### Architecture

```text
Marketing Layout
├── SmoothScrollProvider (Lenis)     # Wraps all marketing pages
│   ├── ScrollTriggerSync            # Syncs GSAP ScrollTrigger to Lenis scroll
│   ├── CustomCursor                 # Desktop-only branded cursor
│   ├── Header + AnnouncementBar     # Marquee ticker
│   ├── CartDrawer                   # useLenisPause(isCartOpen)
│   ├── main                         # Page content with scroll animations
│   └── Footer
└── Preloader                        # Session-based, in root layout (outside Lenis)
```

### Coexistence Rules

1. **Never apply both `<motion.div whileInView>` and GSAP ScrollTrigger to the same element** — they will fight over the same CSS properties
2. **GSAP is for new/enhanced sections** — TextReveal, ScrollImage, AnimatedIcon, parallax
3. **Framer Motion is for existing component transitions** — card hover, lightbox, cart drawer items
4. **Both respect `prefers-reduced-motion`** — all GSAP hooks check this and skip animation

### GSAP Registration

All components import GSAP from `@/lib/gsap/register` (never directly from `gsap`):

```typescript
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap/register";
```

This singleton registers plugins once at import time.

### Hooks

| Hook | File | What It Does |
|------|------|-------------|
| `useGsapReveal` | `hooks/use-gsap-reveal.ts` | ScrollTrigger fade+slide reveal with optional stagger for children |
| `useTextReveal` | `hooks/use-text-reveal.ts` | SplitText animation (chars/words/lines) on scroll |
| `useLenisPause` | `hooks/use-lenis-pause.ts` | Pause Lenis when modals/drawers are open |
| `useParallax` | `hooks/use-parallax.ts` | ScrollTrigger parallax movement (negative=lag, positive=lead) |
| `useTilt` | `hooks/use-tilt.ts` | 3D perspective tilt on hover with CSS glare (desktop only) |

### Section Color Schemes

Defined in `globals.css` as CSS classes that set `--section-bg/fg/accent/muted` variables:

| Class | Background | Text | Accent | Use Case |
|-------|-----------|------|--------|----------|
| `.section-warm` | `#f5f0e8` | `#1a1a1a` | `#2a9d8f` | Hero, newsletter |
| `.section-dark` | `#1a1a1a` | `#f5f0e8` | `#e07a3a` | Featured products |
| `.section-ocean` | `#1a3a36` | `#c8e6e3` | `#e07a3a` | Testimonials |
| `.section-earth` | `#f2ede5` | `#2a2118` | `#4a7c59` | FAQ, value props |

Each has a `.dark` mode variant. Use with Tailwind: `text-section-fg`, `bg-section-bg`, etc.

### Fluid Typography

| Class | Range | Use |
|-------|-------|-----|
| `.text-mega` | `clamp(3rem, 8vw, 8rem)` | Primary hero headlines |
| `.text-mega-sm` | `clamp(2.5rem, 6vw, 6rem)` | Secondary headlines |
| `.text-mega-lg` | `clamp(4rem, 10vw, 10rem)` | Full-bleed display |
| `.text-fluid-display` | `clamp(2rem, 5vw, 4.5rem)` | Section titles |
| `.text-fluid-heading` | `clamp(1.5rem, 3.5vw, 3rem)` | Sub-section headings |

### Per-Collection Color Theming

Products get collection-specific colors via `getCollectionStyle()` from `lib/payments/constants.ts`:

```typescript
import { getCollectionStyle } from "@/lib/payments/constants";

// Returns CSSProperties with --collection-primary and --collection-accent
<div style={getCollectionStyle("skateboard-rings")}>
```

| Collection | Primary | Accent |
|-----------|---------|--------|
| skateboard-rings | `#2a9d8f` (teal) | `#e07a3a` (amber) |
| wedding-bands | `#8b7355` (brown) | `#c76b8a` (lotus) |
| apparel | `#4a7c59` (moss) | `#e07a3a` (amber) |

### 3D Ring System

All 3D components live in `src/components/3d/` and require `ssr: false` dynamic imports:

```typescript
// WRONG — Server Component can't use ssr: false
const Ring = dynamic(() => import("./ring-viewer"), { ssr: false });

// CORRECT — use the lazy wrapper (client component)
import { ScrollRingSceneLazy } from "@/components/3d/scroll-ring-scene-lazy";
```

**Ring Model** — Procedural torus with custom GLSL shader:
- 7 color layers simulating skateboard ply (configurable via `layers` prop)
- Wood grain noise via hash function
- Specular highlight for CA glue finish
- Engraving text rendered via Drei `Text` on inner surface

**Ring Customizer** — 5 wood presets:
- Classic Maple, Ocean Fade, Sunset Deck, Dark Stealth, Moss Earth
- Each has 7 unique layer colors
- Live engraving preview (up to 10 chars)

**Scroll Ring Scene** — Homepage section:
- Ring rotates 4x as user scrolls through section
- Scale lerps 0.7→1.0, position floats on sine wave
- Progress driven by GSAP ScrollTrigger `scrub: 0.5`

### Adding New Animations

**New scroll-triggered section:**
```tsx
import { TextReveal } from "@/components/ui/text-reveal";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

<section className="section-dark px-6 py-24">
  <TextReveal as="h2" className="text-fluid-display" type="words">
    Your headline here
  </TextReveal>
  <ScrollReveal stagger={0.1}>
    <Card>...</Card>
    <Card>...</Card>
  </ScrollReveal>
</section>
```

**New cinematic image:**
```tsx
import { ScrollImage } from "@/components/ui/scroll-image";

<ScrollImage
  src="/images/hero.jpg"
  alt="Description"
  fill
  sizes="100vw"
  scaleFrom={1.15}
  radius="1rem"
/>
```

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

**Transactional** (Resend — instant delivery):

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

**Marketing** (GoHighLevel — sequences, drips, newsletters): GHL webhooks fire on newsletter signup, purchase, and abandoned cart events. See `src/lib/ghl.ts` and `docs/GHL_INTEGRATION_PLAN.md`.

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

# GoHighLevel
GHL_API_KEY=
GHL_LOCATION_ID=

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

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Tailwind for styling — no CSS modules
- ES modules, not CommonJS
- Prettier + ESLint
- Commit messages: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

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

## What NOT to Do

- Don't use Pages Router patterns (getServerSideProps, etc.)
- Don't install additional CSS frameworks (Tailwind only)
- Don't use `any` type — always type properly
- Don't hardcode prices — pull from Stripe/Supabase
- Don't use the word "luxury" in copy — say "premium" or "crafted"
- Don't use Inter, Roboto, or Arial fonts — use Clash Display, DM Sans, DM Mono
- Don't write generic/template-sounding copy — read the brand skill first
- Don't use sterile product photography aesthetic — warm, natural, lifestyle
- Don't mix Framer Motion `whileInView` and GSAP ScrollTrigger on the same DOM element
- Don't import `gsap` directly — always import from `@/lib/gsap/register`
- Don't use `next/dynamic` with `ssr: false` in Server Components — create a `"use client"` lazy wrapper
- Don't add Lenis smooth scroll to dashboard/auth layouts — only marketing pages get it
- Don't forget `prefers-reduced-motion` checks in new animation hooks

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
