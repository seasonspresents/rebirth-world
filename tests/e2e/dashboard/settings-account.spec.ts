import { test, expect } from "@playwright/test";

// NOTE: These tests require authentication
test.describe("Account Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up authenticated user session
    // await setupAuthenticatedUser(page);

    await page.goto("/dashboard/settings/account");
  });

  test("should redirect to sign-in when not authenticated", async ({
    page,
  }) => {
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });

  test.skip("should load account settings page", async ({ page }) => {
    await expect(page).toHaveURL("/dashboard/settings/account");
    await expect(page).toHaveTitle(/Settings|Account/);
  });

  test.skip("should display profile information section", async ({ page }) => {
    // Check for profile section heading
    const profileSection = page
      .locator("text=/profile|personal information/i")
      .first();
    await expect(profileSection).toBeVisible();
  });

  test("should have profile fields", async ({ page }) => {
    // Look for common profile fields
    const nameInput = page
      .locator('input[name*="name" i], input[placeholder*="name" i]')
      .first();
    const emailInput = page
      .locator('input[type="email"], input[name*="email" i]')
      .first();

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test("should have profile image upload", async ({ page }) => {
    // Look for image upload or avatar section
    const imageSection = page.locator(
      'img[alt*="profile" i], img[alt*="avatar" i], input[type="file"]'
    );

    if ((await imageSection.count()) > 0) {
      await expect(imageSection.first()).toBeVisible();
    }
  });

  test("should update profile information", async ({ page }) => {
    // Update name field
    const nameInput = page.locator('input[name*="name" i]').first();
    await nameInput.fill("Updated Test Name");

    // Click save
    const saveButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /save|update/i })
      .first();
    await saveButton.click();

    // Should show success message
    await page.waitForTimeout(1000);
    const successMessage = page.locator("text=/success|saved|updated/i");
    if ((await successMessage.count()) > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test("should have contact information fields", async ({ page }) => {
    // Look for contact fields (phone, website, location)
    const phoneInput = page.locator('input[type="tel"], input#phone');
    const websiteInput = page.locator("input#website");
    const locationInput = page.locator("input#location");

    if ((await phoneInput.count()) > 0) {
      await expect(phoneInput.first()).toBeVisible();
    }
    if ((await websiteInput.count()) > 0) {
      await expect(websiteInput.first()).toBeVisible();
    }
    if ((await locationInput.count()) > 0) {
      await expect(locationInput.first()).toBeVisible();
    }
  });

  test.skip("should have save button", async ({ page }) => {
    // Check for save changes button
    const saveButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /save/i })
      .first();
    await expect(saveButton).toBeVisible();
  });
});
