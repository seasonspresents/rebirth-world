import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Acme/);
  });

  test("should display main navigation", async ({ page }) => {
    // Check header navigation links (use first() to handle multiple matches)
    await expect(
      page.getByRole("link", { name: "Pricing" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Blog" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Changelog" }).first()
    ).toBeVisible();
  });

  test("should display hero section", async ({ page }) => {
    // Check for hero heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Check for CTA buttons in hero
    const ctaButtons = page
      .locator("a, button")
      .filter({ hasText: /Get Started|Sign Up/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test("should display all main sections", async ({ page }) => {
    // Check that main content sections are present
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // Verify multiple sections exist (hero, features, pricing, testimonials, etc.)
    const sections = await page.locator("main > div > *").count();
    expect(sections).toBeGreaterThan(5); // Should have hero, social proof, features, pricing, testimonials, faq, cta
  });

  test("should navigate to pricing page from navigation", async ({ page }) => {
    await page.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL("/pricing");
  });

  test("should navigate to blog page from navigation", async ({ page }) => {
    await page.getByRole("link", { name: "Blog" }).first().click();
    await expect(page).toHaveURL("/blog");
  });

  test("should have visible footer", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .first();

    if (await themeToggle.isVisible()) {
      // Get initial theme state
      const htmlElement = page.locator("html");
      const initialClass = await htmlElement.getAttribute("class");

      // Toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(300);

      // Verify theme changed
      const newClass = await htmlElement.getAttribute("class");
      expect(initialClass).not.toBe(newClass);
    }
  });

  test("should be responsive on mobile", async ({ page, viewport }) => {
    // This test runs on mobile viewports (Mobile Chrome, Mobile Safari)
    if (viewport && viewport.width < 768) {
      // Check that mobile navigation works
      const mobileMenuButton = page.getByRole("button", { name: /menu/i });
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();

        // Navigation should be visible after clicking mobile menu
        await expect(page.getByRole("link", { name: "Pricing" })).toBeVisible();
      }
    }
  });
});
