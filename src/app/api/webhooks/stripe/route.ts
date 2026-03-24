/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/payments/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/emails";
import { notifyPurchase } from "@/lib/ghl";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "payment") {
          console.log(
            `Processing checkout session completed (payment): ${session.id}`
          );
          await handleCheckoutCompleted(session);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Always return 200 to prevent Stripe from retrying indefinitely.
    // Partial failures (e.g. order created but items failed) are handled
    // by the idempotency check which verifies items exist.
    return NextResponse.json({ received: true });
  }
}

// Helper function to find user from metadata
function getUserIdFromMetadata(metadata: any): string | null {
  const id = metadata?.user_id;
  return id && id !== "guest" ? id : null;
}

// ---------------------------------------------------------------------------
// One-time payment checkout handler (e-commerce orders)
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log(`Handling checkout completed: ${session.id}`);
    const supabase = createServiceClient();

    // Idempotency: skip if order already exists with items for this checkout session
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("stripe_checkout_session_id", session.id)
      .maybeSingle();

    if (existingOrder) {
      // Verify items were also created (handles partial failure on previous attempt)
      const { count: itemCount } = await supabase
        .from("order_items")
        .select("*", { count: "exact", head: true })
        .eq("order_id", existingOrder.id);

      if (itemCount && itemCount > 0) {
        console.log(
          `Order ${existingOrder.order_number} already exists with ${itemCount} items for session ${session.id}, skipping`
        );
        return;
      }
      // Order exists but items are missing — continue to re-insert items
      console.log(
        `Order ${existingOrder.order_number} exists but has no items — re-inserting items`
      );
    }

    // 1. Generate order number via DB function
    let orderNumber = `RB-${Date.now().toString(36).toUpperCase()}`;
    try {
      const { data: rpcData } = await supabase.rpc("generate_order_number");
      if (rpcData) orderNumber = rpcData;
    } catch {
      console.log("generate_order_number RPC not available, using fallback");
    }

    // 2. Retrieve line items with product data
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
      limit: 100,
    });

    // 3. Extract shipping
    const shippingDetails = (session as any).shipping_details;
    const shippingAddress = shippingDetails?.address;
    const shippingName = shippingDetails?.name ?? null;

    // 4. Financials (amounts are in cents)
    const subtotal = session.amount_subtotal ?? 0;
    const total = session.amount_total ?? 0;
    const shippingCost = (session as any).shipping_cost?.amount_total ?? 0;
    const tax = (session as any).total_details?.amount_tax ?? 0;
    const discount = (session as any).total_details?.amount_discount ?? 0;

    // 5. User info
    const userId = session.metadata?.user_id;
    const isGuest = !userId || userId === "guest";
    const customerEmail =
      session.customer_details?.email ?? (session as any).customer_email ?? null;

    // 6. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: isGuest ? null : userId,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent as any)?.id ?? null,
        email: customerEmail,
        status: "confirmed",
        payment_status: "paid",
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax_amount: tax,
        discount_amount: discount,
        total: total,
        currency: session.currency ?? "usd",
        shipping_name: shippingName,
        shipping_address_line1: shippingAddress?.line1 ?? null,
        shipping_address_line2: shippingAddress?.line2 ?? null,
        shipping_city: shippingAddress?.city ?? null,
        shipping_state: shippingAddress?.state ?? null,
        shipping_postal_code: shippingAddress?.postal_code ?? null,
        shipping_country: shippingAddress?.country ?? null,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Error inserting order:", orderError);
      return;
    }

    console.log(`Created order ${orderNumber} with id ${order.id}`);

    // 7. Parse per-item variant/engraving data from session metadata
    let itemVariantsMap: Record<string, string> = {};
    try {
      const raw = session.metadata?.item_variants;
      if (raw) {
        const parsed = JSON.parse(raw) as { priceId: string; variant: string }[];
        for (const v of parsed) {
          itemVariantsMap[v.priceId] = v.variant;
        }
      }
    } catch {
      console.log("Could not parse item_variants metadata");
    }

    // 8. Insert order items (snapshot product data at purchase time)
    const orderItems = lineItems.data.map((li) => {
      const price = li.price;
      const product =
        price && typeof price.product !== "string"
          ? (price.product as Stripe.Product)
          : null;

      const unitPrice = li.price?.unit_amount ?? 0;
      const qty = li.quantity ?? 1;

      // Parse variant string: "9" → size only, "9|Forever" → size + engraving
      const variantRaw = price?.id ? itemVariantsMap[price.id] : null;
      let variantName: string | null = null;
      let engravingText: string | null = null;

      if (variantRaw) {
        const parts = variantRaw.split("|");
        variantName = parts[0] || null;
        engravingText = parts[1] || null;
      }

      return {
        order_id: order.id,
        stripe_product_id: product?.id ?? null,
        stripe_price_id: price?.id ?? null,
        product_name: li.description ?? product?.name ?? "Unknown",
        product_image_url: product?.images?.[0] ?? null,
        variant_name: variantName,
        engraving_text: engravingText,
        collection: product?.metadata?.collection ?? null,
        unit_price: unitPrice,
        quantity: qty,
        total_price: unitPrice * qty,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error inserting order items:", itemsError);
    }

    // 9. Insert into payment_history
    if (!isGuest) {
      const { error: paymentError } = await supabase
        .from("payment_history")
        .insert({
          user_id: userId,
          order_id: order.id,
          amount: total,
          currency: session.currency ?? "usd",
          status: "succeeded",
          description: `Order ${orderNumber}`,
        });

      if (paymentError) {
        console.error("Error inserting payment history:", paymentError);
      }
    }

    // 10. Clear cart items for logged-in user
    if (!isGuest) {
      await supabase.from("cart_items").delete().eq("user_id", userId);
    }

    // 11. Send order confirmation email
    if (customerEmail) {
      try {
        await sendEmail("order-confirmation", customerEmail, {
          orderNumber,
          items: lineItems.data.map((li) => {
            const product =
              li.price && typeof li.price.product !== "string"
                ? (li.price.product as Stripe.Product)
                : null;
            return {
              name: li.description ?? product?.name ?? "Item",
              quantity: li.quantity ?? 1,
              unitPrice: li.price?.unit_amount ?? 0,
              image: product?.images?.[0] ?? null,
            };
          }),
          subtotal,
          shipping: shippingCost,
          tax,
          total,
          shippingAddress: shippingAddress
            ? {
                name: shippingName ?? undefined,
                line1: shippingAddress.line1 ?? undefined,
                line2: shippingAddress.line2 ?? undefined,
                city: shippingAddress.city ?? undefined,
                state: shippingAddress.state ?? undefined,
                postalCode: shippingAddress.postal_code ?? undefined,
                country: shippingAddress.country ?? undefined,
              }
            : undefined,
          orderUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world"}/dashboard/orders`,
        });
        console.log(`Order confirmation email sent to ${customerEmail}`);
      } catch (emailErr) {
        console.error("Failed to send order confirmation email:", emailErr);
      }
    }

    // 12. Notify GHL for post-purchase marketing automation (non-blocking)
    notifyPurchase({
      email: customerEmail ?? "",
      first_name: session.customer_details?.name?.split(" ")[0],
      last_name: session.customer_details?.name?.split(" ").slice(1).join(" "),
      order_number: orderNumber,
      order_total: total,
      currency: session.currency ?? "usd",
      items: orderItems.map((item) => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
      })),
      shipping_address: shippingAddress
        ? {
            city: shippingAddress.city ?? undefined,
            state: shippingAddress.state ?? undefined,
            country: shippingAddress.country ?? undefined,
          }
        : undefined,
    });

    console.log(`Checkout completed handler finished for ${orderNumber}`);
  } catch (error) {
    console.error("Error handling checkout completed:", error);
  }
}
