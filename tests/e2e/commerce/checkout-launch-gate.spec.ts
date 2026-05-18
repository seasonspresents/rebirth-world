import { expect, test } from "@playwright/test";

const SHIPPING_RATE = {
  rateId: "rate_test_ground_advantage",
  carrier: "USPS",
  service: "Ground Advantage",
  price: "5.99",
  priceCents: 599,
  currency: "USD",
  estimatedDays: 4,
  durationTerms: "4 business days",
};

test.describe("checkout launch gate", () => {
  test("adds a product, selects shipping, and redirects to Stripe checkout", async ({
    page,
  }) => {
    let checkoutPayload: {
      items?: Array<{ stripePriceId?: string; quantity?: number }>;
      shippingRate?: typeof SHIPPING_RATE;
      shippingAddress?: { zip?: string; country?: string };
    } | null = null;

    await page.route("**/api/shipping/rates", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          rates: [SHIPPING_RATE],
          freeShippingEligible: false,
          freeShippingThreshold: 10000,
        }),
      });
    });

    await page.route("**/api/checkout", async (route) => {
      checkoutPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://checkout.stripe.com/c/pay/cs_test_rebirth_launch_gate",
        }),
      });
    });

    await page.goto("/shop/floral-bloom");

    const addButton = page.getByRole("button", { name: /add to cart/i }).last();
    if (await addButton.isDisabled()) {
      for (const size of ["8", "8.5", "9", "7"]) {
        const sizeButton = page.getByRole("button", { name: size }).first();
        if ((await sizeButton.count()) > 0) {
          await sizeButton.click();
          break;
        }
      }
    }

    await expect(addButton).toBeEnabled();
    await addButton.click();
    await expect(page.getByText(/added/i).first()).toBeVisible();

    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: /your cart/i })
    ).toBeVisible();

    await page.getByPlaceholder(/zip/i).fill("94105");
    await page.getByRole("button", { name: /get rates/i }).click();
    await expect(page.getByText(/ground advantage/i)).toBeVisible();

    await page.getByRole("button", { name: /ground advantage/i }).click();
    await expect(page.getByText(/selected: ground advantage/i)).toBeVisible();

    await page.screenshot({
      path: "test-results/rebirth-26-checkout-launch-gate.png",
      fullPage: true,
    });

    await page
      .getByRole("button", { name: /checkout with ground advantage/i })
      .click();
    await page.waitForURL(
      /checkout\.stripe\.com\/c\/pay\/cs_test_rebirth_launch_gate/
    );

    expect(checkoutPayload?.items?.[0]?.stripePriceId).toMatch(/^price_/);
    expect(checkoutPayload?.items?.[0]?.quantity).toBeGreaterThan(0);
    expect(checkoutPayload?.shippingRate?.rateId).toBe(SHIPPING_RATE.rateId);
    expect(checkoutPayload?.shippingAddress?.zip).toBe("94105");
    expect(checkoutPayload?.shippingAddress?.country).toBe("US");
  });
});
