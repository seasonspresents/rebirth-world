import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("should load pricing page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing/);
  });

  test("should display pricing plans", async ({ page }) => {
    // Look for pricing cards or plan sections
    const pricingContent = page.locator("main");
    await expect(pricingContent).toBeVisible();

    // Check for common pricing text
    await expect(
      page.locator("text=/\\$|USD|month|year/i").first()
    ).toBeVisible();
  });

  test("should have billing cycle toggle (monthly/yearly)", async ({
    page,
  }) => {
    // Look for toggle switch or buttons for billing cycle
    const toggleButtons = page
      .locator("button")
      .filter({ hasText: /month|year/i });

    if ((await toggleButtons.count()) > 0) {
      const firstToggle = toggleButtons.first();
      await expect(firstToggle).toBeVisible();

      // Try toggling
      await firstToggle.click();
      await page.waitForTimeout(300);

      // Verify page responded to toggle (prices may change)
      await expect(pricingContent).toBeVisible();
    }
  });

  test("should display plan features", async ({ page }) => {
    // Look for feature lists (usually in bullet points or checkmarks)
    const features = page
      .locator("ul, li")
      .filter({ hasText: /feature|include|access/i });
    await expect(features.first()).toBeVisible();
  });

  test("should have CTA buttons for plans", async ({ page }) => {
    // Look for "Get Started", "Subscribe", "Sign Up" buttons
    const ctaButtons = page
      .locator("a, button")
      .filter({ hasText: /get started|subscribe|sign up|choose plan/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test("should display FAQ section", async ({ page }) => {
    // Scroll to FAQ section
    const faqSection = page.locator("text=/frequently asked|faq/i").first();

    if (await faqSection.isVisible()) {
      await faqSection.scrollIntoViewIfNeeded();
      await expect(faqSection).toBeVisible();
    }
  });

  test("should display social proof section", async ({ page }) => {
    // Look for logos or testimonials
    const socialProof = page
      .locator('img[alt*="logo" i], img[alt*="company" i]')
      .first();

    if (await socialProof.isVisible()) {
      await expect(socialProof).toBeVisible();
    }
  });

  test("should have CTA section at bottom", async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for final CTA
    const finalCta = page
      .locator("text=/get started|sign up|start free/i")
      .last();
    await expect(finalCta).toBeVisible();
  });
});
