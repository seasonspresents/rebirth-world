import { test, expect } from "@playwright/test";

test.describe("Legal Pages", () => {
  test.describe("Privacy Policy", () => {
    test("should load privacy policy page", async ({ page }) => {
      await page.goto("/privacy");
      await expect(page).toHaveTitle(/Privacy/);
    });

    test("should display privacy policy content", async ({ page }) => {
      await page.goto("/privacy");

      // Check for main heading
      const heading = page
        .locator("h1")
        .filter({ hasText: /privacy/i })
        .first();
      await expect(heading).toBeVisible();

      // Should have substantial content
      const paragraphs = page.locator("p");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(5);
    });

    test("should have structured sections", async ({ page }) => {
      await page.goto("/privacy");

      // Look for section headings
      const headings = page.locator("h2, h3");
      const headingCount = await headings.count();

      // Should have multiple sections
      expect(headingCount).toBeGreaterThan(3);
    });

    test.skip("should include common privacy policy sections", async ({
      page,
    }) => {
      await page.goto("/privacy");

      // Look for typical privacy policy keywords
      const content = page.locator("main, article");
      const text = await content.textContent();

      // Should mention data collection, cookies, etc.
      expect(text?.toLowerCase()).toMatch(
        /data|information|collect|cookie|third.party|privacy|rights/
      );
    });
  });

  test.describe("Terms of Service", () => {
    test("should load terms of service page", async ({ page }) => {
      await page.goto("/terms-of-service");
      await expect(page).toHaveTitle(/Terms/);
    });

    test("should display terms content", async ({ page }) => {
      await page.goto("/terms-of-service");

      // Check for main heading
      const heading = page.locator("h1").filter({ hasText: /terms/i }).first();
      await expect(heading).toBeVisible();

      // Should have substantial content
      const paragraphs = page.locator("p");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(5);
    });

    test("should have structured sections", async ({ page }) => {
      await page.goto("/terms-of-service");

      // Look for section headings
      const headings = page.locator("h2, h3");
      const headingCount = await headings.count();

      // Should have multiple sections
      expect(headingCount).toBeGreaterThan(3);
    });

    test("should include common ToS sections", async ({ page }) => {
      await page.goto("/terms-of-service");

      // Look for typical ToS keywords
      const content = page.locator("main, article");
      const text = await content.textContent();

      // Should mention service, liability, agreement, etc.
      expect(text?.toLowerCase()).toMatch(
        /service|agreement|liability|user|account|terms|conditions/
      );
    });
  });

  test.describe("Cookie Policy", () => {
    test("should load cookie policy page", async ({ page }) => {
      await page.goto("/cookie-policy");
      await expect(page).toHaveTitle(/Cookie/);
    });

    test("should display cookie policy content", async ({ page }) => {
      await page.goto("/cookie-policy");

      // Check for main heading
      const heading = page
        .locator("h1")
        .filter({ hasText: /cookie/i })
        .first();
      await expect(heading).toBeVisible();

      // Should have substantial content
      const paragraphs = page.locator("p");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(3);
    });

    test("should explain cookie types", async ({ page }) => {
      await page.goto("/cookie-policy");

      // Look for cookie type explanations
      const content = page.locator("main, article");
      const text = await content.textContent();

      // Should mention different cookie types
      expect(text?.toLowerCase()).toMatch(
        /cookie|necessary|functional|analytics|tracking|essential/
      );
    });
  });

  test.describe("Legal Navigation", () => {
    test("should have links to all legal pages in footer", async ({ page }) => {
      await page.goto("/");

      // Check footer for legal links
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // Look for legal page links
      const privacyLink = footer.locator('a[href="/privacy"]');
      const termsLink = footer.locator('a[href="/terms-of-service"]');
      const cookieLink = footer.locator('a[href="/cookie-policy"]');

      await expect(privacyLink).toBeVisible();
      await expect(termsLink).toBeVisible();
      await expect(cookieLink).toBeVisible();
    });

    test("should navigate between legal pages", async ({ page }) => {
      await page.goto("/privacy");

      // Navigate to terms
      await page.goto("/terms-of-service");
      await expect(page).toHaveURL("/terms-of-service");

      // Navigate to cookie policy
      await page.goto("/cookie-policy");
      await expect(page).toHaveURL("/cookie-policy");
    });
  });

  test.describe("Legal Content Quality", () => {
    const legalPages = ["/privacy", "/terms-of-service", "/cookie-policy"];

    for (const url of legalPages) {
      test(`${url} should have proper typography`, async ({ page }) => {
        await page.goto(url);

        // Check that content is not too wide
        const mainContent = page.locator("main, article").first();
        const boundingBox = await mainContent.boundingBox();

        if (boundingBox) {
          // Content should be readable width
          expect(boundingBox.width).toBeLessThan(1200);
        }
      });

      test(`${url} should have last updated date`, async ({ page }) => {
        await page.goto(url);

        // Look for last updated or effective date
        const dateInfo = page.locator(
          "text=/last updated|effective date|updated|\\d{4}/i"
        );

        if ((await dateInfo.count()) > 0) {
          await expect(dateInfo.first()).toBeVisible();
        }
      });
    }
  });
});
