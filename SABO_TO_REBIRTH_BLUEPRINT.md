# 🔧 SABO → REBIRTH WORLD: Conversion Blueprint

> **Document Type:** Technical Conversion Blueprint  
> **Purpose:** File-by-file instruction set for converting Sabo SaaS boilerplate into Rebirth World e-commerce platform  
> **For:** Claude Code execution & Daniel Malzl reference  
> **Version:** 1.0  
> **Date:** February 20, 2026  
> **Status:** Ready for Execution

---

## EXECUTIVE SUMMARY

**What we're doing:** Converting the Sabo SaaS boilerplate (Next.js 16 + Supabase + Stripe subscriptions) into Rebirth World's e-commerce storefront (Next.js 16 + Supabase + Stripe one-time purchases).

**Why this approach works:** Sabo already provides ~70% of the infrastructure we need — auth, email, blog, analytics, UI components, dark mode, SEO, testing. We're swapping the revenue model (subscriptions → product purchases) and reshaping the frontend from SaaS marketing to e-commerce storefront.

**Total cost:** $0/month (Stripe transaction fees only: 2.9% + 30¢)

**Estimated scope:** ~30% new code, ~40% modified code, ~30% untouched carry-over

---

## TABLE OF CONTENTS

1. [Codebase Audit Summary](#1-codebase-audit-summary)
2. [File Disposition Map](#2-file-disposition-map)
3. [Database Schema Changes](#3-database-schema-changes)
4. [Stripe Integration Conversion](#4-stripe-integration-conversion)
5. [New Files to Create](#5-new-files-to-create)
6. [Route Architecture](#6-route-architecture)
7. [Component Conversion Details](#7-component-conversion-details)
8. [Environment Variables](#8-environment-variables)
9. [Build Phases & Execution Order](#9-build-phases--execution-order)
10. [Brand Theming Checklist](#10-brand-theming-checklist)

---

## 1. CODEBASE AUDIT SUMMARY

### What Sabo Ships With (Confirmed via Full Audit)

| Layer | What's There | Files |
|-------|-------------|-------|
| **Auth** | Email/password, OAuth (Google/GitHub/Apple), magic links, password reset, protected routes, session middleware | `src/app/(auth)/*`, `src/components/auth/*`, `src/lib/supabase/*` |
| **Stripe (Subscriptions)** | Checkout sessions, webhook handler, customer portal, plans config, billing settings page | `src/app/api/checkout_sessions/`, `src/app/api/webhooks/stripe/`, `src/app/api/customer_portal/`, `src/lib/payments/*` |
| **Dashboard** | Sidebar layout, interactive charts (Recharts), data table, section cards, team switcher, nav, user menu, settings (general/account/billing/notifications) | `src/app/(dashboard)/*`, `src/components/dashboard/*` |
| **Marketing** | Hero, social proof, bento grid features, accordion features, grid features, pricing cards, testimonials, FAQ, CTA, contact form | `src/app/(marketing)/*`, `src/components/marketing/*` |
| **Blog** | MDX-based, syntax highlighting, frontmatter, SEO metadata | `src/app/blog/*`, `src/content/blog/*`, `src/lib/posts.ts` |
| **Changelog** | MDX-based changelog system | `src/app/changelog/*`, `src/content/changelog/*`, `src/lib/changelog.ts` |
| **Legal** | Privacy, Terms, Cookie Policy (all MDX) | `src/app/(legal)/*`, `src/content/legal/*` |
| **Email** | Resend integration, welcome + confirm-signup templates, type-safe send function | `src/components/email/*`, `src/lib/emails.ts`, `src/app/api/send/` |
| **Analytics** | PostHog (commented out but ready), Vercel Analytics active | `src/lib/posthog/*`, `src/components/posthog-provider.tsx` |
| **UI Components (57)** | Full shadcn/ui library + Magic UI (border-beam, shine-border, particles, marquee, animated-beam, animated-list, animated-shiny-text, bento-grid, number-ticker, orbiting-circles, interactive-grid-pattern, confetti) | `src/components/ui/*` |
| **SEO** | Dynamic sitemap, robots.txt, Open Graph, structured data (JSON-LD), schema-dts | `src/app/sitemap.ts`, `src/app/robots.ts` |
| **Infrastructure** | Next.js 16, React 19, Tailwind CSS 4, TypeScript 5, pnpm, Playwright E2E tests, dark mode (next-themes) | `package.json`, `tsconfig.json`, `playwright.config.ts` |

### Key Dependencies (from package.json)

| Package | Version | Role | Keep? |
|---------|---------|------|-------|
| next | 16.0.10 | Framework | ✅ |
| react / react-dom | 19.2.0 | UI | ✅ |
| stripe | 19.3.1 | Payments | ✅ (rewire) |
| @supabase/ssr + supabase-js | 0.7.0 / 2.81.1 | Auth + DB | ✅ |
| resend | 6.5.0 | Email | ✅ |
| motion | 12.23.24 | Animations | ✅ |
| recharts | 2.15.4 | Charts | ✅ |
| tailwindcss | 4.1.17 | Styling | ✅ |
| lucide-react | 0.553.0 | Icons | ✅ |
| zod | 4.1.12 | Validation | ✅ |
| react-hook-form | 7.66.0 | Forms | ✅ |
| posthog-js / posthog-node | latest | Analytics | ✅ |
| next-mdx-remote-client | 2.1.7 | Blog | ✅ |
| next-themes | 0.4.6 | Dark mode | ✅ |
| schema-dts | 1.1.5 | Structured data | ✅ |
| @tanstack/react-table | 8.21.3 | Data tables | ✅ |
| sonner | 2.0.7 | Toast notifications | ✅ |
| canvas-confetti | 1.9.4 | Success animation | ✅ |

**Verdict:** Every dependency carries over. No removals needed.

---

## 2. FILE DISPOSITION MAP

Legend:
- 🟢 **KEEP** — No changes needed
- 🟡 **MODIFY** — Partial changes required (details in Section 7)
- 🔴 **REPLACE** — Gut and rebuild with new logic
- 🆕 **NEW** — File doesn't exist yet, must be created
- ⚫ **DELETE** — Remove entirely

### Root Files

| File | Disposition | Notes |
|------|------------|-------|
| `package.json` | 🟡 MODIFY | Rename to "rebirth-world", add new deps if needed (e.g., `zustand` for cart state) |
| `next.config.ts` | 🟡 MODIFY | Add Stripe image domain, Supabase storage domain for product images |
| `tsconfig.json` | 🟢 KEEP | |
| `postcss.config.mjs` | 🟢 KEEP | |
| `eslint.config.mjs` | 🟢 KEEP | |
| `components.json` | 🟢 KEEP | |
| `playwright.config.ts` | 🟡 MODIFY | Update base URLs and test paths |
| `CLAUDE.md` | 🔴 REPLACE | New Claude Code instructions for Rebirth World |
| `AGENTS.md` | 🔴 REPLACE | New agent instructions |
| `README.md` | 🔴 REPLACE | Rebirth World README |

### `/src/app/` — Routes & Pages

| File | Disposition | Notes |
|------|------------|-------|
| `layout.tsx` | 🟡 MODIFY | Change metadata (Acme → Rebirth World), update JSON-LD, fonts (Geist → brand fonts), colors |
| `globals.css` | 🟡 MODIFY | Rebirth color palette (Section 5 of PRD), custom CSS variables |
| `favicon.ico` | 🔴 REPLACE | Rebirth World favicon |
| `not-found.tsx` | 🟡 MODIFY | Rebrand copy |
| `robots.ts` | 🟡 MODIFY | Update siteName URL |
| `sitemap.ts` | 🟡 MODIFY | Add product pages, collection pages to sitemap |
| `success/page.tsx` | 🟡 MODIFY | Change "Subscription successful" → "Order confirmed!", add order details, link to order tracking instead of dashboard |

### `/src/app/(auth)/` — Authentication

| File | Disposition | Notes |
|------|------------|-------|
| `actions.ts` | 🟡 MODIFY | Change redirect from `/dashboard` to `/account` (customer account, not admin dashboard) |
| `sign-in/*` | 🟡 MODIFY | Rebrand UI copy, update redirect logic |
| `sign-up/*` | 🟡 MODIFY | Rebrand UI copy |
| `forgot-password/*` | 🟡 MODIFY | Rebrand UI copy |
| `reset-password/*` | 🟡 MODIFY | Rebrand UI copy |

### `/src/app/(marketing)/` — Storefront (was SaaS marketing)

| File | Disposition | Notes |
|------|------------|-------|
| `layout.tsx` | 🟡 MODIFY | Same structure, but header/footer will be rebranded |
| `page.tsx` | 🔴 REPLACE | **Homepage becomes storefront landing page.** Hero with brand story, featured products, collections, testimonials, newsletter signup. Components: Hero → BrandHero, SocialProof → CustomerReviews, FeaturesBentoGrid → FeaturedCollections, Pricing → FeaturedProducts, Testimonials → keep/rebrand, FAQ → keep/rebrand, CTA → NewsletterCTA |
| `pricing/page.tsx` | 🔴 REPLACE | **Becomes `/shop` page** — Product grid with filters, collection browsing, powered by Stripe Products API |
| `contact/page.tsx` | 🟡 MODIFY | Rebrand copy, change company field to optional message |

### `/src/app/(dashboard)/` — Split into Admin + Customer Account

| File | Disposition | Notes |
|------|------------|-------|
| `dashboard/layout.tsx` | 🟡 MODIFY | **Becomes admin dashboard layout** — only accessible by Daniel (admin check). Sidebar nav changes to: Orders, Products, Coupons, Analytics, Settings |
| `dashboard/page.tsx` + `page-client.tsx` | 🔴 REPLACE | **Admin overview** — Revenue chart (Recharts), recent orders, inventory alerts, today's stats |
| `dashboard/data.json` | 🔴 REPLACE | Real order/revenue data from Supabase |
| `dashboard/settings/general/*` | 🟡 MODIFY | Store settings (name, URL, shipping info) |
| `dashboard/settings/account/*` | 🟡 MODIFY | Admin account settings |
| `dashboard/settings/billing/*` | 🔴 REPLACE | **Becomes Stripe Connect / payout settings** — or remove if not needed |
| `dashboard/settings/notifications/*` | 🟡 MODIFY | Order notification preferences |

### `/src/app/api/` — API Routes

| File | Disposition | Notes |
|------|------------|-------|
| `checkout_sessions/route.ts` | 🔴 REPLACE | **Convert from subscription checkout to product checkout.** `mode: "subscription"` → `mode: "payment"`, add `line_items` from cart, add shipping address collection, remove `subscription_data` |
| `webhooks/stripe/route.ts` | 🔴 REPLACE | **New webhook events.** Remove: `customer.subscription.*`, `invoice.*`. Add: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`. Insert into `orders` table instead of `user_subscriptions` |
| `customer_portal/route.ts` | ⚫ DELETE | No subscriptions = no customer portal (keep Stripe Dashboard for Daniel) |
| `contact/route.ts` | 🟡 MODIFY | Rebrand, add to Resend list |
| `send/route.ts` | 🟡 MODIFY | Update email sender name/domain |

### `/src/app/blog/` — Blog

| File | Disposition | Notes |
|------|------------|-------|
| All files | 🟡 MODIFY | Rebrand layout chrome. Blog system stays intact — will power content marketing (craft stories, ring care guides, sustainability content) |

### `/src/app/changelog/` — Changelog

| File | Disposition | Notes |
|------|------------|-------|
| All files | ⚫ DELETE | SaaS concept, not relevant for e-commerce. Could repurpose as "New Arrivals" feed later but not MVP |

### `/src/app/(legal)/` — Legal Pages

| File | Disposition | Notes |
|------|------------|-------|
| All files | 🟡 MODIFY | Update company name, add e-commerce-specific terms (shipping, returns, warranty policy) |

### `/src/app/auth/callback/` — OAuth Callback

| File | Disposition | Notes |
|------|------------|-------|
| `route.ts` | 🟢 KEEP | Works as-is |

---

### `/src/components/` — Components

#### `/src/components/ui/` — UI Library (57 components)

| Status | Action |
|--------|--------|
| ALL 57 COMPONENTS | 🟢 KEEP — entire shadcn/ui + Magic UI library carries over untouched |

#### `/src/components/shared/`

| File | Disposition | Notes |
|------|------------|-------|
| `header.tsx` | 🔴 REPLACE | **E-commerce header:** Logo, nav (Shop, Collections, Our Story, Blog), cart icon with count badge, account link, search (future). Remove: Features/Resources mega menus |
| `footer.tsx` | 🔴 REPLACE | **E-commerce footer:** Brand story snippet, shop links, customer service links, social links, newsletter signup, legal links. Rebirth aesthetic |
| `mobile-nav.tsx` | 🟡 MODIFY | Match new header nav structure |
| `logo.tsx` | 🔴 REPLACE | Rebirth World logo/wordmark |
| `theme-toggle.tsx` | 🟢 KEEP | |
| `mode-toggle.tsx` | 🟢 KEEP | |
| `built-with-sabo.tsx` | ⚫ DELETE | |
| `status-badge.tsx` | 🟢 KEEP | |
| `language-selector.tsx` | 🟢 KEEP | (future i18n) |

#### `/src/components/marketing/`

| File | Disposition | Notes |
|------|------------|-------|
| `hero.tsx` | 🔴 REPLACE | **BrandHero** — Daniel's story, hero image, CTA to shop. Animated with Magic UI |
| `social-proof.tsx` | 🟡 MODIFY | Brand logos → customer count, review score, "1000+ happy customers" |
| `features-bento-grid.tsx` | 🔴 REPLACE | **FeaturedCollections** — Bento grid of product collections (Skateboard Rings, Wedding Bands, Apparel) with lifestyle images |
| `features-grid.tsx` | 🔴 REPLACE | **ValueProps** — Handmade, Recycled, Community-Sourced, 1-Year Warranty |
| `features-accordion.tsx` | 🔴 REPLACE | **CraftProcess** — How the rings are made, step-by-step with images |
| `pricing.tsx` | 🔴 REPLACE | **FeaturedProducts** — Product card grid, fetches from Stripe Products API, add-to-cart buttons |
| `testimonials.tsx` | 🟡 MODIFY | Rebrand with real customer reviews/UGC |
| `faq.tsx` | 🟡 MODIFY | E-commerce FAQs: sizing, shipping, care, returns, customization |
| `cta.tsx` | 🔴 REPLACE | **NewsletterCTA** — Email capture with lead magnet ("The Story Behind Your Ring" lookbook) |
| `contact-form.tsx` | 🟡 MODIFY | Remove company field, add subject dropdown (General, Custom Order, Wholesale, Press) |

#### `/src/components/dashboard/`

| File | Disposition | Notes |
|------|------------|-------|
| `app-sidebar.tsx` | 🔴 REPLACE | **Admin sidebar:** Orders, Products, Coupons, Customers, Analytics, Settings. Remove: teams, projects, playground, models, documentation |
| `chart-area-interactive.tsx` | 🟡 MODIFY | Revenue chart instead of generic data. Same Recharts library |
| `data-table.tsx` | 🟡 MODIFY | Orders table instead of generic data |
| `section-cards.tsx` | 🔴 REPLACE | Admin KPI cards: Today's Revenue, Orders This Week, Pending Shipments, Active Coupons |
| `team-switcher.tsx` | ⚫ DELETE | Single-store, no teams |
| `nav-projects.tsx` | ⚫ DELETE | |
| `nav-main.tsx` | 🟡 MODIFY | New admin nav items |
| `nav-secondary.tsx` | 🟡 MODIFY | Support/Help links |
| `nav-user.tsx` | 🟡 MODIFY | Admin user info |
| `notifications-dropdown.tsx` | 🟡 MODIFY | Order notifications |
| `header-user-menu.tsx` | 🟡 MODIFY | Admin menu links |

#### `/src/components/auth/`

| File | Disposition | Notes |
|------|------------|-------|
| `auth-context.tsx` | 🟢 KEEP | (add admin role check later) |
| `auth-page-layout.tsx` | 🟡 MODIFY | Rebrand visuals |
| `oauth-buttons.tsx` | 🟡 MODIFY | Rebrand, potentially remove GitHub (not relevant for customers) |

#### `/src/components/email/`

| File | Disposition | Notes |
|------|------------|-------|
| `welcome.tsx` | 🔴 REPLACE | Rebirth welcome email — Daniel's story, brand intro, shop link |
| `confirm-signup.tsx` | 🟡 MODIFY | Rebrand |

#### `/src/components/example/`

| File | Disposition | Notes |
|------|------------|-------|
| All files | ⚫ DELETE | Demo components, not needed |

#### Other

| File | Disposition | Notes |
|------|------------|-------|
| `theme-provider.tsx` | 🟢 KEEP | |
| `posthog-provider.tsx` | 🟢 KEEP | |

---

### `/src/lib/` — Libraries

| File | Disposition | Notes |
|------|------------|-------|
| `utils.ts` | 🟢 KEEP | cn() helper, standard utils |
| `payments/stripe.ts` | 🟢 KEEP | Stripe client init, no changes |
| `payments/plans.ts` | 🔴 REPLACE | **Becomes `payments/products.ts`** — Product catalog config, helper functions for Stripe Products API |
| `payments/index.ts` | 🟡 MODIFY | Update exports |
| `emails.ts` | 🟡 MODIFY | Add new email types: order-confirmation, shipping-notification, abandoned-cart, review-request. Update sender name/domain to Rebirth |
| `posts.ts` | 🟢 KEEP | Blog system |
| `changelog.ts` | ⚫ DELETE | (removing changelog) |
| `posthog/*` | 🟢 KEEP | |
| `supabase/server.ts` | 🟢 KEEP | |
| `supabase/client.ts` | 🟢 KEEP | |
| `supabase/middleware.ts` | 🟡 MODIFY | Add `/admin` to protected routes, update redirect paths |
| `supabase/types.ts` | 🟡 MODIFY | Add new types: Order, OrderItem, Product, CartItem, ShippingAddress. Keep UserProfile. Modify UserSubscription → remove or deprecate |

### `/src/hooks/`

| File | Disposition | Notes |
|------|------------|-------|
| `use-mobile.ts` | 🟢 KEEP | |
| `use-media-query.ts` | 🟢 KEEP | |

### `/src/content/` — MDX Content

| File | Disposition | Notes |
|------|------------|-------|
| `blog/*` | 🔴 REPLACE | New blog content for Rebirth (craft stories, ring care, sustainability) |
| `changelog/*` | ⚫ DELETE | |
| `legal/*` | 🟡 MODIFY | Rebrand, add e-commerce terms |

### `/public/` — Static Assets

| Path | Disposition | Notes |
|------|------------|-------|
| `logo.png` | 🔴 REPLACE | Rebirth World logo |
| `logos/*` | 🔴 REPLACE | Partner/social proof logos if needed |
| `og/*` | 🔴 REPLACE | New Open Graph images for Rebirth |
| `blog/*` | 🔴 REPLACE | New blog images |

### `/supabase/` — Database

| File | Disposition | Notes |
|------|------------|-------|
| `migrations/20240101000000_create_user_profiles.sql` | 🟡 MODIFY | Keep `user_profiles` + `payment_history`. Replace `user_subscriptions` with `orders` + `order_items`. Add `products`, `cart_items`, `shipping_addresses` tables |
| `README.md` | 🟡 MODIFY | Update for Rebirth |

### `/tests/` — E2E Tests

| File | Disposition | Notes |
|------|------------|-------|
| All files | 🔴 REPLACE | New E2E tests: browse products, add to cart, checkout, order confirmation, admin order management |

---

## 3. DATABASE SCHEMA CHANGES

### Tables to KEEP (as-is)

```sql
-- user_profiles — no changes needed
-- payment_history — keep for payment tracking, add order_id reference
```

### Tables to REMOVE

```sql
-- user_subscriptions — DROP (no subscriptions in e-commerce)
-- stripe_products — DROP (we'll query Stripe directly, or create a better version)
```

### New Migration: `20260220000000_create_ecommerce_tables.sql`

```sql
-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,  -- Human-readable: RB-0001, RB-0002
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- nullable for guest checkout
  email TEXT NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, confirmed, processing, shipped, delivered, cancelled, refunded
  payment_status TEXT NOT NULL DEFAULT 'unpaid',  -- unpaid, paid, refunded, partially_refunded
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled',  -- unfulfilled, partial, fulfilled
  
  -- Financials (all in cents)
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  
  -- Shipping
  shipping_name TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  shipping_method TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  
  -- Metadata
  notes TEXT,  -- internal admin notes
  customer_notes TEXT,  -- notes from customer at checkout
  coupon_code TEXT,
  stripe_coupon_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_email ON public.orders(email);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks + admin)
-- (handled by createServiceClient using secret key)

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  
  -- Product info (snapshot at time of purchase)
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  
  -- Variant info
  variant_name TEXT,  -- e.g., "Size 7", "Black Steel + Irish Bog Oak"
  
  -- Pricing (cents)
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  
  -- Customization
  engraving_text TEXT,  -- up to 10 characters
  engraving_graphic_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- CART ITEMS TABLE (persistent cart)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  
  -- Customization
  engraving_text TEXT,
  engraving_graphic_url TEXT,
  variant_name TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate product+variant combos per user
  CONSTRAINT unique_cart_item UNIQUE (user_id, stripe_price_id, variant_name, engraving_text)
);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SHIPPING ADDRESSES TABLE (saved addresses)
-- ============================================
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipping_addresses_user_id ON public.shipping_addresses(user_id);

ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses"
  ON public.shipping_addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- EMAIL SUBSCRIBERS TABLE (newsletter)
-- ============================================
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  source TEXT DEFAULT 'website',  -- website, checkout, popup, footer
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Public insert (anyone can subscribe)
CREATE POLICY "Anyone can subscribe"
  ON public.email_subscribers FOR INSERT
  WITH CHECK (true);

-- ============================================
-- ABANDONED CARTS VIEW (for recovery emails)
-- ============================================
CREATE VIEW public.abandoned_carts AS
SELECT 
  ci.user_id,
  up.full_name,
  u.email,
  COUNT(ci.id) as item_count,
  MAX(ci.updated_at) as last_activity
FROM public.cart_items ci
JOIN auth.users u ON u.id = ci.user_id
LEFT JOIN public.user_profiles up ON up.user_id = ci.user_id
WHERE ci.updated_at < NOW() - INTERVAL '1 hour'
AND NOT EXISTS (
  SELECT 1 FROM public.orders o 
  WHERE o.user_id = ci.user_id 
  AND o.created_at > ci.updated_at
)
GROUP BY ci.user_id, up.full_name, u.email;

-- ============================================
-- UPDATE payment_history to reference orders
-- ============================================
ALTER TABLE public.payment_history 
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id),
  ALTER COLUMN stripe_subscription_id DROP NOT NULL;

-- ============================================
-- ORDER NUMBER SEQUENCE
-- ============================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RB-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_shipping_addresses_updated_at
  BEFORE UPDATE ON public.shipping_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

---

## 4. STRIPE INTEGRATION CONVERSION

### Before (Sabo — Subscriptions)

```
Checkout: mode: "subscription" → creates Stripe Subscription
Webhooks: customer.subscription.created/updated/deleted, invoice.payment_succeeded/failed
Database: user_subscriptions table
Portal: Stripe Customer Portal for managing subscriptions
```

### After (Rebirth — One-Time Purchases)

```
Checkout: mode: "payment" → creates Stripe Payment Intent
Webhooks: checkout.session.completed, charge.refunded
Database: orders + order_items tables
Portal: Custom order history page (no Stripe portal needed)
```

### New Checkout Session (`/api/checkout/route.ts`)

```typescript
// KEY CHANGES from Sabo's checkout_sessions/route.ts:
// 1. mode: "subscription" → mode: "payment"
// 2. line_items from cart (multiple products) instead of single price_id
// 3. Add shipping_address_collection
// 4. Add shipping_options
// 5. Remove subscription_data
// 6. Add payment_intent_data with metadata

const session = await stripe.checkout.sessions.create({
  line_items: cartItems.map(item => ({
    price: item.stripe_price_id,
    quantity: item.quantity,
  })),
  mode: "payment",
  success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/cart?canceled=true`,
  automatic_tax: { enabled: true },
  allow_promotion_codes: true,
  customer_email: user?.email || undefined,
  shipping_address_collection: {
    allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ'],
  },
  shipping_options: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: 500, currency: 'usd' },
        display_name: 'Standard Shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 5 },
          maximum: { unit: 'business_day', value: 10 },
        },
      },
    },
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: 1500, currency: 'usd' },
        display_name: 'Express Shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 2 },
          maximum: { unit: 'business_day', value: 5 },
        },
      },
    },
  ],
  metadata: {
    user_id: user?.id || 'guest',
    order_source: 'website',
  },
  payment_intent_data: {
    metadata: {
      user_id: user?.id || 'guest',
    },
  },
});
```

### New Webhook Handler (`/api/webhooks/stripe/route.ts`)

```typescript
// EVENTS TO HANDLE:
switch (event.type) {
  case "checkout.session.completed":
    // 1. Generate order number (RB-XXXX)
    // 2. Create order in Supabase orders table
    // 3. Create order_items from line_items
    // 4. Create payment_history record
    // 5. Clear user's cart_items
    // 6. Send order confirmation email via Resend
    break;

  case "charge.refunded":
    // 1. Update order payment_status to "refunded"
    // 2. Update payment_history
    // 3. Send refund notification email
    break;
}

// REMOVED EVENTS (no longer needed):
// - customer.subscription.created
// - customer.subscription.updated  
// - customer.subscription.deleted
// - invoice.payment_succeeded
// - invoice.payment_failed
```

### Product Catalog Strategy

Products live in **Stripe** (single source of truth). No local products table needed for MVP.

```typescript
// Fetch products for shop page
const products = await stripe.products.list({
  active: true,
  expand: ['data.default_price'],
});

// Fetch single product
const product = await stripe.products.retrieve(productId, {
  expand: ['default_price'],
});

// Product metadata in Stripe Dashboard:
// - collection: "skateboard-rings" | "wedding-bands" | "apparel"
// - material: "recycled-skateboard" | "steel-bog-oak" | "steel-koa"
// - ring_sizes: "5,6,7,8,9,10,11,12"
// - weight: "5g"
// - care_instructions: "..."
// - featured: "true" | "false"
```

---

## 5. NEW FILES TO CREATE

These files don't exist in Sabo and must be built from scratch.

### New Route Pages

| Path | Purpose |
|------|---------|
| `src/app/(marketing)/shop/page.tsx` | Shop page — all products grid with collection filters |
| `src/app/(marketing)/shop/[slug]/page.tsx` | Individual product page — images, details, add-to-cart, reviews |
| `src/app/(marketing)/collections/[slug]/page.tsx` | Collection page — filtered product grid (skateboard-rings, wedding-bands, apparel) |
| `src/app/(marketing)/cart/page.tsx` | Cart page — line items, quantity controls, coupon input, checkout button |
| `src/app/(marketing)/our-story/page.tsx` | Brand story page — Daniel's journey, the craft, the mission |
| `src/app/order/success/page.tsx` | Order confirmation — confetti, order details, what's next |
| `src/app/(account)/account/page.tsx` | Customer account — order history |
| `src/app/(account)/account/orders/page.tsx` | Order list |
| `src/app/(account)/account/orders/[id]/page.tsx` | Order detail + tracking |
| `src/app/(account)/account/addresses/page.tsx` | Saved addresses |
| `src/app/(account)/account/settings/page.tsx` | Account settings (profile, password, notifications) |
| `src/app/(dashboard)/dashboard/orders/page.tsx` | Admin: Order management table |
| `src/app/(dashboard)/dashboard/orders/[id]/page.tsx` | Admin: Individual order detail + fulfillment |
| `src/app/(dashboard)/dashboard/products/page.tsx` | Admin: Product list (from Stripe) |
| `src/app/(dashboard)/dashboard/coupons/page.tsx` | Admin: Coupon management |
| `src/app/(dashboard)/dashboard/customers/page.tsx` | Admin: Customer list |

### New API Routes

| Path | Purpose |
|------|---------|
| `src/app/api/checkout/route.ts` | Create Stripe Checkout Session for product purchase (replaces checkout_sessions) |
| `src/app/api/cart/route.ts` | Cart CRUD operations (GET, POST, PUT, DELETE) |
| `src/app/api/products/route.ts` | Fetch products from Stripe (with caching) |
| `src/app/api/products/[id]/route.ts` | Fetch single product |
| `src/app/api/newsletter/route.ts` | Newsletter signup (insert into email_subscribers) |
| `src/app/api/orders/route.ts` | Get user's orders |
| `src/app/api/orders/[id]/route.ts` | Get single order detail |
| `src/app/api/admin/orders/route.ts` | Admin: List all orders |
| `src/app/api/admin/orders/[id]/route.ts` | Admin: Update order (status, tracking, notes) |
| `src/app/api/admin/orders/[id]/fulfill/route.ts` | Admin: Mark as shipped + send notification |
| `src/app/api/admin/coupons/route.ts` | Admin: CRUD Stripe Coupons |
| `src/app/api/admin/analytics/route.ts` | Admin: Revenue/order analytics |

### New Components

| Path | Purpose |
|------|---------|
| `src/components/shop/product-card.tsx` | Product card for grid display |
| `src/components/shop/product-gallery.tsx` | Image gallery with zoom for product page |
| `src/components/shop/product-details.tsx` | Product info, pricing, variant selector, add-to-cart |
| `src/components/shop/collection-filter.tsx` | Collection/category filter bar |
| `src/components/shop/size-selector.tsx` | Ring size selection component |
| `src/components/shop/engraving-input.tsx` | Engraving text/graphic input |
| `src/components/shop/add-to-cart-button.tsx` | Animated add-to-cart with feedback |
| `src/components/cart/cart-drawer.tsx` | Slide-out cart drawer (sheet component) |
| `src/components/cart/cart-item.tsx` | Cart line item with quantity controls |
| `src/components/cart/cart-summary.tsx` | Subtotal, shipping estimate, total |
| `src/components/cart/cart-provider.tsx` | Cart context provider (Zustand or Context API) |
| `src/components/marketing/brand-hero.tsx` | Homepage hero — story-driven, animated |
| `src/components/marketing/featured-collections.tsx` | Bento grid of collections |
| `src/components/marketing/featured-products.tsx` | Product card carousel/grid |
| `src/components/marketing/value-props.tsx` | Handmade, recycled, warranty, community |
| `src/components/marketing/craft-process.tsx` | How it's made section |
| `src/components/marketing/newsletter-cta.tsx` | Email capture with Resend |
| `src/components/marketing/instagram-feed.tsx` | IG feed embed (future) |
| `src/components/account/order-list.tsx` | Customer order history list |
| `src/components/account/order-detail.tsx` | Order detail with status timeline |
| `src/components/account/address-form.tsx` | Add/edit shipping address |
| `src/components/admin/order-table.tsx` | Admin order management table |
| `src/components/admin/order-fulfillment.tsx` | Shipping/tracking input |
| `src/components/admin/kpi-cards.tsx` | Revenue, orders, AOV, etc. |
| `src/components/admin/revenue-chart.tsx` | Revenue over time (Recharts) |
| `src/components/email/order-confirmation.tsx` | Order confirmation email template |
| `src/components/email/shipping-notification.tsx` | Shipping notification email |
| `src/components/email/abandoned-cart.tsx` | Cart recovery email |
| `src/components/email/review-request.tsx` | Post-purchase review request |

### New Libraries

| Path | Purpose |
|------|---------|
| `src/lib/payments/products.ts` | Stripe Products API helpers (replaces plans.ts) |
| `src/lib/cart.ts` | Cart state management utilities |
| `src/lib/orders.ts` | Order creation, number generation, status helpers |
| `src/lib/admin.ts` | Admin role checking utility |
| `src/hooks/use-cart.ts` | Cart hook for components |

---

## 6. ROUTE ARCHITECTURE

### Final URL Structure

```
STOREFRONT (public)
├── /                          → Homepage (brand hero, featured products, story)
├── /shop                      → All products grid
├── /shop/[slug]               → Product detail page
├── /collections/[slug]        → Collection page (skateboard-rings, wedding-bands, apparel)
├── /cart                      → Cart page
├── /our-story                 → Brand story
├── /blog                      → Blog (MDX, carried from Sabo)
├── /blog/[slug]               → Blog post
├── /contact                   → Contact form
├── /privacy                   → Privacy policy
├── /terms-of-service          → Terms of service
├── /cookie-policy             → Cookie policy

AUTH
├── /sign-in                   → Sign in
├── /sign-up                   → Create account
├── /forgot-password           → Password reset request
├── /reset-password            → Set new password

POST-PURCHASE
├── /order/success             → Order confirmation + confetti

CUSTOMER ACCOUNT (auth required)
├── /account                   → Account overview + recent orders
├── /account/orders            → Order history
├── /account/orders/[id]       → Order detail + tracking
├── /account/addresses         → Saved addresses
├── /account/settings          → Profile, password, notifications

ADMIN DASHBOARD (admin auth required)
├── /dashboard                 → Admin overview (revenue, orders, KPIs)
├── /dashboard/orders          → Order management
├── /dashboard/orders/[id]     → Order detail + fulfillment
├── /dashboard/products        → Product list (from Stripe)
├── /dashboard/coupons         → Coupon management
├── /dashboard/customers       → Customer list
├── /dashboard/settings/*      → Store settings
```

### Route Groups

```
src/app/
├── (marketing)/          → Public storefront pages (header + footer layout)
│   ├── layout.tsx
│   ├── page.tsx           → Homepage
│   ├── shop/
│   ├── collections/
│   ├── our-story/
│   └── contact/
├── (auth)/               → Authentication pages
├── (legal)/              → Legal pages
├── (account)/            → Customer account (NEW route group)
│   ├── layout.tsx         → Account layout with sidebar
│   └── account/
├── (dashboard)/          → Admin dashboard (existing, repurposed)
│   ├── layout.tsx
│   └── dashboard/
├── order/                → Post-purchase flows
├── blog/                 → Blog
└── api/                  → API routes
```

---

## 7. COMPONENT CONVERSION DETAILS

### Pricing Component → FeaturedProducts

**Before (pricing.tsx — 261 lines):**
- Fetches plans from `plans.ts` config
- Monthly/yearly toggle
- Plan cards with feature lists
- Checkout form submission to `/api/checkout_sessions`

**After (featured-products.tsx):**
- Fetches products from `/api/products` (Stripe Products API)
- Collection filter (All, Rings, Wedding Bands, Apparel)
- Product cards with image, name, price, "Add to Cart" button
- Cart drawer opens on add
- No monthly/yearly toggle needed

**Reusable patterns from pricing.tsx:**
- Card layout structure (CardHeader, CardContent)
- Button with loading state
- ShineBorder on featured items
- motion animation wrappers
- Auth check before checkout

### Checkout Session → Product Checkout

**Before (checkout_sessions/route.ts — 73 lines):**
- Single `price_id` from form data
- `mode: "subscription"`
- `subscription_data` with metadata

**After (checkout/route.ts):**
- Multiple line items from cart
- `mode: "payment"`
- `shipping_address_collection`
- `shipping_options` (standard + express)
- `payment_intent_data` with metadata

### Webhook Handler

**Before (webhooks/stripe/route.ts — 621 lines):**
- 5 handlers: subscription created/updated/deleted, payment success/failure
- `user_subscriptions` table operations
- Complex subscription status tracking

**After:**
- 2 handlers: `checkout.session.completed`, `charge.refunded`
- `orders` + `order_items` table operations
- Simpler: create order, create items, send email, clear cart

**Reusable from current webhook:**
- Signature verification (identical)
- Service client pattern (identical)
- Error handling structure (identical)
- getUserIdFromMetadata pattern (identical)

### Dashboard → Admin Portal

**Before (app-sidebar.tsx — 192 lines):**
- Teams: Acme Inc, Acme Corp, Evil Corp
- Nav: Playground, Models, Documentation, Settings
- Projects: Design Engineering, Sales & Marketing, Travel

**After:**
- No teams (single store)
- Nav: Orders, Products, Coupons, Customers, Analytics, Settings
- Quick stats in sidebar footer

---

## 8. ENVIRONMENT VARIABLES

### Variables that Stay (rename where noted)

```env
# Supabase — NO CHANGES
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# Stripe — KEEP (same keys work for products + payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend — UPDATE sender info
RESEND_API_KEY=

# Site — UPDATE
NEXT_PUBLIC_SITE_URL=https://rebirth.world

# PostHog — NO CHANGES
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

### Variables to REMOVE

```env
# No longer needed (subscription-specific)
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=
STRIPE_CUSTOMER_PORTAL_CONFIG_ID=
```

### Variables to ADD

```env
# Admin
ADMIN_USER_ID=    # Daniel's Supabase user ID for admin access

# Shipping (optional, can hardcode initially)
STANDARD_SHIPPING_RATE=500    # $5.00 in cents
EXPRESS_SHIPPING_RATE=1500    # $15.00 in cents

# Email
RESEND_FROM_EMAIL=hello@rebirth.world
RESEND_FROM_NAME=Rebirth World
```

---

## 9. BUILD PHASES & EXECUTION ORDER

### Phase 1: Foundation (Days 1-3)

**Goal:** Auth works, products display, basic browsing

1. **Rebrand infrastructure**
   - Update `package.json` name
   - Update `layout.tsx` metadata, fonts, JSON-LD
   - Update `globals.css` with Rebirth color palette
   - Replace logo, favicon, OG images
   - Update `next.config.ts` with new image domains

2. **Database migration**
   - Create new migration file with all e-commerce tables
   - Run migration on Supabase
   - Update `src/lib/supabase/types.ts` with new types

3. **Product catalog**
   - Create products in Stripe Dashboard (3-5 initial products)
   - Build `src/lib/payments/products.ts` (Stripe Products API helpers)
   - Build `src/app/api/products/route.ts`
   - Build `src/components/shop/product-card.tsx`

4. **Storefront pages**
   - Replace homepage (`page.tsx`) with brand hero + featured products
   - Build `/shop` page with product grid
   - Build `/shop/[slug]` product detail page
   - Update header with e-commerce nav
   - Update footer with Rebirth branding

### Phase 2: Cart & Checkout (Days 4-6)

**Goal:** Full purchase flow works end-to-end

1. **Cart system**
   - Build cart context/provider (Zustand or Context API)
   - Build cart drawer (slide-out sheet)
   - Build cart page
   - Build cart API routes (CRUD)
   - Persistent cart via Supabase for logged-in users
   - LocalStorage cart for guests

2. **Checkout**
   - Build new checkout API route (`mode: "payment"`)
   - Build new webhook handler
   - Build order confirmation page
   - Build order confirmation email template

3. **Auth updates**
   - Update middleware protected routes
   - Update redirect paths
   - Rebrand auth pages

### Phase 3: Customer Account (Days 7-8)

**Goal:** Customers can view orders and manage their account

1. **Account route group**
   - Build account layout
   - Build order history page
   - Build order detail page
   - Build saved addresses page
   - Build account settings page

2. **Email system**
   - Build shipping notification email
   - Build abandoned cart email
   - Update welcome email for Rebirth

### Phase 4: Admin Dashboard (Days 9-11)

**Goal:** Daniel can manage orders, view analytics

1. **Admin access**
   - Build admin role check (by user ID initially)
   - Update middleware for `/dashboard` admin protection

2. **Order management**
   - Build orders list page (data table with filters)
   - Build order detail + fulfillment page
   - Build fulfill/ship action with tracking input
   - Auto-send shipping notification email

3. **Analytics**
   - Build KPI cards (revenue, orders, AOV, conversion)
   - Build revenue chart (Recharts)
   - Build admin overview page

4. **Product & coupon management**
   - Build products page (read from Stripe)
   - Build coupons page (CRUD via Stripe API)

### Phase 5: Polish & Launch (Days 12-14)

**Goal:** Production-ready, beautiful, fast

1. **Design polish**
   - Apply full Rebirth aesthetic (PRD Section 5)
   - Add Aceternity/Magic UI animations to key sections
   - Responsive testing (mobile, tablet, desktop)
   - Dark mode refinement

2. **SEO**
   - Product page structured data (JSON-LD Product schema)
   - Collection page meta tags
   - Update sitemap with all new routes
   - Blog content (2-3 initial posts)

3. **Testing**
   - New E2E tests for critical flows
   - Checkout flow test
   - Admin order flow test

4. **Launch**
   - Deploy to Vercel
   - Connect rebirth.world domain
   - Stripe webhook URL in production
   - Test full purchase flow with real payment
   - Go live

---

## 10. BRAND THEMING CHECKLIST

Reference: PRD Section 5 — Brand Aesthetic & Design Language

### Color Variables to Set in `globals.css`

```css
:root {
  /* Rebirth World Color Palette */
  --rebirth-charcoal: #1a1a1a;
  --rebirth-warm-white: #f5f0e8;
  --rebirth-ocean-teal: #2a9d8f;
  --rebirth-burnt-amber: #e07a3a;
  --rebirth-lotus-pink: #d4a0a0;
  --rebirth-driftwood: #8a8578;
  --rebirth-moss: #5a6b4a;
}
```

### Typography

| Role | Sabo Current | Rebirth Target |
|------|-------------|----------------|
| Headlines | Geist Sans | Satoshi, General Sans, or Clash Display (bold, condensed) |
| Body | Geist Sans | DM Sans or Source Serif (warm, readable) |
| Accent | Geist Mono | Handwritten/organic font (taglines, quotes) |

### Key UI Moments for Animation

- Homepage hero entrance
- Product card hover (subtle lift + shadow)
- Add-to-cart button (success animation)
- Cart drawer slide-in
- Order confirmation confetti (already in Sabo!)
- Section reveals on scroll (already in Sabo via motion)
- Number tickers for stats (already in Sabo!)
- Marquee for customer reviews (already in Sabo!)

### Rebirth-Specific Design Tokens

- Border radius: Slightly rounded (8-12px), not pill-shaped
- Shadows: Warm, soft (not harsh corporate)
- Image treatment: Slightly desaturated, golden-hour warmth
- Button style: Solid fills with warm hover states
- Card style: Warm white backgrounds, subtle borders

---

## APPENDIX A: FULL FILE COUNT SUMMARY

| Category | Keep | Modify | Replace | New | Delete | Total |
|----------|------|--------|---------|-----|--------|-------|
| Root configs | 4 | 3 | 3 | 0 | 0 | 10 |
| Route pages | 1 | 12 | 5 | 16 | 1 | 35 |
| API routes | 0 | 2 | 2 | 12 | 1 | 17 |
| UI components | 57 | 0 | 0 | 0 | 0 | 57 |
| Shared components | 3 | 1 | 3 | 0 | 1 | 8 |
| Marketing components | 0 | 3 | 7 | 7 | 0 | 17 |
| Dashboard components | 0 | 5 | 3 | 4 | 2 | 14 |
| Auth components | 1 | 2 | 0 | 0 | 0 | 3 |
| Email components | 0 | 1 | 1 | 4 | 0 | 6 |
| Shop components (NEW) | 0 | 0 | 0 | 8 | 0 | 8 |
| Cart components (NEW) | 0 | 0 | 0 | 4 | 0 | 4 |
| Account components (NEW) | 0 | 0 | 0 | 3 | 0 | 3 |
| Admin components (NEW) | 0 | 0 | 0 | 4 | 0 | 4 |
| Libraries | 4 | 4 | 1 | 5 | 1 | 15 |
| Content/MDX | 0 | 3 | 3 | 0 | 3 | 9 |
| Database | 0 | 1 | 0 | 1 | 0 | 2 |
| Tests | 0 | 0 | 16 | 0 | 0 | 16 |
| Example components | 0 | 0 | 0 | 0 | 2 | 2 |
| **TOTALS** | **70** | **37** | **44** | **68** | **11** | **230** |

**Reuse rate: 70 untouched + 37 modified = 107/230 = 46.5% direct reuse**  
**Including modified files: 107 carried forward out of 162 existing = 66% carry-over**

---

## APPENDIX B: SABO FEATURES WE GET FOR FREE

These work out of the box with zero changes:

1. ✅ **Authentication** — Sign in, sign up, OAuth, magic links, password reset, protected routes
2. ✅ **57 UI components** — Every shadcn/ui + Magic UI component
3. ✅ **Dark mode** — Full theme system with toggle
4. ✅ **Blog system** — MDX with syntax highlighting, SEO
5. ✅ **Legal pages** — Privacy, Terms, Cookie Policy
6. ✅ **Contact form** — With Zod validation
7. ✅ **Email infrastructure** — Resend with React Email templates
8. ✅ **Analytics** — PostHog + Vercel Analytics
9. ✅ **SEO** — Sitemap, robots.txt, Open Graph, JSON-LD
10. ✅ **E2E testing framework** — Playwright configured
11. ✅ **Responsive design** — Mobile-first with breakpoints
12. ✅ **Toast notifications** — Sonner
13. ✅ **User profiles** — Database table + CRUD
14. ✅ **Image optimization** — Next.js Image component configured
15. ✅ **Session management** — Supabase middleware
16. ✅ **Confetti animation** — Order success celebration ready to go

---

*This blueprint is the single source of truth for the Sabo → Rebirth World conversion. Every file, every table, every route has been mapped. Let's build. 🪷*
