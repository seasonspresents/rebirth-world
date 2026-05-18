import { expect, test } from "@playwright/test";
import {
  AUTH_ENV_REQUIREMENT,
  cleanupTestUser,
  hasTestUserCredentials,
  setupAuthenticatedUser,
} from "../helpers/auth";

test.describe("Dashboard protection", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });
});

test.describe("Dashboard authenticated", () => {
  test.skip(!hasTestUserCredentials(), AUTH_ENV_REQUIREMENT);

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/dashboard");
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestUser(page);
  });

  test("loads dashboard content and navigation", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator("nav, aside").first()).toBeVisible();
    await expect(
      page.locator("section, article, [class*='card']").first()
    ).toBeVisible();
  });

  test("navigates to settings", async ({ page }) => {
    await page.locator('a[href*="/dashboard/settings"]').first().click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
  });
});
