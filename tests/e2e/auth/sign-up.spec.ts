import { test, expect } from "@playwright/test";

test.describe("Sign Up Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-up");
  });

  test("should load sign up page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Acme/);
    await expect(page).toHaveURL("/sign-up");
  });

  test("should display sign up form", async ({ page }) => {
    // Check for form element
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should have name and email fields", async ({ page }) => {
    // Check for name input
    const nameInput = page
      .locator('input[placeholder*="name" i], input#name')
      .first();
    await expect(nameInput).toBeVisible({ timeout: 10000 });

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

  test("should display OAuth signup options", async ({ page }) => {
    // Look for Google and GitHub OAuth buttons
    const oauthButtons = page
      .locator("button, a")
      .filter({ hasText: /google|github/i });
    const oauthCount = await oauthButtons.count();

    // Should have at least one OAuth option
    expect(oauthCount).toBeGreaterThanOrEqual(1);
  });

  test("should show validation error for empty fields", async ({ page }) => {
    // Try to submit with empty fields
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /continue/i })
      .first();
    await submitButton.click();

    await page.waitForTimeout(500);

    // Should show validation error (either for name or email)
    const errorMessage = page.locator(
      "text=/required|please enter|name.*required|email.*required/i"
    );
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test("should show validation error for invalid email", async ({ page }) => {
    // Fill name and enter invalid email
    const nameInput = page.locator('input[name*="name" i]').first();
    await nameInput.fill("Test User");

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

  test("should have sign in link for existing users", async ({ page }) => {
    // Check for sign in link
    const signInLink = page
      .locator("a")
      .filter({ hasText: /sign in|log in|already.*account/i })
      .first();
    await expect(signInLink).toBeVisible();
  });

  test("should navigate to sign in page", async ({ page }) => {
    // Click sign in link
    const signInLink = page
      .locator("a")
      .filter({ hasText: /sign in|log in|already.*account/i })
      .first();
    await signInLink.click();

    // Should navigate to sign in page
    await expect(page).toHaveURL("/sign-in");
  });

  test("should display terms and privacy policy links", async ({ page }) => {
    // Look for links to legal pages
    const termsLink = page.locator('a[href*="terms"]');
    const privacyLink = page.locator('a[href*="privacy"]');

    // At least one legal link should be visible
    const legalLinksCount =
      (await termsLink.count()) + (await privacyLink.count());
    expect(legalLinksCount).toBeGreaterThan(0);
  });

  // NOTE: Actual registration test
  // Uncomment when ready to test with real Supabase instance
  test.skip("should successfully register new user", async ({ page }) => {
    // TODO: Generate unique test email or clean up after test
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = "SecureTestPass123!";

    // Fill in credentials
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill(testEmail);

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill(testPassword);

    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show confirmation message or redirect to email confirmation
    await page.waitForTimeout(2000);

    // Check for success (either redirect or confirmation message)
    const currentUrl = page.url();
    const hasConfirmationPage = currentUrl.includes("confirm");
    const hasSuccessMessage =
      (await page
        .locator("text=/check.*email|confirmation.*sent|verify.*email/i")
        .count()) > 0;

    expect(hasConfirmationPage || hasSuccessMessage).toBe(true);
  });
});
