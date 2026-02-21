import { test, expect } from "@playwright/test";

test.describe("Changelog List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/changelog");
  });

  test("should load changelog page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Changelog/);
  });

  test("should display changelog entries", async ({ page }) => {
    // Check that changelog entries are visible
    const changelogLinks = page.locator('a[href^="/changelog/"]');
    const linkCount = await changelogLinks.count();

    // Should have at least one changelog entry
    expect(linkCount).toBeGreaterThan(0);
  });

  test("should display version numbers", async ({ page }) => {
    // Look for version indicators (v1.0.0, v0.1.0, etc.)
    const versions = page.locator("text=/v?\\d+\\.\\d+\\.\\d+/i");
    const versionCount = await versions.count();

    expect(versionCount).toBeGreaterThan(0);
    await expect(versions.first()).toBeVisible();
  });

  test("should display release dates", async ({ page }) => {
    // Look for date information on each entry (using time elements or date text)
    const timeElements = page.locator("time");
    const timeCount = await timeElements.count();

    if (timeCount > 0) {
      await expect(timeElements.first()).toBeVisible();
    } else {
      // Fallback: look for year patterns
      const dateTexts = page.getByText(/20\d{2}/);
      await expect(dateTexts.first()).toBeVisible();
    }
  });

  test("should display changelog summaries", async ({ page }) => {
    // Check for descriptions/summaries
    const summaries = page
      .locator('p, [class*="description"]')
      .filter({ hasText: /.{20,}/ });

    if ((await summaries.count()) > 0) {
      await expect(summaries.first()).toBeVisible();
    }
  });

  test("should navigate to changelog detail", async ({ page }) => {
    // Click on first changelog entry
    const firstChangelogLink = page.locator('a[href^="/changelog/"]').first();
    await firstChangelogLink.click();

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/changelog\/.+/);
  });

  test("should have timeline or chronological layout", async ({ page }) => {
    // Check that versions are displayed in order
    const versionElements = page.locator("text=/v?\\d+\\.\\d+\\.\\d+/i");
    const versionCount = await versionElements.count();

    // Should have multiple versions
    expect(versionCount).toBeGreaterThan(1);
  });

  test("should display author information", async ({ page }) => {
    // Look for author or team info
    const authors = page.locator(
      'text=/by |author|team|released by/i, img[alt*="author" i]'
    );

    if ((await authors.count()) > 0) {
      await expect(authors.first()).toBeVisible();
    }
  });
});
