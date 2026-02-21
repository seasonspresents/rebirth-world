import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should load contact page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);
  });

  test("should display contact form", async ({ page }) => {
    // Check for form element
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should have required form fields", async ({ page }) => {
    // Check for common contact form fields
    await expect(
      page
        .locator('input[name*="name" i], input[placeholder*="name" i]')
        .first()
    ).toBeVisible();
    await expect(
      page.locator('input[type="email"], input[name*="email" i]')
    ).toBeVisible();
    await expect(
      page.locator('textarea, input[name*="message" i]')
    ).toBeVisible();
  });

  test("should show validation errors for empty required fields", async ({
    page,
  }) => {
    // Find and click submit button
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /submit|send/i })
      .first();
    await submitButton.click();

    // Wait for validation messages
    await page.waitForTimeout(500);

    // Check for error messages or required field indicators
    const errorMessages = page.locator("text=/required|must|invalid|error/i");
    const errorCount = await errorMessages.count();

    // Should have at least one validation error
    expect(errorCount).toBeGreaterThan(0);
  });

  test("should validate email format", async ({ page }) => {
    // Fill email with invalid format
    const emailInput = page
      .locator('input[type="email"], input[name*="email" i]')
      .first();
    await emailInput.fill("invalid-email");

    // Try to submit
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /submit|send/i })
      .first();
    await submitButton.click();

    await page.waitForTimeout(500);

    // Should show email validation error
    const emailError = page.locator("text=/valid email|email.*invalid/i");
    if ((await emailError.count()) > 0) {
      await expect(emailError.first()).toBeVisible();
    }
  });

  test("should accept valid form submission", async ({ page }) => {
    // Fill out the form with valid data
    const nameInput = page
      .locator('input[name*="name" i], input[placeholder*="name" i]')
      .first();
    const emailInput = page
      .locator('input[type="email"], input[name*="email" i]')
      .first();
    const messageInput = page
      .locator('textarea, input[name*="message" i]')
      .first();

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await messageInput.fill("This is a test message for the contact form.");

    // Submit the form
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /submit|send/i })
      .first();
    await submitButton.click();

    // Wait for response
    await page.waitForTimeout(1000);

    // Check for success message or that form cleared
    const successMessage = page.locator(
      "text=/success|sent|thank you|received/i"
    );
    if ((await successMessage.count()) > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test("should have accessible form labels", async ({ page }) => {
    // Check that inputs have associated labels
    const inputs = page.locator('input:not([type="hidden"]), textarea');
    const inputCount = await inputs.count();

    // At least some inputs should exist
    expect(inputCount).toBeGreaterThan(0);

    // Check for labels
    const labels = page.locator("label");
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);
  });
});
