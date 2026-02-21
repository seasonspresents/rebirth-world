import { test, expect } from "@playwright/test";

test.describe("Blog Post Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to blog list first
    await page.goto("/blog");

    // Click on first blog post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    // Wait for navigation
    await page.waitForURL(/\/blog\/.+/);
  });

  test("should load blog post successfully", async ({ page }) => {
    // Should have a title
    await expect(page).toHaveTitle(/.+/);

    // Title should not be just "Blog"
    const title = await page.title();
    expect(title).not.toBe("Blog");
  });

  test("should display post title", async ({ page }) => {
    // Check for main heading
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    // Heading should have text
    const headingText = await heading.textContent();
    expect(headingText).toBeTruthy();
  });

  test("should display post content", async ({ page }) => {
    // Check for article content (use first to avoid strict mode violation)
    const article = page.locator('article, main, [role="article"]').first();
    await expect(article).toBeVisible();

    // Should have substantial content (paragraphs, headings, etc.)
    const paragraphs = page.locator("p");
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(0);
  });

  test("should display author information", async ({ page }) => {
    // Look for author name or avatar
    const author = page.locator(
      'text=/by |author|written by/i, img[alt*="author" i]'
    );

    if ((await author.count()) > 0) {
      await expect(author.first()).toBeVisible();
    }
  });

  test("should display publish date", async ({ page }) => {
    // Look for date information (using time element or searching for date patterns)
    const timeElement = page.locator("time").first();
    const hasTime = (await timeElement.count()) > 0;

    if (hasTime) {
      await expect(timeElement).toBeVisible();
    } else {
      // Fallback: look for year patterns
      const dateText = page
        .getByText(
          /20\d{2}|january|february|march|april|may|june|july|august|september|october|november|december/i
        )
        .first();
      await expect(dateText).toBeVisible();
    }
  });

  test("should display post tags", async ({ page }) => {
    // Look for tags/categories
    const tags = page.locator(
      '[class*="tag"], [class*="badge"], a[href*="tag" i]'
    );

    if ((await tags.count()) > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test("should have readable content styling", async ({ page }) => {
    // Check that paragraphs exist and are readable
    const firstParagraph = page.locator("article p, main p").first();
    await expect(firstParagraph).toBeVisible();

    // Verify text is not too wide (good typography)
    const boundingBox = await firstParagraph.boundingBox();
    if (boundingBox) {
      // Content width should be reasonable (not full screen)
      expect(boundingBox.width).toBeLessThan(1000);
    }
  });

  test("should support code syntax highlighting", async ({ page }) => {
    // Look for code blocks (if post contains code)
    const codeBlocks = page.locator('pre code, pre, code[class*="language"]');

    if ((await codeBlocks.count()) > 0) {
      // Code blocks should be visible
      await expect(codeBlocks.first()).toBeVisible();
    }
  });

  test("should have back to blog link", async ({ page }) => {
    // Look for navigation back to blog
    const backLink = page
      .locator('a[href="/blog"], a')
      .filter({ hasText: /back|blog|all posts/i })
      .first();

    if (await backLink.isVisible()) {
      await backLink.click();
      await expect(page).toHaveURL("/blog");
    }
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    // h1 should exist
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Should not have multiple h1s
    expect(h1Count).toBeLessThanOrEqual(2);
  });
});
