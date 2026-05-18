import { expect, Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

export interface TestUserCredentials {
  email: string;
  password: string;
}

export const AUTH_ENV_REQUIREMENT =
  "Set TEST_USER_EMAIL and TEST_USER_PASSWORD for authenticated Playwright specs.";

export function hasTestUserCredentials() {
  return Boolean(process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD);
}

export function getTestUserCredentials(): TestUserCredentials {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(AUTH_ENV_REQUIREMENT);
  }

  return { email, password };
}

export function hasSupabaseAdminEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
  );
}

function getAdminSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY
  ) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY for test-user admin operations."
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );
}

export async function setupAuthenticatedUser(page: Page): Promise<void> {
  const { email, password } = getTestUserCredentials();

  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill(email);
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page).toHaveURL(/\/sign-in\/confirm/);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
}

export async function cleanupTestUser(page?: Page): Promise<void> {
  if (!page) return;

  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export async function createTestUser(
  overrides: Partial<TestUserCredentials> = {}
): Promise<{ id: string; email: string }> {
  const timestamp = Date.now();
  const email = overrides.email || `rebirth-e2e+${timestamp}@example.com`;
  const password =
    overrides.password ||
    process.env.TEST_USER_PASSWORD ||
    `RebirthE2E-${timestamp}!`;
  const supabase = getAdminSupabase();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user?.id) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  return { id: data.user.id, email };
}

export async function deleteTestUser(
  userId = process.env.TEST_USER_ID
): Promise<void> {
  if (!userId) {
    throw new Error(
      "Pass a userId or set TEST_USER_ID before deleting a test user."
    );
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete test user: ${error.message}`);
  }
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  await page.goto("/dashboard");
  await page.waitForURL(/\/(dashboard|sign-in)/, { timeout: 5000 });

  return new URL(page.url()).pathname.startsWith("/dashboard");
}
