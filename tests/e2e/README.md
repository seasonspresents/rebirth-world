# Rebirth E2E Test Setup

## Authenticated Specs

Dashboard and settings specs always run unauthenticated redirect checks. The
authenticated checks run when these variables are set:

```bash
TEST_USER_EMAIL=rebirth-e2e@example.com
TEST_USER_PASSWORD=your-test-password
```

Use a dedicated Supabase test user. Do not use a real customer/admin account.

## Test User Admin Helpers

`tests/e2e/helpers/auth.ts` can create and delete test users when Supabase admin
env is present:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
TEST_USER_ID=...
```

Mutation tests that create users, send reset emails, or change passwords stay
skipped unless explicitly enabled:

```bash
RUN_SUPABASE_MUTATION_TESTS=1
```

For local runs against an already running app:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3011 PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/e2e/dashboard tests/e2e/auth --project=chromium
```
