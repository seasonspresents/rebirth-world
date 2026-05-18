import { expect, test } from "@playwright/test";
import {
  AUTH_ENV_REQUIREMENT,
  cleanupTestUser,
  hasTestUserCredentials,
  setupAuthenticatedUser,
} from "../helpers/auth";

test.describe("General settings protection", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/settings/general");
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });
});

test.describe("General settings authenticated", () => {
  test.skip(!hasTestUserCredentials(), AUTH_ENV_REQUIREMENT);

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/dashboard/settings/general");
  });

  test.afterEach(async ({ page }) => {
    await cleanupTestUser(page);
  });

  test("shows settings form and navigation", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/settings\/general/);
    await expect(page.locator("form").first()).toBeVisible();
    await expect(
      page
        .locator("a, button")
        .filter({ hasText: /account|billing|notifications/i })
    ).not.toHaveCount(0);
  });
});
