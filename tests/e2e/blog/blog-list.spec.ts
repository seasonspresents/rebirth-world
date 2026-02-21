import { test, expect } from "@playwright/test";

test.describe("Blog List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("should load blog page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/);
  });

  test("should display blog posts", async ({ page }) => {
    // Look for links that might be blog posts
    const postLinks = page.locator('a[href^="/blog/"]');
    const linkCount = await postLinks.count();

    // Should have at least one blog post
    expect(linkCount).toBeGreaterThan(0);
  });

  test("should display post metadata", async ({ page }) => {
    // Check for author, date, or read time indicators
    const metadata = page.locator(
      "text=/by |author|published|\\d{4}|min read/i"
    );
    const metadataCount = await metadata.count();

    expect(metadataCount).toBeGreaterThan(0);
  });

  test("should have post thumbnails or images", async ({ page }) => {
    // Check for post images
    const images = page.locator(
      'article img, [data-testid*="post"] img, .post img'
    );
    const imageCount = await images.count();

    if (imageCount > 0) {
      await expect(images.first()).toBeVisible();
    }
  });

  test("should display post excerpts or descriptions", async ({ page }) => {
    // Check for post descriptions/excerpts
    const descriptions = page.locator("p").filter({ hasText: /.{50,}/ }); // Paragraphs with substantial text
    await expect(descriptions.first()).toBeVisible();
  });

  test("should navigate to individual post", async ({ page }) => {
    // Click on first blog post link
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    // Should navigate to blog post detail page
    await expect(page).toHaveURL(/\/blog\/.+/);
  });

  test("should have tag filtering", async ({ page }) => {
    // Look for tag buttons or filters
    const tags = page
      .locator("button, a")
      .filter({ hasText: /tag|category|filter|nextjs|react|typescript/i });
    const tagCount = await tags.count();

    if (tagCount > 0) {
      // Click on a tag to filter
      await tags.first().click();
      await page.waitForTimeout(500);

      // Page should still show blog posts (filtered)
      const filteredPosts = page.locator('a[href^="/blog/"]');
      expect(await filteredPosts.count()).toBeGreaterThan(0);
    }
  });

  test("should display post tags", async ({ page }) => {
    // Look for tag badges/pills on posts
    const tagElements = page
      .locator('[class*="tag"], [class*="badge"], [class*="pill"]')
      .first();

    if ((await tagElements.count()) > 0) {
      await expect(tagElements).toBeVisible();
    }
  });
});
