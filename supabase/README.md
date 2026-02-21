# Supabase Database Setup

This directory contains the database migrations for the Sabo project.

## Quick Setup

### Option 1: Using Supabase Dashboard (Recommended for Quick Start)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `migrations/20240101000000_create_user_profiles.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration to your database
supabase db push
```

### Option 3: Using MCP Tools (If Available)

If you have Supabase MCP tools configured in your Cursor IDE:

1. The `mcp_supabase_apply_migration` tool can be used
2. Or run migrations directly through the MCP interface

## What This Migration Creates

### Tables

1. **`user_profiles`** - Stores user profile information
   - Basic info: username, full_name, bio, profile_image_url
   - Contact: phone, website, location, birth_date
   - Preferences: language, timezone
   - Privacy: is_private, email_notifications, marketing_emails
   - Notifications: push_notifications, communication_emails, social_emails, security_emails

2. **`user_subscriptions`** - Stores Stripe subscription data
   - Subscription details and status
   - Billing cycle information
   - Trial and cancellation data

3. **`payment_history`** - Stores payment records
   - Payment amounts and status
   - Invoice URLs
   - Transaction history

### Storage Buckets

- **`profile-images`** - Stores user profile images (public bucket)

### Security

All tables have Row Level Security (RLS) enabled with policies that:

- Allow users to read/write only their own data
- Prevent unauthorized access
- Support profile image uploads with proper folder structure

## Verification

After running the migration, verify it worked by:

1. Go to **Table Editor** in Supabase dashboard
2. Check that these tables exist:
   - `user_profiles`
   - `user_subscriptions`
   - `payment_history`

3. Go to **Storage** in Supabase dashboard
4. Check that `profile-images` bucket exists

## Troubleshooting

### Error: "relation already exists"

- The tables already exist. You can skip the migration or drop the tables first (be careful with production data!)

### Error: "permission denied"

- Make sure you're using the correct service role key or have admin access to the database

### Error: "auth.users does not exist"

- Your Supabase project might not be fully initialized. Wait a few moments and try again.

## Next Steps

After running the migration:

1. Update your `.env.local` file with Supabase credentials:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Restart your Next.js development server:

   ```bash
   pnpm dev
   ```

3. The settings pages should now work without errors!
