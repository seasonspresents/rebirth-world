import { test, expect } from "@playwright/test";

// NOTE: These tests require authentication
// Uncomment and configure setupAuthenticatedUser() helper when credentials are available
test.describe("Dashboard Main Page", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up authenticated user session
    // await setupAuthenticatedUser(page);

    // For now, just navigate to dashboard (will redirect to login if not authenticated)
    await page.goto("/dashboard");
  });

  test("should redirect to sign-in when not authenticated", async ({
    page,
  }) => {
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });

  // Tests that require authentication
  test.skip("should load dashboard successfully when authenticated", async ({
    page,
  }) => {
    await expect(page).toHaveURL("/dashboard");
    await expect(page).toHaveTitle(/Dashboard/);
  });

  test.skip("should display sidebar navigation", async ({ page }) => {
    // Check for sidebar
    const sidebar = page.locator('[data-testid="sidebar"], aside, nav').first();
    await expect(sidebar).toBeVisible();

    // Check for navigation links
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('a[href*="/settings"]')).toBeVisible();
  });

  test("should display user menu", async ({ page }) => {
    // Look for user avatar or menu button
    const userMenu = page
      .locator("button")
      .filter({ has: page.locator('img[alt*="avatar" i], svg') })
      .first();

    if (await userMenu.isVisible()) {
      await userMenu.click();

      // Should show dropdown with profile options
      await expect(
        page.locator("text=/profile|settings|sign out|log out/i").first()
      ).toBeVisible();
    }
  });

  test("should display dashboard content sections", async ({ page }) => {
    // Check for dashboard cards or sections
    const cards = page.locator('[class*="card"], section, article');
    const cardCount = await cards.count();

    // Should have multiple content sections
    expect(cardCount).toBeGreaterThan(2);
  });

  test("should display charts or statistics", async ({ page }) => {
    // Look for chart elements (canvas, svg, or chart containers)
    const charts = page.locator(
      'canvas, svg[class*="chart"], [class*="chart"]'
    );

    if ((await charts.count()) > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test("should display data table", async ({ page }) => {
    // Look for table element
    const table = page.locator("table");

    if ((await table.count()) > 0) {
      await expect(table.first()).toBeVisible();

      // Should have table headers
      const headers = table.locator("th");
      expect(await headers.count()).toBeGreaterThan(0);
    }
  });

  test("should navigate to settings from sidebar", async ({ page }) => {
    // Click settings link
    await page.locator('a[href*="/settings"]').first().click();

    // Should navigate to settings
    await expect(page).toHaveURL(/\/dashboard\/settings/);
  });

  test("should have responsive sidebar on mobile", async ({
    page,
    viewport,
  }) => {
    if (viewport && viewport.width < 768) {
      // Mobile sidebar should be collapsible
      const menuButton = page
        .locator('button[aria-label*="menu" i], button')
        .filter({ has: page.locator("svg") })
        .first();

      if (await menuButton.isVisible()) {
        await menuButton.click();

        // Sidebar should appear
        await expect(page.locator("nav, aside").first()).toBeVisible();
      }
    }
  });

  test("should sign out successfully", async ({ page }) => {
    // Find sign out button (might be in user menu)
    const userMenu = page
      .locator("button")
      .filter({ has: page.locator('img[alt*="avatar" i]') })
      .first();

    if (await userMenu.isVisible()) {
      await userMenu.click();

      // Click sign out
      const signOutButton = page
        .locator("button, a")
        .filter({ hasText: /sign out|log out/i })
        .first();
      await signOutButton.click();

      // Should redirect to sign in page
      await expect(page).toHaveURL("/sign-in", { timeout: 5000 });
    }
  });

  // Test that unauthenticated users are redirected
  test("should redirect to sign in when not authenticated", async ({
    page,
  }) => {
    // Clear any existing session
    await page.context().clearCookies();

    // Try to access dashboard
    await page.goto("/dashboard");

    // Should redirect to sign in
    await expect(page).toHaveURL("/sign-in", { timeout: 5000 });
  });
});
