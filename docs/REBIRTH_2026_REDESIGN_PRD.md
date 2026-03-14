# REBIRTH_2026_REDESIGN_PRD.md

> **Status:** Draft
> **Author:** OpenClaw
> **Created:** 2026-03-13
> **Repo:** `/Users/admin/.openclaw/workspace/rebirth-world/`
> **Live:** https://rebirth.world

---

## 1. Executive Summary

Rebirth World has a production-grade foundation: 62 pages, 70+ components, Stripe checkout, Shippo shipping, Supabase auth, 3D ring viewer, GSAP/Framer Motion animation system, and a cohesive warm-earth design system. The conversion from Sabo boilerplate is complete and operational.

This PRD defines the **2026 visual and functional redesign** — evolving the site from "working storefront" to "brand experience platform" that supports three growth vectors:

1. **Wedding band collection launch** — premium price point ($75–$200+), dedicated experience
2. **Community & content flywheel** — UGC, reviews, editorial content, social proof at scale
3. **Conversion optimization** — reducing friction in the purchase funnel, improving mobile experience, adding personalization

The redesign preserves the existing architecture and tech stack. No framework migrations. No database rewrites. This is a **design-layer evolution** on top of a solid engineering foundation.

---

## 2. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Increase conversion rate | Checkout completions / sessions | 3.5% → 5.5% |
| Launch wedding band collection | Collection pages live, first 10 orders | By end of Q2 2026 |
| Grow average order value | AOV | $35 → $65 |
| Build social proof engine | Reviews collected per month | 20+ |
| Improve mobile experience | Mobile conversion parity with desktop | Within 15% |

### Non-Goals

- Migrating off Next.js, Supabase, Stripe, or Vercel
- Building a subscription/membership model
- Multi-vendor marketplace
- Native mobile app

---

## 3. Current State Assessment

### What's Working

- **Design system** — Warm-earth palette (Film Cream, Rebirth Teal, Amber Gold), Clash Display + DM Sans typography, grain textures, section color blending. This is distinctive and on-brand.
- **Animation infrastructure** — GSAP ScrollTrigger + Framer Motion coexistence rules are established. SplitText, parallax, tilt-glare, magnetic buttons, smooth scroll (Lenis) all working.
- **3D ring viewer** — Custom GLSL shader with 7 wood-layer colors, engraving preview, scroll-driven rotation. Unique differentiator.
- **E-commerce flow** — Cart (localStorage + Supabase sync), Stripe checkout, Shippo live rates, order confirmation with confetti, admin dashboard with order management.
- **Auth** — Email/password + Google OAuth, protected dashboard routes.

### What Needs Work

| Area | Current State | Problem |
|------|--------------|---------|
| Homepage hero | Static SplitText + watermark | Doesn't tell the product story fast enough — visitors bounce before scrolling |
| Product pages | Functional but template-feeling | Missing lifestyle context, material storytelling, social proof |
| Mobile nav | Slide-out drawer | Touch targets tight, no bottom-nav pattern for thumb reach |
| Blog | 3 MDX posts | Not driving SEO or organic traffic |
| Reviews/UGC | None | No social proof beyond static testimonials |
| Wedding bands | Not launched | Premium collection needs dedicated experience, not just a catalog filter |
| Cart/checkout | Full-page cart + Stripe redirect | Cart drawer exists but could be smoother; no upsell/cross-sell |
| Search | None | No product search or filtering beyond collection tabs |
| Performance | Acceptable | 3D scene + GSAP + Lenis = heavy; needs progressive loading strategy |

---

## 4. Design Philosophy

### Guiding Principles

1. **Handmade over polished** — The site should feel crafted, not templated. Grain textures, organic shapes, warmth over sterile minimalism.
2. **Story over specs** — Every product page is a narrative: where the board came from, who rode it, how it became a ring. Features are secondary to meaning.
3. **Motion with purpose** — Animations reveal and delight, never distract. Every tween earns its weight. `prefers-reduced-motion` always respected.
4. **Warm dark mode** — No harsh black/white contrast. Maintain undertones (#1c1917, #f3ece1) across themes.
5. **Island craft meets digital craft** — North Shore soul in every pixel. Salt air, worn wood, golden hour.

### Visual Evolution (v1 → v2)

| Element | v1 (Current) | v2 (Redesign) |
|---------|-------------|----------------|
| Hero | Pinned text reveal, static scroll indicator | Video/image hero with product in context, immediate CTA |
| Product cards | Standard image + price | Lifestyle shots, hover video, collection-themed borders |
| Typography | Clash Display headlines only | Clash Display expanded to midweight body callouts |
| Spacing | Consistent but dense | More breathing room, editorial whitespace |
| Photography | Product-on-white | Product-in-life (hands, beaches, skate sessions, weddings) |
| Color usage | Section-based theming | Same palette, more gradient transitions between sections |
| Micro-interactions | Hover states, tilt | Cursor-aware reveals, scroll-velocity effects, haptic-feel transitions |

---

## 5. Architecture & Technical Approach

### Preserved (No Changes)

- Next.js 16 App Router + RSC
- Supabase PostgreSQL + RLS
- Stripe one-time payments
- Shippo shipping
- Resend + React Email
- Vercel hosting
- pnpm package manager
- GSAP + Framer Motion + Lenis animation stack
- React Three Fiber 3D system

### New Dependencies (Proposed)

| Package | Purpose | Justification |
|---------|---------|---------------|
| `@vercel/og` | Dynamic OG images | Product/collection sharing on social |
| `plaiceholder` or `sharp` | Blur-hash placeholders | Perceived performance for image-heavy pages |
| `nuqs` | URL state management | Filter/sort/search state in URL for shareability |
| `vaul` (already installed) | Bottom sheet (mobile) | Mobile-native cart and filter experience |

### Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Total JS (initial) | < 200KB gzipped |
| 3D scene | Lazy-loaded, intersection-triggered |

**Strategy:** The 3D ring scene and GSAP ScrollTrigger are heavy. Redesign introduces:
- `loading="lazy"` + Intersection Observer for below-fold sections
- Dynamic `import()` for 3D components (already partially done via `scroll-ring-scene-lazy.tsx`)
- Image `priority` only on hero; all others use blur placeholders
- Font subsetting for Clash Display (only used weights)

---

## 6. Page-by-Page Redesign Spec

### 6.1 Homepage (`/`)

**Goal:** Tell the Rebirth story in 8 seconds. Show product, show craft, show proof. Get to shop.

#### Section Redesign

| # | Section | Changes |
|---|---------|---------|
| 1 | **Hero** | Replace text-only hero with split layout: left = headline + CTA, right = hero product image or looping video (hands holding ring, skateboard being cut). Retain SplitText animation on headline. Add "Shop Rings" + "Our Story" dual CTA. Background: subtle parallax lifestyle image with grain overlay. |
| 2 | **Social Proof Bar** | **NEW.** Horizontal ticker: "1,000+ rings crafted" · "⭐ 4.9 average rating" · "Handmade in Hawaii" · customer photos. Uses existing `announcement-bar.tsx` marquee pattern. |
| 3 | **Featured Products** | Keep horizontal scroll (desktop) but upgrade cards: lifestyle thumbnails, hover-to-video, collection badge, "Starting at $XX". Mobile: 2-column grid with swipe hint. |
| 4 | **Craft Story** | Keep pinned 4-step crossfade but add real workshop photography behind each step. Add subtle parallax depth layers. Tighten copy. |
| 5 | **Collections Gateway** | **NEW.** Full-width split: left = Skateboard Rings (amber tones, skate imagery), right = Wedding Bands (warm dark, intimate imagery). Each links to filtered `/shop`. Replace generic `ValueProps` section. |
| 6 | **3D Ring Scene** | Keep scroll-driven ring. Add "Customize Yours →" CTA below that links to `/shop/customize`. |
| 7 | **Testimonials** | Upgrade from static quotes to carousel with customer photos, verified purchase badges, star ratings. Pull from reviews system (Phase 2). |
| 8 | **Instagram/UGC Feed** | **NEW.** Replace FAQ on homepage (move FAQ to `/faq`). Grid of customer photos tagged @rebirthworld. Manual curation initially, API integration later. |
| 9 | **Newsletter CTA** | Keep, but add incentive: "Get 10% off your first ring" with email capture. |

#### Hero Component Spec

```
┌─────────────────────────────────────────────────┐
│ [grain overlay]                                 │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │  EMBRACE          │  │                      │ │
│  │  CHANGE 🪷        │  │   [hero product      │ │
│  │                   │  │    image/video        │ │
│  │  Handcrafted rings│  │    with parallax]     │ │
│  │  from recycled    │  │                      │ │
│  │  skateboards.     │  │                      │ │
│  │                   │  │                      │ │
│  │  [Shop Rings]     │  │                      │ │
│  │  [Our Story →]    │  │                      │ │
│  └──────────────────┘  └──────────────────────┘ │
│                                                 │
│  ───── scroll ─────                             │
└─────────────────────────────────────────────────┘
```

**Mobile:** Stack vertically. Image first (60vh), text overlay at bottom with gradient fade.

---

### 6.2 Shop Page (`/shop`)

**Current:** Collection filter tabs + product grid.

**Redesign:**

- **Collection header** — Full-width banner per collection with lifestyle image, title, short copy. Changes dynamically when filter changes.
- **Filters** — Sidebar on desktop (sticky), bottom sheet on mobile. Filter by: collection, material, price range, ring size availability.
- **Sort** — Price (low/high), newest, popular. State in URL via `nuqs`.
- **Product cards** — Larger images, hover state shows secondary lifestyle shot (not just zoom). Price + "X colors available" + star rating.
- **Quick view** — Click card → modal with image gallery + size selector + add-to-cart. Skip full page load for impulse buys.
- **Empty state** — If filter yields no results: "No rings match — try adjusting your filters" with reset button.

---

### 6.3 Product Detail Page (`/shop/[slug]`)

**Current:** Image gallery + details + 3D toggle + add-to-cart.

**Redesign:**

| Section | Spec |
|---------|------|
| **Gallery** | Left column: 4-5 images (product, lifestyle, detail, on-hand, scale). Sticky on desktop scroll. Support video as first item. View Transition morphing from shop grid. |
| **Details** | Right column: Product name, price, star rating (linked to reviews below), size selector with guide link, engraving input (if applicable), "Add to Cart" + "Buy Now" (skip cart). |
| **Story block** | Below fold: "The Story Behind This Ring" — editorial section with the board's origin, maker notes. Uses `TextReveal` animation. |
| **Material specs** | Expandable accordion: materials, dimensions, care instructions. |
| **3D Viewer** | Inline toggle (already exists). Ensure it's lazy-loaded and doesn't affect LCP. |
| **Reviews** | Below story: customer reviews with photos, star breakdown chart, "Write a Review" CTA. |
| **Related products** | "You might also like" — 3-4 cards from same collection or complementary items. |
| **Recently viewed** | Persistent bar at bottom (localStorage-powered). |

---

### 6.4 Wedding Band Collection (`/collections/wedding-bands`)

**NEW dedicated landing page.** This is not just a filtered shop view — it's a conversion-optimized experience for the "Alternative Groom" avatar.

| Section | Spec |
|---------|------|
| **Hero** | Cinematic: close-up of hands exchanging rings, warm lighting. Headline: "Rings as unique as your story." Subdued, intimate tone — contrast with skateboard collection energy. |
| **Value prop strip** | Handcrafted · Lifetime warranty · Custom engraving · Ethically sourced |
| **Product showcase** | 2-column grid: large lifestyle image left, product details right. Alternate layout per row. |
| **Customization CTA** | "Design your band together" → links to ring customizer with wedding-specific presets (Bog Oak, Koa, Walnut). |
| **Size guide** | Inline expandable guide with printable ring sizer PDF download. |
| **Couple testimonials** | Real couples, real stories. Photo + quote + ring choice. |
| **FAQ** | Wedding-specific: turnaround time, resizing policy, engraving options, bulk/wedding party pricing. |
| **Consultation CTA** | "Book a free consultation" → contact form or Calendly embed. |

**Design notes:** Section color scheme should use `.section-dark` and `.section-ocean` predominantly. Amber Gold accent only for CTAs. Overall tone: intimate, premium, trustworthy.

---

### 6.5 Ring Customizer (`/shop/customize`)

**Current:** Exists as a component (`ring-customizer.tsx`) with 5 wood presets.

**Redesign — Elevate to full page:**

| Feature | Spec |
|---------|------|
| **Layout** | Split: left = 3D live preview (full height, interactive), right = configuration panel |
| **Wood selection** | Visual swatches (real wood photos, not color dots). 7+ options: Maple, Walnut, Koa, Bog Oak, Zebrawood, Purple Heart, Olive. |
| **Band width** | Slider: 4mm / 6mm / 8mm with live 3D update |
| **Engraving** | Text input with live preview on ring interior. Character limit, font preview. |
| **Finish** | Matte / Satin / High Polish (visual toggle) |
| **Price calculator** | Live price updates as options change. "Starting at $XX" → exact price. |
| **Add to cart** | Captures all selections as variant metadata. |
| **Share** | "Share your design" → generates URL with config in query params. |

---

### 6.6 Our Story (`/our-story`)

**Current:** Basic brand narrative page.

**Redesign — Editorial longform:**

| Section | Spec |
|---------|------|
| **Opening** | Full-bleed image: Daniel in workshop. No headline — let the image breathe. |
| **Origin** | Scroll-driven narrative: Salzburg jeweler lineage → skateboarding → North Shore → the idea. Parallax images between text blocks. |
| **Process** | Interactive: 4 steps with scroll-triggered reveals. Real workshop photos, not illustrations. |
| **Materials** | Grid of materials with macro photography. Hover for sourcing story. |
| **Impact** | Numbers: boards recycled, rings crafted, trees planted (if applicable). `NumberTicker` from Magic UI. |
| **Team** | Daniel's profile + any collaborators. Authentic, not corporate headshots. |

---

### 6.7 Blog (`/blog`)

**Current:** 3 MDX posts. Basic layout.

**Redesign:**

- **Index page** — Magazine-style layout: featured post (large), recent posts (3-column grid), category filter.
- **Post layout** — Wider content column (max 720px), larger images, pull quotes, author byline with avatar.
- **Categories** — Jewelry Care, Skateboard Culture, Sustainability, Wedding, Behind the Scenes.
- **SEO** — Each post gets proper meta, OG image (generated via `@vercel/og`), JSON-LD BlogPosting schema.
- **Related posts** — 3 related posts at bottom based on category.
- **Newsletter CTA** — Inline after 50% scroll.
- **Content target** — 2 posts/month minimum. Mix of SEO-targeted and brand storytelling.

---

### 6.8 Cart & Checkout

**Current:** Full-page cart + Stripe hosted checkout.

**Redesign:**

| Feature | Spec |
|---------|------|
| **Cart drawer** | Primary interaction. Already exists (`cart-drawer.tsx`). Enhance with: product thumbnails, quantity +/- controls, remove button, subtotal, "Continue to Checkout" CTA. |
| **Upsell** | "Complete the look" — suggest complementary items in drawer (e.g., care kit with ring purchase). |
| **Free shipping threshold** | Progress bar: "Add $XX more for free shipping" (if applicable). |
| **Express checkout** | Apple Pay / Google Pay buttons above standard checkout (Stripe Payment Request Button). |
| **Guest checkout** | Keep supporting. Don't gate behind auth. |
| **Order confirmation** | Keep confetti animation. Add "Share your purchase" social buttons. Add estimated delivery date from Shippo. |

---

### 6.9 Mobile Experience

**Principles:**
- Thumb-zone navigation: primary actions within bottom 40% of screen
- Bottom nav bar (Shop, Search, Cart, Account) — replaces hamburger as primary nav
- Swipe gestures: product image gallery swipe, filter bottom sheet
- Touch targets: minimum 44×44px
- No horizontal scroll on mobile (except intentional carousels with swipe indicators)

**Bottom Nav Spec:**

```
┌─────────────────────────────────────┐
│  🏠 Home  │  🔍 Search  │  🛒 Cart(2)  │  👤 Account  │
└─────────────────────────────────────┘
```

Appears on scroll-up, hides on scroll-down. Cart badge shows item count.

---

### 6.10 Admin Dashboard (`/dashboard`)

**Current:** Functional but basic. Orders table, analytics cards, settings.

**Redesign (Lower Priority):**

- **KPI cards** — Real-time: today's revenue, orders, conversion rate, avg order value
- **Order management** — Status workflow: Pending → Crafting → Shipped → Delivered. Inline tracking number entry. One-click Shippo label purchase.
- **Product management** — Sync from Stripe, but allow toggling featured/hidden, reordering, adding lifestyle images
- **Customer list** — Repeat buyers, lifetime value, last order date
- **Reviews moderation** — Approve/reject/respond to reviews
- **Analytics** — Revenue chart (Recharts, already exists), traffic sources, top products, conversion funnel

---

## 7. New Systems

### 7.1 Reviews & Ratings

**Database additions:**

```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID REFERENCES order_items(id),
  user_id UUID REFERENCES auth.users(id),
  product_stripe_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  photos TEXT[], -- array of image URLs
  verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: users can create for their own orders, read approved reviews
-- Admin: can read all, update status, add response
```

**Collection flow:**
1. Order delivered → wait 7 days → send review request email (Resend)
2. Email links to `/review?order={id}&item={id}` with pre-filled product
3. Customer submits rating + optional title/body/photos
4. Review goes to `pending` → admin approves in dashboard
5. Approved reviews appear on product pages and testimonials

**Display:**
- Star rating on product cards (shop grid)
- Full reviews section on product detail page
- Aggregate rating in JSON-LD schema (Product → AggregateRating)

### 7.2 Product Search

**Approach:** Client-side search over Stripe product catalog (already fetched).

- Search input in header (desktop) and search page (mobile bottom nav)
- Fuzzy matching on product name, description, collection, material
- Results: product cards with highlighting
- No external search service needed at current catalog size (<100 products)

### 7.3 Wishlist / Save for Later

**Storage:** localStorage for guests, Supabase table for logged-in users.

```sql
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_price_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stripe_price_id)
);
```

- Heart icon on product cards and detail pages
- Wishlist page accessible from account menu
- "Your saved items" email reminder after 7 days (if items still in wishlist, no purchase)

### 7.4 Dynamic OG Images

**Implementation:** `@vercel/og` (Satori) for edge-generated images.

- **Product pages** — Product image + name + price on branded background
- **Blog posts** — Title + category + reading time on branded background
- **Collection pages** — Collection hero image + title
- **Base template** — Rebirth World logo, grain texture, warm color scheme

Route: `src/app/api/og/route.tsx`

---

## 8. SEO & Content Strategy

### Technical SEO

| Item | Status | Action |
|------|--------|--------|
| XML Sitemap | Missing | Generate via `next-sitemap` or custom route handler |
| Robots.txt | Default | Add with sitemap reference, block /dashboard, /api |
| JSON-LD Schema | Partial | Add: Product, AggregateRating, Organization, BreadcrumbList, BlogPosting, FAQPage |
| Meta tags | Basic | Audit all pages: title (50-60 chars), description (150-160 chars), canonical URLs |
| OG/Twitter cards | Missing on most | Add via `@vercel/og` dynamic images |
| Image alt text | Inconsistent | Audit all product/lifestyle images |
| Core Web Vitals | Unmeasured | Set up Vercel Speed Insights, establish baselines |

### Content Pillars

1. **Skateboard Culture** — Board history, skate spot guides, rider profiles → drives organic traffic from skate community
2. **Sustainable Jewelry** — Recycling process, material sourcing, eco impact → captures "ethical jewelry" searches
3. **Wedding & Commitment** — Alternative wedding ring guides, proposal stories, couple features → high-intent keywords
4. **Craft & Making** — Workshop behind-the-scenes, tool tours, technique breakdowns → builds E-E-A-T authority
5. **Style & Care** — Ring styling guides, care instructions, sizing help → captures mid-funnel searches

**Target:** 2 posts/month → 24 posts in Year 1. Mix of SEO-targeted (long-tail keywords) and brand storytelling (shareable, linkable).

---

## 9. Email & CRM Enhancements

### Automated Sequences (via Resend + GoHighLevel)

| Trigger | Sequence | Emails |
|---------|----------|--------|
| Newsletter signup | Welcome series | Welcome (immediate) → Brand story (Day 2) → 10% off code (Day 5) |
| Browse abandonment | Retargeting | "Still thinking about [product]?" (24h) → "Your ring is waiting" (72h) |
| Cart abandonment | Recovery | Cart reminder (1h) → "Almost yours" (24h) → Last chance + urgency (48h) |
| Post-purchase | Nurture | Order confirmation (immediate) → Shipping update → Care guide (Day 3 post-delivery) → Review request (Day 7) → "How's your ring?" (Day 30) |
| Review submitted | Thank you | Thank you + 15% off next purchase |
| Wishlist dormant | Re-engagement | "Items you saved are still available" (7 days) → "Low stock alert" (14 days, if applicable) |

### GoHighLevel Sync

- Purchase events already firing via webhook
- Add: review submitted, wishlist created, email engagement events
- Build customer segments: repeat buyers, high-AOV, wedding collection browsers

---

## 10. Implementation Phases

### Phase 1: Foundation (Weeks 1–3)

**Goal:** Core visual refresh + performance baseline.

| Task | Files | Priority |
|------|-------|----------|
| Homepage hero redesign | `src/components/marketing/brand-hero.tsx` | P0 |
| Social proof ticker | `src/components/marketing/social-proof-bar.tsx` (new) | P0 |
| Product card upgrade | `src/components/shop/product-card.tsx` | P0 |
| Mobile bottom nav | `src/components/shared/bottom-nav.tsx` (new) | P0 |
| Image blur placeholders | All image-heavy components | P1 |
| Performance audit + LCP fix | 3D lazy loading, font subsetting | P1 |
| XML sitemap + robots.txt | `src/app/sitemap.ts`, `src/app/robots.ts` | P1 |
| JSON-LD schema (Product, Org) | `src/components/seo/` (new dir) | P1 |
| Collections gateway section | `src/components/marketing/collections-gateway.tsx` (new) | P1 |

**Deliverable:** Refreshed homepage, improved mobile nav, performance baselines established.

### Phase 2: Product Experience (Weeks 4–6)

**Goal:** Enhanced product pages + wedding band collection launch.

| Task | Files | Priority |
|------|-------|----------|
| Product detail page redesign | `src/app/(marketing)/shop/[slug]/page.tsx` | P0 |
| Wedding band landing page | `src/app/(marketing)/collections/wedding-bands/page.tsx` (new) | P0 |
| Ring customizer full page | `src/app/(marketing)/shop/customize/page.tsx` (new) | P0 |
| Quick view modal | `src/components/shop/quick-view.tsx` (new) | P1 |
| Shop filters + URL state | `src/app/(marketing)/shop/page.tsx`, add `nuqs` | P1 |
| Related products component | `src/components/shop/related-products.tsx` (new) | P1 |
| Recently viewed (localStorage) | `src/components/shop/recently-viewed.tsx` (new) | P2 |
| Size guide page/modal | `src/app/(marketing)/size-guide/page.tsx` or modal | P1 |

**Deliverable:** Wedding band collection live, product pages tell stories, customizer is a standalone experience.

### Phase 3: Social Proof & Content (Weeks 7–9)

**Goal:** Reviews system, blog upgrade, UGC integration.

| Task | Files | Priority |
|------|-------|----------|
| Reviews database + API | `supabase/migrations/`, `src/app/api/reviews/` | P0 |
| Review display component | `src/components/shop/reviews.tsx` (new) | P0 |
| Review submission page | `src/app/(marketing)/review/page.tsx` (new) | P0 |
| Review request email | `src/components/email/review-request.tsx` (new) | P0 |
| Blog index redesign | `src/app/blog/page.tsx` | P1 |
| Blog post layout upgrade | `src/app/blog/[slug]/page.tsx` | P1 |
| Dynamic OG images | `src/app/api/og/route.tsx` (new) | P1 |
| UGC/Instagram section | `src/components/marketing/ugc-feed.tsx` (new) | P2 |
| FAQ standalone page | `src/app/(marketing)/faq/page.tsx` (new) | P2 |

**Deliverable:** Reviews collecting, blog looks editorial, social proof is real and visible.

### Phase 4: Conversion & Polish (Weeks 10–12)

**Goal:** Cart optimization, email sequences, final polish.

| Task | Files | Priority |
|------|-------|----------|
| Cart drawer enhancements | `src/components/cart/cart-drawer.tsx` | P0 |
| Upsell/cross-sell in cart | `src/components/cart/cart-upsell.tsx` (new) | P1 |
| Express checkout (Apple/Google Pay) | Stripe Payment Request Button integration | P1 |
| Wishlist system | DB migration + `src/components/shop/wishlist-button.tsx` | P1 |
| Email sequences (welcome, abandon, post-purchase) | Resend + GHL automation | P1 |
| Our Story page redesign | `src/app/(marketing)/our-story/page.tsx` | P2 |
| Admin dashboard polish | `src/components/dashboard/` | P2 |
| Product search | `src/components/shared/search.tsx` (new) | P2 |
| Accessibility audit | All interactive components | P1 |
| E2E test coverage | `tests/` — checkout flow, cart, auth, reviews | P1 |

**Deliverable:** Optimized funnel, automated email nurturing, polished experience end-to-end.

---

## 11. Component Inventory: New vs Modified

### New Components

| Component | Location | Phase |
|-----------|----------|-------|
| `social-proof-bar.tsx` | `src/components/marketing/` | 1 |
| `collections-gateway.tsx` | `src/components/marketing/` | 1 |
| `bottom-nav.tsx` | `src/components/shared/` | 1 |
| `quick-view.tsx` | `src/components/shop/` | 2 |
| `related-products.tsx` | `src/components/shop/` | 2 |
| `recently-viewed.tsx` | `src/components/shop/` | 2 |
| `reviews.tsx` | `src/components/shop/` | 3 |
| `review-form.tsx` | `src/components/shop/` | 3 |
| `ugc-feed.tsx` | `src/components/marketing/` | 3 |
| `cart-upsell.tsx` | `src/components/cart/` | 4 |
| `wishlist-button.tsx` | `src/components/shop/` | 4 |
| `search.tsx` | `src/components/shared/` | 4 |
| `json-ld.tsx` | `src/components/seo/` | 1 |
| `review-request.tsx` | `src/components/email/` | 3 |

### Modified Components

| Component | Changes | Phase |
|-----------|---------|-------|
| `brand-hero.tsx` | Split layout, video support, dual CTA | 1 |
| `product-card.tsx` | Lifestyle images, hover video, rating badge | 1 |
| `featured-products.tsx` | Updated card integration, mobile grid | 1 |
| `header.tsx` | Search input (desktop), simplified mobile | 1 |
| `cart-drawer.tsx` | Thumbnails, quantity controls, upsell slot | 4 |
| `testimonials.tsx` | Carousel, customer photos, verified badges | 3 |
| `faq.tsx` | Move to standalone page, add wedding FAQ | 3 |
| `value-props.tsx` | Replace with collections-gateway on homepage | 1 |

### New Pages

| Route | Purpose | Phase |
|-------|---------|-------|
| `/collections/wedding-bands` | Wedding band landing page | 2 |
| `/shop/customize` | Full-page ring customizer | 2 |
| `/review` | Review submission form | 3 |
| `/faq` | Standalone FAQ page | 3 |
| `/size-guide` | Ring sizing guide | 2 |

---

## 12. Database Migrations

### Phase 2 Migration

```sql
-- Wishlist table
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_price_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stripe_price_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlists" ON wishlists
  FOR ALL USING (auth.uid() = user_id);
```

### Phase 3 Migration

```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID REFERENCES order_items(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_stripe_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  photos TEXT[] DEFAULT '{}',
  verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- Users can create reviews for their own orders
CREATE POLICY "Users create own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending reviews
CREATE POLICY "Users update own pending reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Index for product page queries
CREATE INDEX idx_reviews_product ON reviews(product_stripe_id, status);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```

---

## 13. Design Tokens (Additions)

No changes to the existing color palette. Additions only:

```css
/* New spacing utilities */
.section-breathe { padding-block: clamp(5rem, 12vw, 10rem); }
.section-tight   { padding-block: clamp(3rem, 6vw, 5rem); }

/* New text utilities */
.text-editorial {
  font-size: clamp(1.125rem, 1.5vw, 1.375rem);
  line-height: 1.7;
  letter-spacing: -0.01em;
}

/* Bottom nav z-index */
.z-bottom-nav { z-index: 40; }

/* Collection-specific gradients */
.gradient-skateboard {
  background: linear-gradient(135deg, #cc7e3a 0%, #876f4c 100%);
}
.gradient-wedding {
  background: linear-gradient(135deg, #1a3832 0%, #2d8a7e 100%);
}
```

---

## 14. Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| E2E | Playwright | Checkout flow, cart operations, auth, review submission |
| Component | Vitest + Testing Library | Reviews, search, wishlist, bottom nav |
| Visual | Playwright screenshots | Homepage, product page, wedding landing — desktop + mobile |
| Performance | Vercel Speed Insights + Lighthouse CI | Core Web Vitals on every deploy |
| Accessibility | axe-core + manual | WCAG 2.1 AA on all interactive elements |

### Critical E2E Paths

1. Homepage → Shop → Product → Add to Cart → Checkout → Confirmation
2. Homepage → Wedding Bands → Customize → Add to Cart → Checkout
3. Review request email → Submit review → Review appears on product page
4. Mobile: Bottom nav → Search → Product → Quick view → Add to Cart
5. Guest checkout (no auth required)

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 3D scene performance on low-end mobile | Users bounce | Intersection Observer lazy load; fallback to static image on devices with <4GB RAM or no WebGL |
| Wedding band imagery not ready | Collection launch delayed | Use ring customizer 3D renders as placeholder; commission lifestyle photos in parallel |
| Review spam | Fake reviews damage trust | Require verified purchase; manual moderation queue; rate limiting |
| Scope creep | Timeline slips | Strict P0/P1/P2 prioritization; P2 items can slip without blocking launch |
| GSAP license | GSAP requires license for commercial use | Verify current license status; Club GreenSock if needed |

---

## 16. Launch Checklist

- [ ] All P0 items from Phases 1–4 complete
- [ ] Stripe switched from test to live mode
- [ ] All product images are lifestyle shots (not placeholder)
- [ ] Email sequences tested end-to-end
- [ ] Mobile experience tested on iPhone SE, iPhone 15, Pixel 7
- [ ] Core Web Vitals passing (LCP < 2.5s, CLS < 0.1)
- [ ] JSON-LD validates via Google Rich Results Test
- [ ] XML sitemap submitted to Google Search Console
- [ ] OG images rendering correctly on Twitter, Facebook, iMessage
- [ ] Accessibility audit passing (axe-core, 0 critical issues)
- [ ] E2E tests green on CI
- [ ] 404 page styled and helpful
- [ ] Analytics (PostHog or Vercel Analytics) confirmed tracking
- [ ] DNS + SSL verified
- [ ] Backup/rollback plan documented

---

## Appendix A: File Tree (Post-Redesign)

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                          # Homepage (redesigned)
│   │   ├── shop/
│   │   │   ├── page.tsx                      # Shop (enhanced filters)
│   │   │   ├── [slug]/page.tsx               # Product detail (redesigned)
│   │   │   └── customize/page.tsx            # Ring customizer (NEW)
│   │   ├── collections/
│   │   │   └── wedding-bands/page.tsx        # Wedding collection (NEW)
│   │   ├── our-story/page.tsx                # Our Story (redesigned)
│   │   ├── faq/page.tsx                      # FAQ (NEW standalone)
│   │   ├── size-guide/page.tsx               # Size guide (NEW)
│   │   ├── review/page.tsx                   # Review submission (NEW)
│   │   └── contact/page.tsx                  # Contact
│   ├── blog/
│   │   ├── page.tsx                          # Blog index (redesigned)
│   │   └── [slug]/page.tsx                   # Blog post (redesigned)
│   ├── api/
│   │   ├── og/route.tsx                      # Dynamic OG images (NEW)
│   │   ├── reviews/route.ts                  # Reviews CRUD (NEW)
│   │   └── ... (existing)
│   ├── sitemap.ts                            # XML sitemap (NEW)
│   └── robots.ts                             # Robots.txt (NEW)
├── components/
│   ├── marketing/
│   │   ├── social-proof-bar.tsx              # NEW
│   │   ├── collections-gateway.tsx           # NEW
│   │   ├── ugc-feed.tsx                      # NEW
│   │   └── ... (existing, modified)
│   ├── shop/
│   │   ├── quick-view.tsx                    # NEW
│   │   ├── related-products.tsx              # NEW
│   │   ├── recently-viewed.tsx               # NEW
│   │   ├── reviews.tsx                       # NEW
│   │   ├── review-form.tsx                   # NEW
│   │   ├── wishlist-button.tsx               # NEW
│   │   └── ... (existing, modified)
│   ├── cart/
│   │   ├── cart-upsell.tsx                   # NEW
│   │   └── ... (existing, modified)
│   ├── shared/
│   │   ├── bottom-nav.tsx                    # NEW
│   │   ├── search.tsx                        # NEW
│   │   └── ... (existing, modified)
│   ├── seo/
│   │   └── json-ld.tsx                       # NEW
│   └── email/
│       ├── review-request.tsx                # NEW
│       └── ... (existing)
```

---

## Appendix B: Reference Documents

| Document | Path | Relevance |
|----------|------|-----------|
| Brand & Business PRD | `docs/REBIRTH_WORLD_PRD.md` | Origin story, avatars, voice, competitive landscape |
| Conversion Blueprint | `SABO_TO_REBIRTH_BLUEPRINT.md` | File dispositions, architecture decisions |
| Dev Guide | `CLAUDE.md` | Tech stack, component docs, animation rules, deployment |
| Implementation Report | `docs/IMPLEMENTATION-REPORT.md` | What was built in Phases 1-3 |
| GHL Integration | `docs/GHL_INTEGRATION_PLAN.md` | CRM webhook architecture |
| Market Research | `docs/research/` | Avatar language, pricing, awareness levels |
