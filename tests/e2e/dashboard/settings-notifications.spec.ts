import { expect, test } from "@playwright/test";
import {
  AUTH_ENV_REQUIREMENT,
  cleanupTestUser,
  hasTestUserCredentials,
  setupAuthenticatedUser,
} from "../helpers/auth";

test.describe("Notification settings protection", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/settings/notifications");
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });
});

test.describe("Notification settings authenticated", () => {
  test.skip(!hasTestUserCredentials(), AUTH_ENV_REQUIREMENT);

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/dashboard/settings/notifications");
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestUser(page);
  });

  test("shows notification controls", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/settings\/notifications/);
    await expect(
      page.locator('input[type="checkbox"], button[role="switch"]').first()
    ).toBeVisible();
  });
});
