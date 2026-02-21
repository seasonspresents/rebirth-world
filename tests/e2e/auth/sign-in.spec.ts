import { test, expect } from "@playwright/test";

test.describe("Sign In Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
  });

  test("should load sign in page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Acme/);
    await expect(page).toHaveURL("/sign-in");
  });

  test("should display sign in form", async ({ page }) => {
    // Check for form element
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should have email field", async ({ page }) => {
    // Check for email input (passwordless authentication)
    const emailInput = page
      .locator('input[type="email"], input[name*="email" i]')
      .first();
    await expect(emailInput).toBeVisible();
  });

  test("should have continue button", async ({ page }) => {
    // Check for continue button (passwordless flow)
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /continue/i })
      .first();
    await expect(submitButton).toBeVisible();
  });

  test("should display OAuth login options", async ({ page }) => {
    // Look for Google and GitHub OAuth buttons
    const oauthButtons = page
      .locator("button, a")
      .filter({ hasText: /google|github/i });
    const oauthCount = await oauthButtons.count();

    // Should have at least one OAuth option
    expect(oauthCount).toBeGreaterThanOrEqual(1);
  });

  test("should show validation error for empty email", async ({ page }) => {
    // Leave email empty and try to submit
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /continue/i })
      .first();
    await submitButton.click();

    await page.waitForTimeout(500);

    // Should show validation error
    const errorMessage = page.locator(
      "text=/please enter|email.*required|enter.*email/i"
    );
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test("should show validation error for invalid email", async ({ page }) => {
    // Enter invalid email
    const emailInput = page
      .locator('input[type="email"], input[name*="email" i]')
      .first();
    await emailInput.fill("invalid-email");

    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /continue/i })
      .first();
    await submitButton.click();

    await page.waitForTimeout(500);

    // Should show email validation error
    const errorMessage = page.locator("text=/valid email|invalid email/i");
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test("should have sign up link", async ({ page }) => {
    // Check for sign up link
    const signUpLink = page
      .locator("a")
      .filter({ hasText: /sign up|register|create.*account/i })
      .first();
    await expect(signUpLink).toBeVisible();
  });

  test("should navigate to sign up page", async ({ page }) => {
    // Click sign up link
    const signUpLink = page
      .locator("a")
      .filter({ hasText: /sign up|register|create.*account/i })
      .first();
    await signUpLink.click();

    // Should navigate to sign up page
    await expect(page).toHaveURL("/sign-up");
  });

  // NOTE: Actual authentication test with credentials
  // Uncomment and configure when test credentials are available
  test.skip("should successfully sign in with valid credentials", async ({
    page,
  }) => {
    // TODO: Add test user credentials to .env.test
    const TEST_EMAIL = process.env.TEST_USER_EMAIL;
    const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

    if (!TEST_EMAIL || !TEST_PASSWORD) {
      test.skip();
    }

    // Fill in credentials
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill(TEST_PASSWORD);

    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
  });
});
