/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Stripe webhook handler for Rebirth World.
 *
 * Flow per event (roundtable 2026-04-24, red tier):
 *
 *   1. Verify svix signature. 400 on bad sig.
 *   2. Insert event into stripe_webhook_events outbox.
 *      - 23505 unique_violation => duplicate delivery, return 200 immediately.
 *   3. Route to handler by event.type.
 *   4. On handler success: stamp processed_at, return 200 {received: true}.
 *   5. On handler error: stamp processing_error, return 500 so Stripe retries.
 *
 * Pattern asymmetry: Stripe RETRIES on 500, so we want 500 on transient
 * failures. This is the OPPOSITE of Resend, which retry-storms on anything
 * but 200. Do not copy the Resend pattern into this handler.
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/payments/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/emails";
import { notifyPurchase } from "@/lib/ghl";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // 1. Verify signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // 2. Insert into outbox (idempotency gate)
  const { error: insertError } = await supabase
    .from("stripe_webhook_events")
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      api_version: event.api_version,
      livemode: event.livemode,
      stripe_created_at: new Date(event.created * 1000).toISOString(),
      payload: event as unknown as Record<string, unknown>,
    });

  if (insertError) {
    // 23505 unique_violation => duplicate delivery. Short-circuit.
    if (insertError.code === "23505") {
      console.log(`Duplicate event ${event.id} (${event.type}), skipping`);
      return NextResponse.json({ received: true, duplicate: true });
    }
    // Any other insert error is a real infra failure — tell Stripe to retry.
    console.error("Failed to insert webhook event:", insertError);
    return NextResponse.json(
      { error: "Failed to persist event" },
      { status: 500 }
    );
  }

  // 3. Route + process
  try {
    console.log(`Processing webhook event ${event.id} (${event.type})`);

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        // Both events carry the completed Checkout Session. The async variant
        // fires for Klarna / Afterpay / Affirm / Cash App / ACH / Amazon Pay /
        // bank transfer after the buyer completes off-site authorization.
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "payment") {
          await handleCheckoutCompleted(session);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        await handleDisputeCreated(dispute);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(intent);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // 4. Success: stamp processed_at, return 200
    await supabase
      .from("stripe_webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("stripe_event_id", event.id);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    // 5. Handler failure: stamp error, return 500 so Stripe retries.
    console.error("Webhook handler error:", err);
    await supabase
      .from("stripe_webhook_events")
      .update({ processing_error: err?.message ?? String(err) })
      .eq("stripe_event_id", event.id);

    return NextResponse.json(
      { error: "Handler failed, retry expected" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getUserIdFromMetadata(metadata: any): string | null {
  const id = metadata?.user_id;
  return id && id !== "guest" ? id : null;
}

// ---------------------------------------------------------------------------
// Handler: checkout.session.completed + async_payment_succeeded
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`Handling checkout completed: ${session.id}`);
  const supabase = createServiceClient();

  // Idempotency check inside the handler too — if an earlier delivery of the
  // same session (different event, e.g. completed then async_payment_succeeded)
  // already created the order, skip re-creation.
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();

  if (existingOrder) {
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
    console.log(
      `Order ${existingOrder.order_number} exists but has no items — re-inserting items`
    );
  }

  // 1. Order number
  let orderNumber = `RB-${Date.now().toString(36).toUpperCase()}`;
  try {
    const { data: rpcData } = await supabase.rpc("generate_order_number");
    if (rpcData) orderNumber = rpcData;
  } catch {
    console.log("generate_order_number RPC not available, using fallback");
  }

  // 2. Line items
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  // 3. Shipping
  const shippingDetails = (session as any).shipping_details;
  const shippingAddress = shippingDetails?.address;
  const shippingName = shippingDetails?.name ?? null;

  // 4. Financials (cents)
  const subtotal = session.amount_subtotal ?? 0;
  const total = session.amount_total ?? 0;
  const shippingCost = (session as any).shipping_cost?.amount_total ?? 0;
  const tax = (session as any).total_details?.amount_tax ?? 0;
  const discount = (session as any).total_details?.amount_discount ?? 0;

  // 5. User
  const userId = getUserIdFromMetadata(session.metadata);
  const isGuest = userId === null;
  const customerEmail =
    session.customer_details?.email ?? (session as any).customer_email ?? null;

  // 6. Insert order (upsert by session_id for idempotency)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .upsert(
      {
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
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: tax,
        discount_amount: discount,
        total,
        currency: session.currency ?? "usd",
        shipping_name: shippingName,
        shipping_address_line1: shippingAddress?.line1 ?? null,
        shipping_address_line2: shippingAddress?.line2 ?? null,
        shipping_city: shippingAddress?.city ?? null,
        shipping_state: shippingAddress?.state ?? null,
        shipping_postal_code: shippingAddress?.postal_code ?? null,
        shipping_country: shippingAddress?.country ?? null,
      },
      { onConflict: "stripe_checkout_session_id" }
    )
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(`Order insert failed: ${orderError?.message}`);
  }

  console.log(`Created/updated order ${orderNumber} with id ${order.id}`);

  // 7. Variant metadata
  const itemVariantsMap: Record<string, string> = {};
  try {
    const raw = session.metadata?.item_variants;
    if (raw) {
      const parsed = JSON.parse(raw) as { priceId: string; variant: string }[];
      for (const v of parsed) itemVariantsMap[v.priceId] = v.variant;
    }
  } catch {
    console.log("Could not parse item_variants metadata");
  }

  // 8. Order items (upsert is safer if this retries)
  const orderItems = lineItems.data.map((li) => {
    const price = li.price;
    const product =
      price && typeof price.product !== "string"
        ? (price.product as Stripe.Product)
        : null;

    const unitPrice = li.price?.unit_amount ?? 0;
    const qty = li.quantity ?? 1;

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

  // Delete any existing items for this order first (handles retry after partial failure)
  await supabase.from("order_items").delete().eq("order_id", order.id);
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw new Error(`Order items insert failed: ${itemsError.message}`);
  }

  // 9. Payment history (record for all orders, guests included — fixes O9)
  const { error: paymentError } = await supabase
    .from("payment_history")
    .insert({
      user_id: isGuest ? null : userId,
      order_id: order.id,
      amount: total,
      currency: session.currency ?? "usd",
      status: "succeeded",
      description: `Order ${orderNumber}`,
    });

  if (paymentError) {
    console.error("payment_history insert failed (non-fatal):", paymentError);
  }

  // 10. Clear cart for logged-in user
  if (!isGuest) {
    await supabase.from("cart_items").delete().eq("user_id", userId);
  }

  // 11. Order confirmation email
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
      // Email failure is non-fatal — order is recorded, we can resend manually.
      console.error("Order confirmation email failed:", emailErr);
    }
  }

  // 12. GHL notify (non-blocking, best-effort)
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
}

// ---------------------------------------------------------------------------
// Handler: checkout.session.expired
// Tag the abandoned session in our outbox; abandoned-cart email flow consumes
// this later (Resend slice). No-op DB write for now — the outbox row is the
// signal.
// ---------------------------------------------------------------------------

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  console.log(
    `Checkout session expired: ${session.id}  email=${session.customer_details?.email ?? "n/a"}`
  );
  // Abandoned-cart recovery emails wire in during the Resend slice.
}

// ---------------------------------------------------------------------------
// Handler: charge.refunded
// Update the linked order's payment_status.
// ---------------------------------------------------------------------------

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`Charge refunded: ${charge.id} amount_refunded=${charge.amount_refunded}`);
  const supabase = createServiceClient();

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) {
    console.log("Refund had no payment_intent, nothing to update");
    return;
  }

  const isFull = charge.amount_refunded === charge.amount;
  const newPaymentStatus = isFull ? "refunded" : "partially_refunded";
  const newStatus = isFull ? "refunded" : "confirmed";

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: newPaymentStatus,
      status: newStatus,
    })
    .eq("stripe_payment_intent_id", paymentIntentId);

  if (error) {
    throw new Error(`Failed to mark order refunded: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Handler: charge.dispute.created
// Flag the order for support review. Uses notes column.
// ---------------------------------------------------------------------------

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  console.log(
    `Dispute created: ${dispute.id} reason=${dispute.reason} amount=${dispute.amount}`
  );
  const supabase = createServiceClient();

  const chargeId =
    typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;

  // Look up payment_intent from charge
  let paymentIntentId: string | undefined;
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    paymentIntentId =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id;
  } catch (err) {
    console.error("Could not retrieve charge for dispute:", err);
    return;
  }

  if (!paymentIntentId) return;

  const disputeNote = `[DISPUTE ${dispute.id}] reason=${dispute.reason} amount=${dispute.amount} status=${dispute.status} created=${new Date(dispute.created * 1000).toISOString()}`;

  const { error } = await supabase
    .from("orders")
    .update({
      notes: disputeNote,
      status: "cancelled", // dispute => treat as cancelled for fulfillment hold
    })
    .eq("stripe_payment_intent_id", paymentIntentId);

  if (error) {
    throw new Error(`Failed to flag order for dispute: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Handler: payment_intent.payment_failed
// Log only for now — surfaces in outbox for analytics.
// ---------------------------------------------------------------------------

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  console.log(
    `PaymentIntent failed: ${intent.id} last_error=${intent.last_payment_error?.code} msg=${intent.last_payment_error?.message}`
  );
  // Future: trigger retry-payment email via Resend slice.
}
