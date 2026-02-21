# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Satori AI** (satori.world) is a landing page + SaaS product for tattoo artists, built on a Next.js 16 boilerplate (originally "Sabo"). The product is an AI assistant that handles DMs, SMS, voice calls, and follow-ups for tattoo shops.

**Current state:**

- **Marketing landing page** — Fully custom 13-section persuasion flow targeting tattoo artists, deployed at satori.world
- **Channel Showcase** — Interactive 4-tab demo (DMs, SMS, Voice, Outbound) with auto-advancing tabs, personality-matched AI avatars, real conversation scripts, calendar scanning animation, and booking celebrations
- **Authentication** (Supabase with OAuth — Google enabled)
- **Dashboard** — Rebranded for tattoo artists with Conversations, Bookings, AI Assistants, Analytics sidebar nav. Cards show Bookings This Month, Messages Handled, Avg Response Time, Revenue Recovered. Chart shows DM/SMS conversation volume.
- **Payments** (Stripe with webhooks — test keys on Vercel, webhook endpoint at `satori.world/api/webhooks/stripe`)
- **Content** — 3 tattoo industry blog posts, 3 changelog entries reflecting actual product milestones
- **Testing** (Playwright E2E tests)
- **SEO** (sitemap, robots.txt, full OG tags, JSON-LD)
- **70+ UI components** (shadcn/ui and Magic UI)
- **Lead capture** — CRO-optimized unified form (name, email, phone, optional instagram) with react-hook-form + zod, posts to /api/lead-capture → GHL CRM (upserts contact with tags `new ai lead`, `lead | master`, `saas - opt in`, `source:{page}` + custom field `lead_source_page` + creates opportunity in Ai Assistant Leads pipeline). Form appears on 4 pages with research-backed, page-specific persuasion copy: homepage (Mechanism 2: 6,000-Message Math), /pricing (Mechanism 14: Deposit Filter Effect), /contact (Mechanism 9: Boundary Trap + Mechanism 5: First-Responder Wins), /integrations (Mechanism 3: Platform Scatter Effect). Component accepts props for per-page headlines/CTAs plus `proofStat` (amber-tinted card), `costAnchor` (muted cost-of-inaction line), `testimonial` (mini social proof inside form card), and `source` (page attribution forwarded to GHL).
- **GoHighLevel CRM** — `src/lib/ghl.ts` helper with `upsertContact()` and `createOpportunity()`. Lead capture, contact form, and Stripe webhook all sync to GHL. Env vars: `GHL_API_KEY`, `GHL_LOCATION_ID`.
- **Checkout flow** — Public (no auth gate) pre-payment plan confirmation page at `/checkout?plan=X` with CRO-optimized order summary (ROI anchor, itemized setup deliverables, 10-booking guarantee, testimonial, outcome-focused CTA), submits to Stripe hosted checkout. Guests go straight to Stripe where email is collected.
- **Stripe products** — 3 tiers wired: Essentials ($300/mo + $1,500 setup), Pro ($500/mo + $3,000 setup), Studio ($800/mo + $5,000 setup). Webhook endpoint configured in Stripe dashboard for snapshot + thin payloads.
- **Full dark mode** — All sections use theme-aware CSS variables; no hardcoded light-only or dark-only colors
- **Header nav** — Integrations, Pricing, Blog, Contact, ThemeToggle, Sign in (ghost), Get started (primary CTA → /pricing). Mobile nav mirrors desktop.
- **Footer** — Multi-column: Product (Pricing, Integrations, How it works, FAQ), Resources (Blog, Changelog, Contact), Legal (Privacy, Terms, Cookies) + copyright.

**Brand:** DM Sans (body) + Instrument Serif (display/headings). Warm off-white background, amber (#e08a30) accent. Logo is "Satori" in display font.

**Deployment:** Vercel CLI logged in as `satoriworld` (team: `Satori`, scope: `satori-world`). Deploy with `vercel --prod --yes`. GitHub remote `satoriworld` → `satoriworld/satori-boiler-plate`. Auto-deploys on push if GitHub integration is connected.

**This document serves as an architectural guide for maintaining consistency when extending the codebase.**

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Tech Stack

### Core

- **Next.js 16** with App Router and React Server Components
- **React 19.2** for UI
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling with mobile-first approach
- **motion** (Framer Motion) for animations

### UI Components

- **shadcn/ui** (New York style) - 70+ base components
- **Magic UI** - 11 enhanced UI elements (via `@magicui` registry)
- **Radix UI** - Underlying primitives (accordion, dialog, navigation, etc.)
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### Form Handling & Validation

- **React Hook Form** - Form state management
- **Zod** - Schema validation (client and server)
- **@hookform/resolvers** - Zod integration with React Hook Form

### Additional Libraries

- **sonner** - Toast notifications
- **class-variance-authority** - Component variant management
- **tailwind-merge** & **clsx** - Utility for merging Tailwind classes
- **date-fns** - Date manipulation
- **react-day-picker** - Calendar/date picker component
- **recharts** - Charts and data visualization

### Content Management (MDX)

- **gray-matter** - Parse frontmatter from MDX files
- **next-mdx-remote-client** - Render MDX in Next.js Server Components
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-pretty-code** - Syntax highlighting for code blocks
- **rehype-slug** - Add slugs to headings
- **shiki** - Syntax highlighter

### Integrations

- **Supabase** - Authentication and database (`@supabase/ssr`)
  - Browser and server clients configured
  - Auth middleware implemented
  - Database types defined in `src/lib/supabase/types.ts`
  - Used throughout the application
- **Stripe** - Payment processing with full webhook implementation
  - Checkout sessions and customer portal
  - Subscription management and payment history
  - All webhook events handled
- **PostHog** - Analytics (provider configured, optional activation)

## Project Architecture

### Route Structure

The app uses Next.js App Router with **route groups** for organization:

```text
src/app/
├── (auth)/           # ✅ Authentication pages
│   ├── actions.ts    # Server actions for auth operations
│   ├── sign-in/
│   │   ├── page.tsx  # Login page
│   │   └── confirm/  # Email confirmation
│   ├── sign-up/
│   │   ├── page.tsx  # Registration page
│   │   └── confirm/  # Email confirmation
│   ├── forgot-password/
│   │   └── page.tsx  # Password reset request
│   └── reset-password/
│       └── page.tsx  # Password reset form
│
├── (dashboard)/      # ✅ Protected dashboard area
│   └── dashboard/
│       ├── page.tsx      # Dashboard main page
│       ├── layout.tsx    # Sidebar layout
│       └── settings/
│           ├── general/       # General settings
│           ├── account/       # Account settings (profile, email, password)
│           ├── billing/       # Billing settings (plan, payment, invoices)
│           └── notifications/ # Notification preferences
│
├── (marketing)/      # ✅ Public marketing pages
│   ├── page.tsx      # Homepage
│   ├── layout.tsx    # Marketing layout (overflow-x-hidden for mobile)
│   ├── checkout/
│   │   └── page.tsx  # Pre-payment plan confirmation (auth-gated)
│   ├── integrations/
│   │   └── page.tsx  # Integrations showcase (6 integration cards + CTA)
│   ├── pricing/
│   └── contact/
│
├── (legal)/          # ✅ Legal pages
│   ├── layout.tsx
│   ├── privacy/
│   ├── terms-of-service/
│   └── cookie-policy/
│
├── blog/             # ✅ Blog system with MDX
│   ├── page.tsx      # Blog listing page
│   ├── layout.tsx
│   ├── blog-client.tsx
│   └── [slug]/       # Individual blog posts
│
├── changelog/        # ✅ Changelog system with MDX
│   ├── page.tsx      # Changelog listing page
│   ├── layout.tsx
│   └── [slug]/       # Individual changelog entries
│
├── api/              # API routes
│   ├── contact/route.ts           # Contact form endpoint
│   ├── auth/callback/route.ts     # Supabase auth callback
│   ├── checkout_sessions/route.ts # Stripe checkout
│   ├── customer_portal/route.ts   # Stripe customer portal
│   └── webhooks/stripe/route.ts   # Stripe webhooks (624 lines)
│
├── layout.tsx        # Root layout with ThemeProvider
└── not-found.tsx     # Custom 404 page
```

**Important**: Route groups like `(auth)`, `(dashboard)`, `(marketing)`, and `(legal)` are organizational only—they don't affect URL structure. The URL for `(marketing)/page.tsx` is just `/`, not `/marketing`.

### API Routes

All API routes follow REST conventions with proper error handling, validation, and type safety.

- **`/api/contact`** (POST) - Contact form submission
  - Validates form data with Zod schema
  - Upserts contact in GHL with tag `satori support request`
  - Returns 400 for validation errors, 200 for success

- **`/api/auth/callback`** (GET) - Supabase authentication callback
  - Handles OAuth provider redirects (Google, GitHub)
  - Exchanges authorization code for session

- **`/api/checkout_sessions`** (POST) - Create Stripe checkout session
  - Requires authenticated user
  - Accepts `price_id` from form data
  - Creates Stripe subscription checkout with user metadata
  - Redirects to Stripe hosted checkout, then to `/success`

- **`/api/customer_portal`** (POST) - Stripe customer portal
  - Allows users to manage subscriptions and payment methods
  - Returns portal URL

- **`/api/lead-capture`** (POST) - Satori lead capture form submission
  - Validates name, email, phone (required), optional instagram and source with Zod
  - Upserts contact in GHL with tags `new ai lead`, `lead | master`, `saas - opt in`, `source:{page}` + custom field `lead_source_page` + source string `satori-website-{page}`
  - Creates opportunity in Ai Assistant Leads pipeline at New Ai Lead stage (or updates existing back to Lead stage)
  - Returns 400 for validation errors, 200 for success
  - Backward-compatible: submissions without `source` default to `unknown`

- **`/api/webhooks/stripe`** (POST) - Stripe webhook handler
  - Handles subscription lifecycle events (created, updated, deleted)
  - Updates user subscriptions in Supabase
  - Records payment history
  - Includes signature verification
  - On subscription created: syncs to GHL with tags `purchase | master` + `purchase | subscription | {plan name}`, creates opportunity at Purchased Ai Assistant stage

### Component Organization

```text
src/components/
├── ui/               # ✅ 70+ shadcn/ui + Magic UI components
│   ├── button.tsx, card.tsx, dialog.tsx, input.tsx, table.tsx
│   ├── ... (40+ shadcn/ui components)
│   └── ... (11 Magic UI components: bento-grid, marquee, animated-*, etc.)
│
├── auth/             # ✅ Authentication components
│   ├── auth-context.tsx      # Auth Context Provider
│   ├── auth-page-layout.tsx  # Auth page layout wrapper
│   └── oauth-buttons.tsx     # Google/GitHub OAuth buttons
│
├── dashboard/        # ✅ Dashboard components
│   ├── app-sidebar.tsx            # Main sidebar
│   ├── nav-main.tsx               # Main navigation
│   ├── nav-user.tsx               # User navigation
│   ├── nav-projects.tsx           # Projects navigation
│   ├── nav-secondary.tsx          # Secondary navigation
│   ├── header-user-menu.tsx       # Header user dropdown
│   ├── notifications-dropdown.tsx # Notifications dropdown
│   ├── team-switcher.tsx          # Team/workspace switcher
│   ├── chart-area-interactive.tsx # Interactive charts
│   ├── data-table.tsx             # Data table component
│   └── section-cards.tsx          # Dashboard section cards
│
├── marketing/        # ✅ Marketing components (Satori AI landing page)
│   ├── hero.tsx                # Hero with badge pill, tattoo needle draw animation
│   ├── channel-showcase.tsx    # ⭐ Interactive 4-tab demo (DMs/SMS/Voice/Outbound)
│   │                           #    ~1150 lines: ChatView, VoiceView, CalendarCheck,
│   │                           #    PhoneFrame, auto-advance, progress bars,
│   │                           #    personality-matched scripts, booking celebrations
│   ├── social-proof.tsx        # Channel pill marquee
│   ├── features-grid.tsx       # ⭐ 6-card grid with looping animated micro-scenes
│   │                           #    Each card has a live product demo: Luna answering DMs,
│   │                           #    Hex handling night bookings, Mike quoting prices,
│   │                           #    Kenji screening inquiries, deposit notifications,
│   │                           #    calendar filling up. Uses useLoop hook + avatar images.
│   ├── avatar-mirror.tsx       # "Sound familiar?" pain quotes + transformation arc
│   ├── proof-stack.tsx         # "The Math" — NumberTicker stats, DM math exercise,
│   │                           #    before/after visual (75 msgs → 0 with Satori)
│   │                           #    Uses theme-aware colors (bg-card, border-border)
│   ├── why-different.tsx       # "Why nothing else worked" — 3×2 grid of real brand logos
│   │                           #    (Instagram, Google Forms, Calendly, Vagaro, Email, Paper)
│   │                           #    with diagonal strikethrough vs "what you actually need" card
│   ├── how-it-works.tsx        # 3-step process with animated scene cards
│   │                           #    Onboarding form, 4 avatars going live, calendar result
│   ├── pricing.tsx             # 3-tier pricing (Essentials/Pro/Studio) with ShineBorder
│   │                           #    "Get started" buttons link to /checkout?plan={id}
│   ├── testimonials.tsx        # 6 transformation quotes in 3-col grid
│   ├── faq.tsx                 # 7-item accordion (tattoo-specific)
│   ├── cta.tsx                 # Card with particles + amber glow, links to #pricing
│   ├── lead-capture.tsx        # ⭐ CRO-optimized lead form (name, email, phone, instagram)
│   │                           #    Props: eyebrow, heading, subheading, buttonText, footnote,
│   │                           #    proofStat (amber card), costAnchor (muted line),
│   │                           #    testimonial (mini quote w/ Quote icon), source (GHL tracking).
│   │                           #    Used on homepage, /contact, /pricing, /integrations.
│   │                           #    Each page has research-backed copy from persuasion mechanisms.
│   ├── checkout-page.tsx       # ⭐ Pre-payment checkout confirmation
│   │                           #    Two-column: order summary (ROI anchor, itemized setup
│   │                           #    deliverables, guarantee, testimonial, Stripe form)
│   │                           #    + feature list. CRO-optimized for high-ticket conversion.
│   ├── integrations-page.tsx   # Integrations showcase — hero + 6-card grid
│   │                           #    (Instagram DMs, SMS, Voice, Calendar, Stripe, CRM)
│   │                           #    + lead capture form. Cards use lucide icons + logos.
│   ├── features-bento-grid.tsx # (preserved, not in page composition)
│   ├── features-accordion.tsx  # (preserved, not in page composition)
│   └── contact-form.tsx        # (preserved, not in page composition)
│
├── shared/           # ✅ Shared layout components
│   ├── header.tsx        # Marketing header
│   ├── footer.tsx        # Footer
│   ├── mobile-nav.tsx    # Mobile navigation drawer
│   ├── logo.tsx          # Logo component
│   ├── theme-toggle.tsx  # Theme toggle button
│   └── mode-toggle.tsx   # Dark mode toggle
│
├── theme-provider.tsx    # next-themes provider
│
└── example/          # Example/demo components
    ├── animated-beam-demo.tsx
    └── animated-list-demo.tsx
```

### Library Code

```text
src/lib/
├── supabase/         # ✅ Supabase client configuration
│   ├── client.ts     # Browser client using @supabase/ssr
│   ├── server.ts     # Server client for RSC and API routes
│   ├── middleware.ts # Auth middleware for route protection
│   └── types.ts      # Database types (UserProfile, UserSubscription, PaymentHistory)
│
├── payments/         # Stripe integration
│   ├── stripe.ts     # Stripe client configuration
│   ├── plans.ts      # Plan definitions and pricing
│   └── checkout.ts   # Checkout utilities
│
├── ghl.ts            # GoHighLevel CRM helper (upsertContact, createOpportunity, GHL_STAGES)
├── utils.ts          # cn() utility for Tailwind class merging
├── posts.ts          # Blog post utilities (getAllPosts, getPostBySlug, etc.)
└── changelog.ts      # Changelog utilities (getChangelogEntries, getChangelogBySlug, etc.)
```

### Content Directory

```text
src/content/
├── blog/             # Blog posts in MDX format
│   └── *.mdx         # Individual blog posts with frontmatter
├── changelog/        # Changelog entries in MDX format
│   └── *.mdx         # Individual changelog entries with frontmatter
└── legal/            # Legal documents in MDX format
    ├── privacy.mdx
    ├── terms-of-service.mdx
    └── cookie-policy.mdx
```

### Static Assets (Satori-specific)

```text
public/
├── avatars/              # AI + client avatars for channel showcase
│   ├── ai-dm.png         # Luna — fine-line girl (DMs tab)
│   ├── ai-sms.png        # Big Mike — bearded traditional (SMS tab)
│   ├── ai-voice.png      # Kenji — Japanese specialist (Voice tab)
│   ├── ai-outbound.png   # Hex — androgynous blackwork (Outbound tab)
│   ├── client.png        # Female client (DMs, Voice, Outbound)
│   └── client-sms.png    # Male client (SMS tab)
│
├── logos/                # Brand logos for WhyDifferent section
│   ├── instagram.svg     # Real Instagram glyph with gradient
│   ├── googleforms.svg   # Google Forms icon (purple #7248B9)
│   ├── calendly.svg      # Calendly logo (blue #006BFF)
│   ├── vagaro.svg        # Vagaro V + dot (green #43B049)
│   ├── email.svg         # Envelope stroke icon
│   └── paperbook.svg     # Open book stroke icon
│
└── images/               # Tattoo reference images for demos
    ├── ref-floral.jpg    # Fine-line botanical (DM script)
    ├── ref-eagle.jpg     # Traditional eagle flash (SMS script)
    └── ref-flash.jpg     # Sacred geometry flash (Outbound script)
```

### Checkout Flow Architecture

```
Pricing card "Get started" → /checkout?plan=essentials|pro|studio
  → Server component checks auth (redirects to /sign-up if not logged in)
  → Server component validates plan (redirects to /pricing if invalid)
  → Renders <CheckoutPage plan={plan} /> client component
  → User clicks "Start Booking More Clients"
  → Form POSTs to /api/checkout_sessions with price_id
  → Stripe hosted checkout (card collection)
  → /success?session_id=cs_... (confetti + dashboard link)
```

**CRO elements on checkout page** (checkout-page.tsx):
- ROI anchor banner above order summary ("8.4x return on investment")
- Itemized setup deliverables (5 line items explaining what setup fee covers)
- 10-Booking Guarantee (green card next to "Due today" total)
- Mini testimonial between guarantee and CTA
- Outcome-focused CTA: "Start Booking More Clients" (not "Continue to payment")
- Trust microcopy: "Setup takes 48 hours. Your AI goes live this week."
- ShineBorder on Pro plan card (most popular)

### Channel Showcase Architecture

`src/components/marketing/channel-showcase.tsx` is the most complex component (~1150 lines). Key patterns:

- **Tab system**: 4 tabs (DMs, SMS, Voice, Outbound), each with unique `TabConfig` (AI avatar, client avatar, shop name, personality)
- **Auto-advance**: Tabs cycle automatically using `getTabDuration()` + `setTimeout`. Progress bars show completion. Manual clicks reset the timer.
- **ChatView**: Renders DM/SMS/Outbound demos. Uses epoch-based looping (state counter forces `useEffect` re-runs). Handles `TextMessage | ImageMessage | BookingEvent` union types.
- **VoiceView**: State machine (`idle → ringing → connected → checking → connected → booked → ended`). Dual avatars with speaking indicators. Waveform responds to `isSpeaking`.
- **CalendarCheck**: Animated day schedule with scan bar that sweeps through time slots. Turns green when it finds the open slot.
- **BookingCard**: Celebration effects (green shimmer sweep, glow pulse, spring animations on icon + checkmark).
- **Desktop layout**: Two-column on `lg+` (heading + vertical tab list | phone). Mobile: stacked with horizontal segment control.

### Hooks

```text
src/hooks/
├── use-media-query.ts  # Responsive media query hook with SSR support
└── use-mobile.ts       # Mobile detection hook (768px breakpoint)
```

### Configuration

- **components.json**: shadcn/ui configuration
  - Style: `new-york`
  - Base color: `neutral`
  - CSS variables enabled
  - Path aliases: `@/components`, `@/lib/utils`, etc.
  - Magic UI registry: `https://magicui.design/r/{name}.json`

- **tsconfig.json**: TypeScript configuration
  - Path alias: `@/*` maps to `./src/*`
  - Target: ES2017
  - JSX: react-jsx (React 19)

- **next.config.ts**: Next.js configuration
  - Image remote patterns: `randomuser.me` and `images.unsplash.com` for demo images

## Styling Architecture

### Tailwind CSS v4

This project uses the latest Tailwind CSS v4, which has breaking changes from v3:

- **CSS-first configuration**: No `tailwind.config.js`, configuration is in CSS
- **Native CSS variables**: Direct support for CSS custom properties
- **Import syntax**: Uses `@import "tailwindcss"` in globals.css
- **Build integration**: Uses `@tailwindcss/postcss` plugin

### Design System

- **Mobile-first**: All styles start mobile, use `sm:`, `lg:`, `xl:` for larger screens
- **Dark mode**: Via `next-themes` with class-based mode (`class` attribute)
- **Fonts**: DM Sans (body, `--font-body`/`--font-sans`) and Instrument Serif (display headings, `--font-display`) from `next/font/google`. Display font applied via `font-[family-name:var(--font-display)]` class.
- **Animation**: Framer Motion via `motion` package (v12.23+)

### Responsive Breakpoints

```text
Mobile:  < 640px   (default)
Tablet:  ≥ 640px   (sm:)
Laptop:  ≥ 1024px  (lg:)
Desktop: ≥ 1280px  (xl:)
Wide:    ≥ 1536px  (2xl:)
```

## Component Development Guidelines

### Adding shadcn/ui Components

```bash
# Add component from shadcn/ui
npx shadcn@latest add [component-name]

# Example: Add dialog component
npx shadcn@latest add dialog
```

Components are installed to `src/components/ui/` and can be customized freely.

### Adding Magic UI Components

Magic UI components are added similarly but from the Magic UI registry (configured in `components.json`):

```bash
npx shadcn@latest add -r @magicui [component-name]
```

Existing Magic UI components in the project:

- `animated-beam`
- `animated-list`
- `animated-shiny-text`
- `bento-grid`
- `border-beam`
- `interactive-grid-pattern`
- `marquee`
- `number-ticker`
- `orbiting-circles`
- `particles`
- `shine-border`

### Server vs Client Components

- **Default to Server Components**: Next.js 13+ treats all components as Server Components by default
- **Use `"use client"` when needed**:
  - Interactive state (useState, useEffect)
  - Browser APIs (window, document)
  - Event handlers (onClick, onChange)
  - Animations (motion components)
  - Theme context (useTheme)
  - Auth context (useAuth)

**Current client components**: All marketing components and auth components use `"use client"` for interactivity.

## Testing

The project includes comprehensive E2E testing with Playwright:

```bash
# Run all tests
pnpm test:e2e

# Run tests in UI mode (recommended for development)
pnpm test:e2e:ui

# Run tests in headed mode (browser visible)
pnpm test:e2e:headed

# Debug tests
pnpm test:e2e:debug

# View test report
pnpm test:e2e:report
```

**Test Coverage:**

- **Auth flows**: Sign-in, sign-up, password reset
- **Dashboard**: Main page, settings (general, account, billing, notifications)
- **Content**: Blog listing/detail, changelog listing/detail
- **Marketing**: Homepage, pricing, contact form
- **Legal**: Privacy, terms, cookie policy

**Test Helpers:**
Located in `tests/e2e/helpers/auth.ts`, includes utilities for:

- User registration and login
- Session management
- Test data cleanup

When adding new features, write E2E tests following the patterns in `tests/e2e/`.

## Key Architectural Decisions

### MDX-Based Content Management

The project implements a file-based content management system using MDX files stored in `src/content/`:

- **Blog posts** (`src/content/blog/*.mdx`): Frontmatter includes title, description, date, author, thumbnail, and tags
- **Changelog entries** (`src/content/changelog/*.mdx`): Frontmatter includes version, title, releaseDate, author, and image
- **Legal documents** (`src/content/legal/*.mdx`): Static legal pages rendered from MDX

Content is parsed using `gray-matter` for frontmatter extraction and rendered using `next-mdx-remote-client` with Server Components. This approach provides:

- **Type-safe content**: TypeScript interfaces for all content types (see `src/lib/posts.ts` and `src/lib/changelog.ts`)
- **Build-time rendering**: Content is statically generated at build time for optimal performance
- **Rich formatting**: Full MDX support with remark/rehype plugins for GFM, syntax highlighting, and more
- **SEO optimization**: Automatic metadata generation from frontmatter

### Supabase Configuration

The `src/lib/supabase/` directory contains configured Supabase clients:

- **`client.ts`**: Browser client using `@supabase/ssr` for client components
- **`server.ts`**: Server client for Server Components and API routes
- **`middleware.ts`**: Auth middleware for protecting routes and refreshing sessions

The authentication system is fully integrated and used throughout the application.

Still needed for full Supabase integration:

- Type definitions generated from Supabase schema
- Database migrations and schema setup

### Theme System

The theme system is fully implemented:

- Root layout includes `ThemeProvider` with `suppressHydrationWarning`
- `theme-toggle.tsx` and `mode-toggle.tsx` provide sun/moon icon switchers
- Dark mode classes applied via `class` attribute strategy
- CSS variables change based on dark/light mode

## Path Aliases

TypeScript and bundler are configured with these aliases:

```typescript
@/*           → src/*
@/components  → src/components
@/lib/utils   → src/lib/utils
@/lib         → src/lib
@/hooks       → src/hooks
@/ui          → src/components/ui
```

## Common Patterns

### Component File Structure

```tsx
"use client"; // Only if needed

import { ComponentName } from "@/components/ui/component-name";
import { cn } from "@/lib/utils";

export function MyComponent() {
  return <div className="flex flex-col gap-4">{/* Component content */}</div>;
}
```

### Styling Pattern

```tsx
// Use cn() for conditional classes
<div
  className={cn(
    "base-classes",
    "responsive-classes sm:different lg:different",
    condition && "conditional-classes",
    className // Allow className override
  )}
/>
```

### Animation Pattern (Framer Motion)

```tsx
import { motion } from "motion/react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

<motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
  {/* Animated content */}
</motion.div>;
```

### Form Validation Pattern

The project uses **React Hook Form** with **Zod** for type-safe form validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
});
```

API routes also use Zod schemas for server-side validation (see `/api/contact/route.ts`).

### MDX Content Pattern

Blog posts and changelog entries use MDX with frontmatter:

```mdx
---
title: "Your Post Title"
description: "Post description"
date: "2024-01-15"
author:
  name: "Author Name"
  picture: "/blog/authors/author.png"
thumbnail: "/blog/thumbnails/post.png"
tags: ["tag1", "tag2"]
---

# Your Content Here

Regular Markdown content with support for GitHub Flavored Markdown and custom components.
```

Rendering MDX content in Server Components:

```tsx
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";

<MDXRemote
  source={content}
  options={{
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  }}
/>;
```

### Auth Pattern

Using Auth Context in client components:

```tsx
"use client";

import { useAuth } from "@/components/auth/auth-context";

export function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Hello {user.email}</div>;
}
```

Using Supabase in Server Components:

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <div>Hello {user.email}</div>;
}
```

Using Server Actions for auth operations:

```tsx
// In (auth)/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
```

## Important Notes

### Environment Variables

Required variables in `.env.local`:

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://satori.world

# Supabase — Auth & Database
NEXT_PUBLIC_SUPABASE_URL=             # Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= # Anon/public key
SUPABASE_SECRET_KEY=                  # Service role key

# Stripe — Payments
STRIPE_SECRET_KEY=                    # sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=   # pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET=                # whsec_... (from webhook endpoint signing secret)

# Resend — Emails
RESEND_API_KEY=                       # re_...

# GoHighLevel — CRM & Automations
GHL_API_KEY=                          # pit-... (Location API key)
GHL_LOCATION_ID=                      # Location ID

# Optional — Analytics
# NEXT_PUBLIC_POSTHOG_KEY=
# NEXT_PUBLIC_POSTHOG_HOST=
```

**Current state:** All required keys are set both locally (`.env.local`) and on Vercel (production environment). Stripe is in **test mode** — switch to live keys when ready to accept real payments. The Stripe webhook endpoint is configured at `https://satori.world/api/webhooks/stripe` for both snapshot and thin payloads. GHL API key and Location ID are set locally and on Vercel — lead capture, contact form, and Stripe purchase webhook all sync to GoHighLevel.

### Package Manager

This project uses **pnpm**, not npm or yarn. Always use `pnpm install`, `pnpm add`, etc.

### Next.js Version

Using Next.js 16.0.0 which is a canary/experimental version. Be aware of potential API changes and use Next.js 16 documentation.

### React 19

Using React 19.2.0 (stable). Key features:

- `react-jsx` transform (no need to import React)
- Improved Server Components
- New `use` hook
- Actions and form handling

### Tailwind CSS v4 Breaking Changes

If looking up Tailwind documentation or examples:

- Ignore v3 configuration patterns
- CSS-first configuration (not JS config)
- Use `@import "tailwindcss"` not `@tailwind` directives
- Native CSS variable support

## Working with Blog and Changelog

### Adding a New Blog Post

1. Create a new `.mdx` file in `src/content/blog/` with kebab-case filename (e.g., `my-new-post.mdx`)
2. Add required frontmatter:

   ```yaml
   ---
   title: "Your Post Title"
   description: "Brief description for SEO"
   date: "2024-01-15"
   author:
     name: "Author Name"
     picture: "/blog/authors/author.png"
   thumbnail: "/blog/thumbnails/post.png"
   tags: ["nextjs", "react", "tutorial"]
   ---
   ```

3. Write your content in Markdown/MDX below the frontmatter
4. Add author images to `public/blog/authors/`
5. Add thumbnails to `public/blog/thumbnails/`
6. The post will automatically appear on `/blog` sorted by date

### Adding a New Changelog Entry

1. Create a new `.mdx` file in `src/content/changelog/` (e.g., `v1-2-0.mdx`)
2. Add required frontmatter:

   ```yaml
   ---
   version: "v1.2.0"
   title: "Major Feature Release"
   releaseDate: "2024-01-20"
   author:
     name: "Release Manager"
     picture: "/blog/authors/author.png"
   ---
   ```

3. Organize changes by category using headings:

   ```markdown
   ## Added

   - New feature X
   - New feature Y

   ## Fixed

   - Bug fix A
   - Bug fix B

   ## Changed

   - Updated component Z
   ```

4. Entry will automatically appear on `/changelog` sorted by release date

### MDX Content Guidelines

- Use GitHub Flavored Markdown syntax (tables, task lists, etc.)
- Code blocks support syntax highlighting via Shiki
- Images are relative to `public/` directory
- Internal links use Next.js `Link` component patterns
- Headings automatically get slugs for anchor links (via `rehype-slug`)

## Deployment

The project is production-ready for Vercel deployment:

**Vercel Configuration:**

- Next.js 16 with App Router (fully optimized)
- Automatic image optimization
- Edge middleware support
- MDX content statically generated

**Deployment Checklist:**

1. Create Vercel project and connect repository
2. Configure environment variables:
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - Site: `NEXT_PUBLIC_SITE_URL`
   - PostHog (optional): `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
3. Configure Stripe webhook endpoint:
   - Add `https://yourdomain.com/api/webhooks/stripe` in Stripe dashboard
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
4. Update domain references:
   - `src/app/sitemap.ts`: Change `baseUrl` to your domain
   - `src/app/robots.ts`: Change sitemap URL to your domain
5. Test all functionality in production

**Post-Deployment:**

- Monitor Vercel logs for errors
- Test payment flows with Stripe test mode
- Verify webhook events are being received
- Check SEO with sitemap at `/sitemap.xml`
- Test authentication flows

## Extending the Project

This boilerplate is designed to be extended. Follow these architectural patterns:

### Adding New Features

**1. New Dashboard Page**

```typescript
// src/app/(dashboard)/dashboard/analytics/page.tsx
export default async function AnalyticsPage() {
  // Use Supabase server client for data fetching
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  return <AnalyticsContent />;
}
```

**2. New API Route**

```typescript
// src/app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  // Your validation schema
});

export async function POST(req: NextRequest) {
  // Validate request
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Use Supabase for data operations
  const supabase = await createClient();
  // ... your logic

  return NextResponse.json({ success: true });
}
```

**3. New UI Component**

```bash
# Use shadcn/ui CLI for new components
npx shadcn@latest add [component-name]

# Or manually create in src/components/ui/
# Follow existing patterns with TypeScript interfaces
```

**4. Database Changes**

```sql
-- supabase/migrations/[timestamp]_description.sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON new_table FOR SELECT
  USING (auth.uid() = user_id);
```

Then update `src/lib/supabase/types.ts` with new types.

### Architectural Guidelines

**Security:**

- Always validate input with Zod schemas
- Use Row Level Security (RLS) in Supabase
- Verify Stripe webhook signatures
- Never expose secret keys in client code

**Performance:**

- Use Server Components by default
- Add `"use client"` only when needed
- Implement proper loading states
- Optimize images with Next.js Image component

**Code Quality:**

- Write TypeScript interfaces for all data structures
- Follow existing naming conventions (kebab-case for files)
- Add E2E tests for new user-facing features
- Document complex logic with comments

**Styling:**

- Mobile-first responsive design
- Use Tailwind utility classes
- Maintain dark mode support
- Test across all breakpoints

### Common Extension Patterns

**Adding a Subscription Tier:**

1. Update `src/lib/payments/plans.ts`
2. Create corresponding price in Stripe dashboard
3. Update pricing page UI
4. Test checkout flow

**Adding Social Auth Provider:**

1. Enable provider in Supabase dashboard
2. Add provider to `src/components/auth/oauth-buttons.tsx`
3. Test OAuth flow

**Adding Admin Features:**

1. Add admin role to user profiles
2. Create `src/app/(dashboard)/admin/` route group
3. Add role checks in middleware
4. Create admin-specific components

**Internationalization (i18n):**

- Consider next-intl for multi-language support
- Extract strings to translation files
- Add language selector component
- Update metadata for each locale
