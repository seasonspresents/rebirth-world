import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Check if user is authenticated (optional — guests can still checkout)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get the price ID from the form data
    const formData = await request.formData();
    const price_id = formData.get("price_id") as string;

    if (!price_id || price_id === "undefined") {
      return NextResponse.json(
        { error: "Valid price ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `Creating checkout session for ${user ? `user: ${user.id}` : "guest"}, price: ${price_id}`
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      // If logged in, pre-fill their email; otherwise Stripe collects it
      ...(user?.email ? { customer_email: user.email } : {}),
      metadata: {
        ...(user ? { user_id: user.id, user_email: user.email || "" } : {}),
      },
      subscription_data: {
        metadata: {
          ...(user ? { user_id: user.id, user_email: user.email || "" } : {}),
        },
      },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const error = err as Error;
    console.error("Checkout session creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
