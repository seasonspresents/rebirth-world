# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Project Overview

**Sabo** is a production-ready Next.js SaaS boilerplate built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. The project is **fully implemented** and serves as a foundation for building SaaS applications.

**Core Features:**

- **Authentication system** with Supabase (sign-in, sign-up, OAuth, password reset, email confirmation)
- **Dashboard** with sidebar layout and settings pages (general, account, billing, notifications)
- **Marketing site** with homepage sections (hero, features, pricing, testimonials, FAQ, CTA)
- **Blog system** with MDX content and tag filtering
- **Changelog system** with version tracking
- **Legal pages** (Privacy Policy, Terms of Service, Cookie Policy)
- **Payment processing** with Stripe (webhooks fully implemented)
- **E2E testing** with Playwright
- **SEO optimization** (sitemap, robots.txt)

**This document serves as an architectural guide for maintaining code quality and consistency when adding new features.**

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

- **shadcn/ui** (New York style) - 70+ components
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
- **Chart.js** - Data visualization

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
- **Stripe** - Payment processing with full webhook implementation
  - Checkout sessions, customer portal, subscription management
  - Webhooks handle all subscription lifecycle events
- **PostHog** - Analytics (provider configured, requires environment variables to activate)

## Project Architecture

### Route Structure

The app uses Next.js App Router with **route groups** for organization:

```text
src/app/
├── (auth)/           # ✅ Authentication pages
│   ├── actions.ts    # Server actions for auth
│   ├── sign-in/      # Login + email confirmation
│   ├── sign-up/      # Registration + email confirmation
│   ├── forgot-password/
│   └── reset-password/
│
├── (dashboard)/      # ✅ Protected dashboard area
│   └── dashboard/
│       ├── page.tsx  # Dashboard main
│       ├── layout.tsx # Sidebar layout
│       └── settings/
│           ├── general/
│           ├── account/
│           ├── billing/
│           └── notifications/
│
├── (marketing)/      # ✅ Public marketing pages
│   ├── page.tsx      # Homepage
│   ├── pricing/
│   └── contact/
│
├── (legal)/          # ✅ Legal pages
│   ├── privacy/
│   ├── terms-of-service/
│   └── cookie-policy/
│
├── blog/             # ✅ Blog system with MDX
│   ├── page.tsx
│   ├── [slug]/
│   └── blog-client.tsx
│
├── changelog/        # ✅ Changelog system with MDX
│   ├── page.tsx
│   └── [slug]/
│
├── api/              # API routes
│   ├── contact/route.ts           # Contact form endpoint
│   ├── auth/callback/route.ts     # Supabase auth callback
│   ├── checkout_sessions/route.ts # Stripe checkout
│   ├── customer_portal/route.ts   # Stripe customer portal
│   └── webhooks/stripe/route.ts   # Stripe webhooks (full implementation)
│
├── layout.tsx        # Root layout with ThemeProvider
└── not-found.tsx     # Custom 404 page
```

**Important**: Route groups like `(auth)`, `(dashboard)`, `(marketing)`, and `(legal)` are organizational only—they don't affect URL structure. The URL for `(marketing)/page.tsx` is just `/`, not `/marketing`.

### API Routes

All API routes follow REST conventions and include proper error handling, validation, and type safety.

- **`/api/contact`** (POST) - Contact form submission
  - Validates form data with Zod schema (firstName, lastName, email, company, message)
  - Returns 400 for validation errors, 200 for success
  - Returns 405 for non-POST methods

- **`/api/auth/callback`** (GET) - Supabase authentication callback
  - Handles OAuth provider redirects
  - Exchanges authorization code for session

- **`/api/checkout_sessions`** (POST) - Stripe checkout session creation
  - Creates a new Stripe Checkout session for subscriptions
  - Handles price selection and success/cancel URLs

- **`/api/customer_portal`** (POST) - Stripe customer portal
  - Creates a portal session for subscription management
  - Allows users to manage payment methods and billing

- **`/api/webhooks/stripe`** (POST) - Stripe webhook handler
  - Handles all subscription lifecycle events (created, updated, deleted)
  - Updates user subscription status in Supabase
  - Records payment history
  - Includes signature verification for security

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
│   ├── app-sidebar.tsx
│   ├── nav-main.tsx, nav-user.tsx, nav-projects.tsx
│   ├── header-user-menu.tsx
│   ├── notifications-dropdown.tsx
│   ├── team-switcher.tsx
│   ├── chart-area-interactive.tsx
│   ├── data-table.tsx
│   └── section-cards.tsx
│
├── marketing/        # ✅ Marketing components (all implemented)
│   ├── hero.tsx
│   ├── features-bento-grid.tsx
│   ├── features-grid.tsx
│   ├── features-accordion.tsx
│   ├── social-proof.tsx
│   ├── pricing.tsx
│   ├── testimonials.tsx
│   ├── faq.tsx
│   ├── cta.tsx
│   └── contact-form.tsx
│
├── shared/           # ✅ Shared layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── mobile-nav.tsx
│   ├── logo.tsx
│   ├── theme-toggle.tsx
│   └── mode-toggle.tsx
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
│   ├── middleware.ts # Auth middleware
│   └── types.ts      # Database types (UserProfile, UserSubscription, PaymentHistory)
│
├── payments/         # Stripe integration
│   ├── stripe.ts     # Stripe client configuration
│   ├── plans.ts      # Plan definitions and pricing
│   └── checkout.ts   # Checkout utilities
│
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
- **Fonts**: Geist Sans and Geist Mono from `next/font/google`
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

# Run tests in UI mode
pnpm test:e2e:ui

# Run tests in headed mode (browser visible)
pnpm test:e2e:headed

# Debug tests
pnpm test:e2e:debug

# View test report
pnpm test:e2e:report
```

**Test Coverage:**

- Authentication flows (sign-in, sign-up, password reset)
- Dashboard pages and settings
- Blog and changelog functionality
- Marketing pages (homepage, pricing, contact)
- Legal pages

When adding new features, write corresponding E2E tests following the existing patterns in `tests/e2e/`.

## Key Architectural Decisions

### MDX-Based Content Management

The project implements a file-based content management system using MDX files stored in `src/content/`:

- **Blog posts** (`src/content/blog/*.mdx`): Frontmatter includes title, description, date, author, thumbnail, and tags
- **Changelog entries** (`src/content/changelog/*.mdx`): Frontmatter includes version, title, releaseDate, author, and image
- **Legal documents** (`src/content/legal/*.mdx`): Static legal pages rendered from MDX

Content is parsed using `gray-matter` for frontmatter extraction and rendered using `next-mdx-remote-client` with Server Components. This approach provides:

- **Type-safe content**: TypeScript interfaces for all content types
- **Build-time rendering**: Content is statically generated at build time
- **Rich formatting**: Full MDX support with remark/rehype plugins for GFM, syntax highlighting
- **SEO optimization**: Automatic metadata generation from frontmatter

### Supabase Configuration

The `src/lib/supabase/` directory contains configured Supabase clients:

- **`client.ts`**: Browser client using `@supabase/ssr` for client components
- **`server.ts`**: Server client for Server Components and API routes
- **`middleware.ts`**: Auth middleware for protecting routes

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

## Important Notes

### Environment Variables

The `.env.example` file includes variables for integrations:

```bash
# Supabase - Database and authentication
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Stripe - Payment processing (fully implemented)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# PostHog - Analytics (optional, fully configured)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

**Note**: All integrations are fully implemented. Supabase and Stripe are used throughout the app. PostHog is optional and requires environment variables to activate.

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

The project is configured for Vercel deployment:

- Uses Next.js which is Vercel's framework
- App Router structure is Vercel-optimized
- Image optimization works out of the box
- Environment variables should be set in Vercel dashboard
- MDX content is statically generated at build time

**Deployment Checklist:**

1. Set all environment variables in Vercel dashboard
2. Configure Stripe webhook endpoint in Stripe dashboard
3. Set up Supabase project and add credentials
4. Configure PostHog (optional) for analytics
5. Update `baseUrl` in `sitemap.ts` and `robots.ts` to your domain

## Extending the Project

When adding new features to this boilerplate, follow these guidelines:

### Adding New Pages

1. **Marketing pages**: Add to `src/app/(marketing)/`
2. **Dashboard pages**: Add to `src/app/(dashboard)/dashboard/`
3. **Auth pages**: Add to `src/app/(auth)/`
4. Always include proper metadata exports for SEO

### Adding New API Routes

1. Create in `src/app/api/` with `route.ts` naming
2. Use Zod for request validation
3. Include proper error handling and status codes
4. Add TypeScript types for request/response
5. Consider security (authentication, rate limiting)

### Adding New Components

1. **UI components**: Add to `src/components/ui/` (use shadcn/ui CLI)
2. **Feature components**: Group by feature in `src/components/[feature]/`
3. Always use TypeScript interfaces for props
4. Use `"use client"` directive only when necessary
5. Follow existing naming conventions (kebab-case)

### Database Changes

1. Create migration in `supabase/migrations/`
2. Update types in `src/lib/supabase/types.ts`
3. Test locally with Supabase CLI
4. Apply migrations to production carefully

### Styling Guidelines

1. Use Tailwind CSS utility classes
2. Follow mobile-first responsive design
3. Use `cn()` utility for conditional classes
4. Maintain dark mode support
5. Test across all breakpoints (mobile, tablet, desktop)

### Testing New Features

1. Write E2E tests in `tests/e2e/`
2. Follow existing test patterns
3. Test authentication flows if applicable
4. Test responsive behavior
5. Run tests before deployment
