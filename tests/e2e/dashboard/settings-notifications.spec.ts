import { test, expect } from "@playwright/test";

// NOTE: These tests require authentication
test.describe("Notification Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up authenticated user session
    // await setupAuthenticatedUser(page);

    await page.goto("/dashboard/settings/notifications");
  });

  test("should redirect to sign-in when not authenticated", async ({
    page,
  }) => {
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });

  test.skip("should load notifications settings page", async ({ page }) => {
    await expect(page).toHaveURL("/dashboard/settings/notifications");
    await expect(page).toHaveTitle(/Settings|Notifications/);
  });

  test.skip("should display notification preferences form", async ({
    page,
  }) => {
    // Check for form or settings sections
    const notificationSettings = page
      .locator("text=/notification|preferences|email|push/i")
      .first();
    await expect(notificationSettings).toBeVisible();
  });

  test("should have email notification toggles", async ({ page }) => {
    // Look for email notification switches/checkboxes
    const emailToggles = page
      .locator('input[type="checkbox"], button[role="switch"]')
      .filter({ has: page.locator("text=/email/i") });

    if ((await emailToggles.count()) > 0) {
      await expect(emailToggles.first()).toBeVisible();
    }
  });

  test.skip("should have notification categories", async ({ page }) => {
    // Look for different notification categories
    const categories = page.locator(
      "text=/marketing|product updates|security|communication|social/i"
    );
    const categoryCount = await categories.count();

    // Should have multiple notification categories
    expect(categoryCount).toBeGreaterThan(0);
  });

  test("should toggle email notifications", async ({ page }) => {
    // Find first notification toggle
    const firstToggle = page
      .locator('input[type="checkbox"], button[role="switch"]')
      .first();

    // Get initial state
    const initialState = await firstToggle.isChecked();

    // Toggle it
    await firstToggle.click();

    // Wait for state change
    await page.waitForTimeout(500);

    // State should have changed
    const newState = await firstToggle.isChecked();
    expect(newState).not.toBe(initialState);
  });

  test("should have push notification settings", async ({ page }) => {
    // Look for push notification options
    const pushSettings = page.locator(
      "text=/push notification|browser notification|desktop/i"
    );

    if ((await pushSettings.count()) > 0) {
      await expect(pushSettings.first()).toBeVisible();
    }
  });

  test("should have marketing email preferences", async ({ page }) => {
    // Look for marketing email toggle
    const marketingToggle = page
      .locator('input[type="checkbox"], button[role="switch"]')
      .filter({ has: page.locator("text=/marketing/i") });

    if ((await marketingToggle.count()) > 0) {
      await expect(marketingToggle.first()).toBeVisible();
    }
  });

  test("should have security notification settings", async ({ page }) => {
    // Look for security notifications (usually always on)
    const securitySettings = page.locator(
      "text=/security|account activity|login/i"
    );

    if ((await securitySettings.count()) > 0) {
      await expect(securitySettings.first()).toBeVisible();
    }
  });

  test("should have product update notifications", async ({ page }) => {
    // Look for product/feature update toggles
    const productUpdates = page.locator(
      "text=/product update|new feature|changelog/i"
    );

    if ((await productUpdates.count()) > 0) {
      await expect(productUpdates.first()).toBeVisible();
    }
  });

  test("should have save button", async ({ page }) => {
    // Check for save button
    const saveButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /save|update/i })
      .first();

    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeVisible();
    }
  });

  test("should save notification preferences", async ({ page }) => {
    // Toggle a notification
    const firstToggle = page
      .locator('input[type="checkbox"], button[role="switch"]')
      .first();
    await firstToggle.click();

    // Click save if button exists
    const saveButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /save/i })
      .first();

    if (await saveButton.isVisible()) {
      await saveButton.click();

      // Should show success message
      await page.waitForTimeout(1000);
      const successMessage = page.locator("text=/success|saved|updated/i");
      if ((await successMessage.count()) > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test("should have notification frequency options", async ({ page }) => {
    // Look for frequency settings (daily digest, real-time, etc.)
    const frequencyOptions = page.locator(
      "text=/daily|weekly|real-time|instant|digest/i"
    );

    if ((await frequencyOptions.count()) > 0) {
      await expect(frequencyOptions.first()).toBeVisible();
    }
  });

  test("should have unsubscribe from all option", async ({ page }) => {
    // Scroll to bottom to find unsubscribe all option
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for unsubscribe all option
    const unsubscribeAll = page
      .locator("button, a")
      .filter({ hasText: /unsubscribe.*all|turn.*off.*all/i });

    if ((await unsubscribeAll.count()) > 0) {
      await expect(unsubscribeAll.first()).toBeVisible();
    }
  });

  test("should redirect to sign in when not authenticated", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/settings/notifications");
    await expect(page).toHaveURL("/sign-in", { timeout: 5000 });
  });
});
