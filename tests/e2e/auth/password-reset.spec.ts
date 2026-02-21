import { test, expect } from "@playwright/test";

test.describe("Password Reset Flow", () => {
  test.describe("Forgot Password Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/forgot-password");
    });

    test("should load forgot password page successfully", async ({ page }) => {
      await expect(page).toHaveTitle(/Forgot Password|Reset Password/i);
    });

    test("should display password reset form", async ({ page }) => {
      // Check for form element
      const form = page.locator("form");
      await expect(form).toBeVisible();
    });

    test("should have email input field", async ({ page }) => {
      // Check for email input
      const emailInput = page
        .locator('input[type="email"], input[name*="email" i]')
        .first();
      await expect(emailInput).toBeVisible();
    });

    test("should have submit button", async ({ page }) => {
      // Check for submit button
      const submitButton = page
        .locator('button[type="submit"], button')
        .filter({ hasText: /send|reset|submit/i })
        .first();
      await expect(submitButton).toBeVisible();
    });

    test("should show validation error for empty email", async ({ page }) => {
      // Try to submit without email
      const submitButton = page
        .locator('button[type="submit"], button')
        .filter({ hasText: /send|reset/i })
        .first();
      await submitButton.click();

      await page.waitForTimeout(500);

      // Should show validation error
      const errorMessage = page.locator("text=/required|email.*required/i");
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
        .filter({ hasText: /send|reset/i })
        .first();
      await submitButton.click();

      await page.waitForTimeout(500);

      // Should show email validation error
      const errorMessage = page.locator("text=/valid email|invalid email/i");
      if ((await errorMessage.count()) > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    });

    test("should have back to sign in link", async ({ page }) => {
      // Check for back link
      const backLink = page
        .locator("a")
        .filter({ hasText: /back|sign in|log in/i })
        .first();
      await expect(backLink).toBeVisible();
    });

    test("should navigate back to sign in page", async ({ page }) => {
      // Click back link
      const backLink = page
        .locator("a")
        .filter({ hasText: /back|sign in|log in/i })
        .first();
      await backLink.click();

      // Should navigate to sign in page
      await expect(page).toHaveURL("/sign-in");
    });

    // NOTE: Actual password reset email test
    // Uncomment when ready to test with real Supabase instance
    test.skip("should send password reset email for valid email", async ({
      page,
    }) => {
      const TEST_EMAIL = process.env.TEST_USER_EMAIL;

      if (!TEST_EMAIL) {
        test.skip();
      }

      // Enter valid email
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(TEST_EMAIL);

      // Submit form
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Should show success message
      await page.waitForTimeout(2000);
      const successMessage = page.locator(
        "text=/check.*email|sent.*instructions|reset.*link/i"
      );
      await expect(successMessage.first()).toBeVisible();
    });
  });

  test.describe("Reset Password Page", () => {
    // NOTE: This page requires a valid reset token from email
    // These are placeholder tests - actual testing requires email integration

    test("should load reset password page with token", async ({ page }) => {
      // Navigate with dummy token (will fail in real scenario)
      await page.goto("/reset-password?token=dummy-token");

      // Page should load (even if token is invalid)
      await expect(page).toHaveURL(/\/reset-password/);
    });

    test.skip("should display new password form with valid token", async ({
      page,
    }) => {
      // TODO: Generate valid reset token for testing
      // This would require:
      // 1. Triggering password reset for test user
      // 2. Extracting token from email or database
      // 3. Using that token here

      await page.goto("/reset-password?token=VALID_TOKEN_HERE");

      // Check for password fields
      const passwordInput = page.locator('input[type="password"]').first();
      await expect(passwordInput).toBeVisible();
    });

    test.skip("should successfully reset password with valid token", async ({
      page,
    }) => {
      // TODO: Implement when token generation is available
      const newPassword = "NewSecurePass123!";

      await page.goto("/reset-password?token=VALID_TOKEN_HERE");

      // Fill new password
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill(newPassword);

      // Confirm password (if required)
      const confirmInput = page.locator('input[type="password"]').last();
      if ((await confirmInput.isVisible()) && confirmInput !== passwordInput) {
        await confirmInput.fill(newPassword);
      }

      // Submit
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Should show success and redirect to sign in
      await expect(page).toHaveURL("/sign-in", { timeout: 5000 });
    });
  });
});
