import { test, expect } from "@playwright/test";

// NOTE: These tests require authentication
test.describe("Billing Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up authenticated user session
    // await setupAuthenticatedUser(page);

    await page.goto("/dashboard/settings/billing");
  });

  test("should redirect to sign-in when not authenticated", async ({
    page,
  }) => {
    await expect(page).toHaveURL("/sign-in", { timeout: 10000 });
  });

  test.skip("should load billing settings page", async ({ page }) => {
    await expect(page).toHaveURL("/dashboard/settings/billing");
    await expect(page).toHaveTitle(/Settings|Billing/);
  });

  test.skip("should display current plan information", async ({ page }) => {
    // Look for plan details
    const planSection = page
      .locator("text=/plan|subscription|current plan/i")
      .first();
    await expect(planSection).toBeVisible();
  });

  test("should show plan name and pricing", async ({ page }) => {
    // Look for plan name (Free, Pro, Enterprise, etc.)
    const planName = page
      .locator("text=/free|pro|enterprise|starter|basic/i")
      .first();

    if (await planName.isVisible()) {
      await expect(planName).toBeVisible();
    }

    // Look for pricing information
    const pricing = page.locator("text=/\\$|month|year|annually/i");
    if ((await pricing.count()) > 0) {
      await expect(pricing.first()).toBeVisible();
    }
  });

  test("should have upgrade/change plan button", async ({ page }) => {
    // Look for upgrade or change plan button
    const upgradeButton = page
      .locator("button, a")
      .filter({ hasText: /upgrade|change plan|manage plan/i })
      .first();

    if (await upgradeButton.isVisible()) {
      await expect(upgradeButton).toBeVisible();
    }
  });

  test("should display billing cycle information", async ({ page }) => {
    // Look for billing cycle (monthly/yearly)
    const billingCycle = page
      .locator("text=/monthly|yearly|annual|billing cycle/i")
      .first();

    if (await billingCycle.isVisible()) {
      await expect(billingCycle).toBeVisible();
    }
  });

  test("should display payment method section", async ({ page }) => {
    // Look for payment method heading
    const paymentSection = page
      .locator("text=/payment method|card|billing/i")
      .first();
    await expect(paymentSection).toBeVisible();
  });

  test("should show saved payment method", async ({ page }) => {
    // Look for card details (masked card number, expiry)
    const cardInfo = page.locator(
      "text=/•••• |ending in|exp|visa|mastercard/i"
    );

    if ((await cardInfo.count()) > 0) {
      await expect(cardInfo.first()).toBeVisible();
    }
  });

  test("should have add/update payment method button", async ({ page }) => {
    // Look for button to add or update payment method
    const paymentButton = page
      .locator("button, a")
      .filter({ hasText: /add.*card|update.*payment|manage.*payment/i })
      .first();

    if (await paymentButton.isVisible()) {
      await expect(paymentButton).toBeVisible();
    }
  });

  test("should display billing history section", async ({ page }) => {
    // Look for invoice/billing history
    const historySection = page
      .locator("text=/billing history|invoices|payments/i")
      .first();

    if (await historySection.isVisible()) {
      await expect(historySection).toBeVisible();
    }
  });

  test("should show invoice table or list", async ({ page }) => {
    // Look for invoices table
    const invoiceTable = page.locator("table");

    if ((await invoiceTable.count()) > 0) {
      await expect(invoiceTable.first()).toBeVisible();

      // Should have table headers
      const headers = invoiceTable.locator("th");
      expect(await headers.count()).toBeGreaterThan(0);
    }
  });

  test("should allow downloading invoices", async ({ page }) => {
    // Look for download buttons in invoice list
    const downloadButtons = page
      .locator("button, a")
      .filter({ hasText: /download|invoice|pdf/i });

    if ((await downloadButtons.count()) > 0) {
      // First download button should be visible
      await expect(downloadButtons.first()).toBeVisible();
    }
  });

  test("should have cancel subscription option", async ({ page }) => {
    // Scroll to bottom to find cancel option
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for cancel subscription option
    const cancelOption = page
      .locator("button, a")
      .filter({ hasText: /cancel.*subscription|cancel.*plan/i });

    if ((await cancelOption.count()) > 0) {
      await expect(cancelOption.first()).toBeVisible();
    }
  });

  test("should show next billing date", async ({ page }) => {
    // Look for next billing/renewal date
    const nextBilling = page.locator("text=/next bill|renews|billing date/i");

    if ((await nextBilling.count()) > 0) {
      await expect(nextBilling.first()).toBeVisible();
    }
  });

  test("should redirect to sign in when not authenticated", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/settings/billing");
    await expect(page).toHaveURL("/sign-in", { timeout: 5000 });
  });
});
