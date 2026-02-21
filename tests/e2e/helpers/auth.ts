import { Page } from "@playwright/test";

/**
 * Authentication Helper for E2E Tests
 *
 * This file contains utilities for setting up authenticated user sessions
 * in Playwright tests.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a test user in your Supabase database
 * 2. Add credentials to .env.test file:
 *    - TEST_USER_EMAIL=test@example.com
 *    - TEST_USER_PASSWORD=your_secure_password
 * 3. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * 4. Uncomment the implementation below and update as needed
 */

/**
 * Set up an authenticated user session for testing
 *
 * This function logs in a test user and establishes their session
 * so that protected routes can be accessed in tests.
 *
 * Usage:
 * ```typescript
 * test.beforeEach(async ({ page }) => {
 *   await setupAuthenticatedUser(page);
 *   await page.goto('/dashboard');
 * });
 * ```
 */
export async function setupAuthenticatedUser(page: Page): Promise<void> {
  // Method 1: Direct Supabase API call (faster, recommended)
  // This method uses Supabase client to establish session directly

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_USER_EMAIL!,
    password: process.env.TEST_USER_PASSWORD!,
  });

  if (error) {
    throw new Error(`Failed to authenticate test user: ${error.message}`);
  }

  // Set session cookies in the browser
  await page.context().addCookies([
    {
      name: "sb-access-token",
      value: data.session.access_token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
    {
      name: "sb-refresh-token",
      value: data.session.refresh_token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // Method 2: UI-based login (slower, but tests the actual UI)
  // This method goes through the sign-in page
  //
  // await page.goto('/sign-in');
  // await page.locator('input[type="email"]').fill(process.env.TEST_USER_EMAIL!);
  // await page.locator('input[type="password"]').fill(process.env.TEST_USER_PASSWORD!);
  // await page.locator('button[type="submit"]').click();
  // await page.waitForURL('/dashboard', { timeout: 10000 });

  console.warn(
    "setupAuthenticatedUser is not implemented yet. Add test credentials to .env.test and uncomment the implementation."
  );
}

/**
 * Clean up test user data after tests
 *
 * This function removes any data created during tests to ensure
 * test isolation and repeatability.
 *
 * Usage:
 * ```typescript
 * test.afterEach(async ({ page }) => {
 *   await cleanupTestUser();
 * });
 * ```
 */
export async function cleanupTestUser(): Promise<void> {
  // TODO: Implement cleanup logic if needed
  //
  // Examples:
  // - Delete test data created during tests
  // - Reset user preferences
  // - Clear uploaded files
  // - Sign out

  // Sign out (optional - test isolation via browser contexts usually handles this)
  // await page.goto('/dashboard');
  // await page.locator('[data-testid="user-menu"]').click();
  // await page.locator('text=Sign Out').click();

  console.warn("cleanupTestUser is not implemented yet.");
}

/**
 * Create a test user programmatically
 *
 * This function creates a new test user in the database.
 * Useful for testing registration flows or user-specific features.
 *
 * @returns User data
 */
export async function createTestUser(): Promise<{ id: string; email: string }> {
  // TODO: Implement user creation
  //
  // const { createClient } = await import('@supabase/supabase-js');
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for admin operations
  // );
  //
  // const { data, error } = await supabase.auth.admin.createUser({
  //   email,
  //   password,
  //   email_confirm: true, // Skip email confirmation in tests
  // });
  //
  // if (error) {
  //   throw new Error(`Failed to create test user: ${error.message}`);
  // }
  //
  // return data.user;

  throw new Error("createTestUser is not implemented yet");
}

/**
 * Delete a test user programmatically
 *
 * This function removes a test user from the database.
 * Use this in test cleanup to remove users created during tests.
 */
export async function deleteTestUser(): Promise<void> {
  // TODO: Implement user deletion
  //
  // const { createClient } = await import('@supabase/supabase-js');
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for admin operations
  // );
  //
  // const { error } = await supabase.auth.admin.deleteUser(userId);
  //
  // if (error) {
  //   throw new Error(`Failed to delete test user: ${error.message}`);
  // }

  throw new Error("deleteTestUser is not implemented yet");
}

/**
 * Check if user is authenticated
 *
 * This function verifies that a user session is active.
 *
 * @param page - Playwright page object
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check if user is redirected to dashboard (simple approach)
  await page.goto("/dashboard");
  await page.waitForTimeout(1000);

  const url = page.url();
  return url.includes("/dashboard") && !url.includes("/sign-in");
}
