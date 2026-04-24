import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import { getCheckoutShippingRates } from "@/lib/shippo";
import type Stripe from "stripe";

// Client may send `price` and `name` fields for UX convenience, but we IGNORE
// them for all server-side math — the only field we trust is `stripePriceId`.
// See roundtable 2026-04-24 R4 (free-shipping tampering fix).
const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        stripePriceId: z.string().startsWith("price_"),
        quantity: z.number().int().min(1).max(99),
        variant: z.string().nullable().optional(),
      })
    )
    .min(1)
    .max(50),
});

const BRAND_TAG = "rebirth-world";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // -------------------------------------------------------------------------
  // Server-side price resolution (R4). Never trust client-supplied amounts.
  // -------------------------------------------------------------------------
  //
  // Fetch every price from Stripe by ID. Reject:
  //   - unknown price IDs (Stripe returns 404)
  //   - inactive prices
  //   - recurring prices (mode=payment can't handle them anyway)
  //
  // Use server-computed subtotal + name for Shippo + metadata.
  let resolvedItems: Array<{
    stripePriceId: string;
    quantity: number;
    unitAmount: number;
    productName: string;
    productCollection: string | undefined;
    variant: string | null;
  }>;

  try {
    resolvedItems = await Promise.all(
      parsed.data.items.map(async (item) => {
        const price = await stripe.prices.retrieve(item.stripePriceId, {
          expand: ["product"],
        });
        if (!price.active) {
          throw new Error(`Price ${item.stripePriceId} is not active`);
        }
        if (price.type === "recurring") {
          throw new Error(
            `Price ${item.stripePriceId} is recurring; this checkout only supports one-time prices`
          );
        }
        const product =
          typeof price.product === "string" || price.product.deleted
            ? null
            : (price.product as Stripe.Product);
        if (!product || !product.active) {
          throw new Error(
            `Product for price ${item.stripePriceId} is inactive or deleted`
          );
        }
        return {
          stripePriceId: item.stripePriceId,
          quantity: item.quantity,
          unitAmount: price.unit_amount ?? 0,
          productName: product.name,
          productCollection: (product.metadata?.collection as string) ?? undefined,
          variant: item.variant ?? null,
        };
      })
    );
  } catch (err) {
    console.error("Price resolution failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to resolve cart prices",
      },
      { status: 400 }
    );
  }

  // Line items for Stripe Checkout
  const line_items = resolvedItems.map((item) => ({
    price: item.stripePriceId,
    quantity: item.quantity,
  }));

  // Per-item variant metadata (for webhook → order_items)
  const itemVariants = resolvedItems
    .filter((item) => item.variant)
    .map((item) => ({
      priceId: item.stripePriceId,
      variant: item.variant,
    }));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";

  // Server-computed subtotal — authoritative for free-shipping eligibility
  const subtotalCents = resolvedItems.reduce(
    (sum, item) => sum + item.unitAmount * item.quantity,
    0
  );

  // -------------------------------------------------------------------------
  // Shipping rates via Shippo (HI → CA representative route)
  // -------------------------------------------------------------------------
  let shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[];
  try {
    const shippoItems = resolvedItems.map((item) => ({
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitAmount,
      collection: item.productCollection,
    }));

    const { rates } = await getCheckoutShippingRates(
      {
        name: "Rate Estimate",
        street1: "1 Market St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "US",
      },
      shippoItems,
      subtotalCents
    );

    shippingOptions = rates.slice(0, 5).map((rate) => {
      const minDays = rate.estimatedDays ?? 5;
      const maxDays = Math.max(minDays + 2, minDays);
      return {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: rate.priceCents, currency: "usd" },
          display_name:
            rate.priceCents === 0
              ? "Free Standard Shipping"
              : `${rate.carrier} ${rate.service}`,
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: minDays },
            maximum: { unit: "business_day" as const, value: maxDays },
          },
        },
      };
    });

    if (shippingOptions.length === 0) {
      throw new Error("No rates returned");
    }
  } catch (rateErr) {
    console.warn("Shippo rate fetch failed, using fallback rates:", rateErr);
    const thresholdCents = parseInt(
      process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "10000",
      10
    );
    const isFreeEligible = subtotalCents >= thresholdCents;
    shippingOptions = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: isFreeEligible ? 0 : 599, currency: "usd" },
          display_name: isFreeEligible
            ? "Free Standard Shipping"
            : "USPS Ground Advantage",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 10 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 1500, currency: "usd" },
          display_name: "Express Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 4 },
          },
        },
      },
    ];
  }

  // -------------------------------------------------------------------------
  // Create Checkout Session
  // -------------------------------------------------------------------------
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NZ"],
      },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      metadata: {
        // R6: tag every session with brand so shared-account reports can
        // filter to Rebirth World cleanly. If we later split into a dedicated
        // Stripe account, this tag is still correct and harmless.
        brand: BRAND_TAG,
        user_id: user?.id ?? "guest",
        order_source: "website",
        ...(itemVariants.length > 0 && {
          item_variants: JSON.stringify(itemVariants),
        }),
      },
      ...(user?.email && { customer_email: user.email }),
      success_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
