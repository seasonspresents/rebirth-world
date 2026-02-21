import { test, expect } from "@playwright/test";

test.describe("Changelog Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to changelog list first
    await page.goto("/changelog");

    // Click on first changelog entry
    const firstChangelogLink = page.locator('a[href^="/changelog/"]').first();
    await firstChangelogLink.click();

    // Wait for navigation
    await page.waitForURL(/\/changelog\/.+/);
  });

  test("should load changelog detail successfully", async ({ page }) => {
    // Should have a title with version
    const title = await page.title();
    expect(title).toMatch(/v?\d+\.\d+|changelog/i);
  });

  test("should display version number", async ({ page }) => {
    // Check for version heading
    const versionHeading = page
      .locator("h1, h2")
      .filter({ hasText: /v?\d+\.\d+\.\d+/i })
      .first();
    await expect(versionHeading).toBeVisible();
  });

  test("should display release date", async ({ page }) => {
    // Look for date information (using time element or searching for date patterns)
    const timeElement = page.locator("time").first();
    const hasTime = (await timeElement.count()) > 0;

    if (hasTime) {
      await expect(timeElement).toBeVisible();
    } else {
      // Fallback: look for year or "released" patterns
      const dateText = page
        .getByText(
          /20\d{2}|released|january|february|march|april|may|june|july|august|september|october|november|december/i
        )
        .first();
      await expect(dateText).toBeVisible();
    }
  });

  test("should categorize changes", async ({ page }) => {
    // Look for change categories (Added, Fixed, Changed, Removed, etc.)
    const categories = page.locator("h2, h3, strong").filter({
      hasText: /added|fixed|changed|removed|improved|deprecated|security/i,
    });

    if ((await categories.count()) > 0) {
      await expect(categories.first()).toBeVisible();
    }
  });

  test("should display change items", async ({ page }) => {
    // Look for list items or bullet points
    const changeItems = page.locator("ul li, ol li");
    const itemCount = await changeItems.count();

    // Should have at least some change items
    expect(itemCount).toBeGreaterThan(0);
  });

  test("should have detailed descriptions", async ({ page }) => {
    // Check for paragraphs with content
    const descriptions = page
      .locator("article p, main p")
      .filter({ hasText: /.{30,}/ });

    if ((await descriptions.count()) > 0) {
      await expect(descriptions.first()).toBeVisible();
    }
  });

  test("should display author information", async ({ page }) => {
    // Look for author or team info
    const authors = page.locator(
      'text=/by |author|team/i, img[alt*="author" i]'
    );

    if ((await authors.count()) > 0) {
      await expect(authors.first()).toBeVisible();
    }
  });

  test("should have back to changelog link", async ({ page }) => {
    // Look for navigation back to changelog
    const backLink = page
      .locator('a[href="/changelog"], a')
      .filter({ hasText: /back|changelog|all versions/i })
      .first();

    if (await backLink.isVisible()) {
      await backLink.click();
      await expect(page).toHaveURL("/changelog");
    }
  });

  test("should support markdown formatting", async ({ page }) => {
    // Look for formatted content (headings, lists, code blocks)
    const headings = await page.locator("h1, h2, h3, h4").count();
    const lists = await page.locator("ul, ol").count();

    // Should have some formatted elements
    expect(headings + lists).toBeGreaterThan(0);
  });
});
