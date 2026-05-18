import { expect, test } from "@playwright/test";
import {
  AUTH_ENV_REQUIREMENT,
  cleanupTestUser,
  hasTestUserCredentials,
  setupAuthenticatedUser,
} from "../helpers/auth";

test.describe("Account settings protection", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/settings/account");
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });
});

test.describe("Account settings authenticated", () => {
  test.skip(!hasTestUserCredentials(), AUTH_ENV_REQUIREMENT);

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/dashboard/settings/account");
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestUser(page);
  });

  test("shows profile fields and save action", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/settings\/account/);
    await expect(
      page
        .locator('input[name*="name" i], input[placeholder*="name" i]')
        .first()
    ).toBeVisible();
    await expect(
      page.locator('input[type="email"], input[name*="email" i]').first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /save|update/i }).first()
    ).toBeVisible();
  });
});
