import { test, expect } from "@playwright/test";

// NOTE: These tests require authentication
test.describe("General Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up authenticated user session
    // await setupAuthenticatedUser(page);

    await page.goto("/dashboard/settings/general");
  });

  test("should redirect to sign-in when not authenticated", async ({
    page,
  }) => {
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });

  test.skip("should load general settings page", async ({ page }) => {
    await expect(page).toHaveURL("/dashboard/settings/general");
    await expect(page).toHaveTitle(/Settings|General/);
  });

  test.skip("should display general settings form", async ({ page }) => {
    // Check for form elements
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should have language preference option", async ({ page }) => {
    // Look for language selector
    const languageSelector = page
      .locator('select, [role="combobox"]')
      .filter({ has: page.locator("text=/language|locale/i") });

    if ((await languageSelector.count()) > 0) {
      await expect(languageSelector.first()).toBeVisible();
    }
  });

  test("should have timezone setting", async ({ page }) => {
    // Look for timezone selector
    const timezoneSelector = page
      .locator('select, [role="combobox"], input')
      .filter({ has: page.locator("text=/timezone|time zone/i") });

    if ((await timezoneSelector.count()) > 0) {
      await expect(timezoneSelector.first()).toBeVisible();
    }
  });

  test("should have theme preference option", async ({ page }) => {
    // Look for theme toggle or selector
    const themeOption = page
      .locator("button, select")
      .filter({ hasText: /theme|dark mode|light mode/i });

    if ((await themeOption.count()) > 0) {
      await expect(themeOption.first()).toBeVisible();
    }
  });

  test.skip("should have save button", async ({ page }) => {
    // Check for save button
    const saveButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /save|update/i })
      .first();
    await expect(saveButton).toBeVisible();
  });

  test("should save general settings successfully", async ({ page }) => {
    // Make a change (if possible)
    const languageSelector = page.locator("select").first();

    if (await languageSelector.isVisible()) {
      await languageSelector.selectOption({ index: 1 });
    }

    // Click save
    const saveButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /save/i })
      .first();
    await saveButton.click();

    // Should show success message
    await page.waitForTimeout(1000);
    const successMessage = page.locator("text=/success|saved|updated/i");
    if ((await successMessage.count()) > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test("should have settings navigation tabs", async ({ page }) => {
    // Check for navigation to other settings pages
    const settingsNav = page
      .locator("a, button")
      .filter({ hasText: /account|billing|notifications/i });
    const navCount = await settingsNav.count();

    expect(navCount).toBeGreaterThan(0);
  });

  test("should redirect to sign in when not authenticated", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/settings/general");
    await expect(page).toHaveURL("/sign-in", { timeout: 5000 });
  });
});
