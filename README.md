# Sabo - Next.js SaaS Boilerplate

A production-ready **Next.js 16 SaaS boilerplate** with authentication, payments, and analytics built-in. Ship your SaaS faster with a modern, type-safe foundation.

**Documentation: [https://docs.getsabo.com](https://docs.getsabo.com)**

## Features

- **Authentication** with Supabase (email/password, OAuth, email verification)
- **Payments** with Stripe (subscriptions, customer portal, webhooks)
- **Dashboard** with sidebar layout and settings pages
- **Marketing site** with hero, features, pricing, testimonials, and FAQ sections
- **Blog system** with MDX content and tag filtering
- **Changelog system** with version tracking
- **SEO optimized** with sitemap, robots.txt, and metadata
- **Analytics** with PostHog (optional activation)
- **Dark mode** with next-themes
- **Responsive design** with mobile-first approach
- **Type-safe** with TypeScript throughout
- **Testing** with Playwright (E2E tests included)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router and React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Magic UI](https://magicui.design/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)
- **Analytics**: [PostHog](https://posthog.com/)
- **Content**: MDX with [next-mdx-remote-client](https://www.npmjs.com/package/next-mdx-remote-client)
- **Forms**: React Hook Form + Zod
- **Testing**: [Playwright](https://playwright.dev/)

## Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd sabo

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

# Stripe (fully implemented, get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# PostHog (optional, fully configured, get from https://posthog.com)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Setting Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the database migration:

```bash
# Install Supabase CLI
pnpm add -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

4. In Supabase Dashboard, go to **Authentication → URL Configuration** and add:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

## Setting Up Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from the Stripe Dashboard
3. Create your products and prices in Stripe Dashboard
4. Update product IDs in `src/config/pricing.ts`
5. Set up webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Testing Payments

Use Stripe's test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiration**: Any future date
- **CVC**: Any 3 digits

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard area
│   ├── (marketing)/       # Public marketing pages
│   ├── blog/              # Blog system
│   ├── changelog/         # Changelog system
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── marketing/        # Marketing components
│   └── shared/           # Shared components
├── lib/                  # Library code
│   ├── supabase/         # Supabase client
│   ├── stripe/           # Stripe integration
│   └── email/            # Email templates
├── hooks/                # Custom React hooks
├── config/               # Configuration files
├── types/                # TypeScript types
└── content/              # MDX content (blog, changelog)
```

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler

# Testing
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run tests in UI mode
```

## Deploying to Production

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy

### 2. Set Up Production Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret and add it to Vercel environment variables

### 3. Update Supabase URLs

In Supabase Dashboard → Authentication → URL Configuration:

- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback`

## Documentation

For detailed documentation on customization, deployment, and advanced features, visit:

**[https://docs.getsabo.com](https://docs.getsabo.com)**

Topics covered:

- Complete setup guide
- Component architecture
- Authentication flows
- Payment integration
- Content management (blog & changelog)
- API routes
- Database schema
- Testing
- Deployment
- Troubleshooting
