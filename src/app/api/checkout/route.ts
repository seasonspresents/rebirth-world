import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        stripePriceId: z.string(),
        quantity: z.number().int().min(1),
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NZ"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 500, currency: "usd" },
            display_name: "Standard Shipping",
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
      ],
      allow_promotion_codes: true,
      metadata: {
        user_id: user?.id ?? "guest",
        order_source: "website",
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
