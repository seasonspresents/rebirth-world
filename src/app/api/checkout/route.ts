import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import { getCheckoutShippingRates } from "@/lib/shippo";
import type Stripe from "stripe";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        stripePriceId: z.string(),
        quantity: z.number().int().min(1),
        variant: z.string().nullable().optional(),
        name: z.string().optional(),
        price: z.number().optional(), // cents
        collection: z.string().nullable().optional(),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
  }

  // Get current user (optional — guests can check out too)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const line_items = parsed.data.items.map((item) => ({
    price: item.stripePriceId,
    quantity: item.quantity,
  }));

  // Serialize per-item variant/engraving data for the webhook to read
  const itemVariants = parsed.data.items
    .filter((item) => item.variant)
    .map((item) => ({
      priceId: item.stripePriceId,
      variant: item.variant,
    }));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";

  // Calculate subtotal from items for free shipping check
  const subtotalCents = parsed.data.items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  // Fetch live Shippo rates for a representative domestic route (HI → CA)
  // Stripe hosted checkout collects the real address, but we use this to
  // generate realistic carrier pricing for the shipping options shown
  let shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[];
  try {
    const shippoItems = parsed.data.items.map((item) => ({
      product_name: item.name ?? "Item",
      quantity: item.quantity,
      unit_price: item.price ?? 0,
      collection: item.collection ?? undefined,
    }));

    const { rates, freeShippingEligible } = await getCheckoutShippingRates(
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

    // Convert Shippo rates to Stripe shipping_rate_data (max 5 options)
    shippingOptions = rates.slice(0, 5).map((rate) => {
      const minDays = rate.estimatedDays ?? 5;
      const maxDays = Math.max(minDays + 2, minDays);
      return {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: rate.priceCents, currency: "usd" },
          display_name: rate.priceCents === 0
            ? "Free Standard Shipping"
            : `${rate.carrier} ${rate.service}`,
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: minDays },
            maximum: { unit: "business_day" as const, value: maxDays },
          },
        },
      };
    });

    // Always ensure there's at least one option
    if (shippingOptions.length === 0) {
      throw new Error("No rates returned");
    }
  } catch (rateErr) {
    console.warn("Shippo rate fetch failed, using fallback rates:", rateErr);
    // Fallback to hardcoded rates if Shippo is unavailable
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
          display_name: isFreeEligible ? "Free Standard Shipping" : "USPS Ground Advantage",
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
