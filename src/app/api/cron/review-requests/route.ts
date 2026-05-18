import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails";
import { createServiceClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  order_number: string;
  email: string;
  user_id: string | null;
  shipping_name: string | null;
  status: string;
  delivered_at: string | null;
  review_request_sent_at: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  stripe_product_id: string;
  product_name: string;
  product_image_url: string | null;
};

type ExistingReviewRow = {
  order_item_id: string;
};

const ORDER_SELECT =
  "id, order_number, email, user_id, shipping_name, status, delivered_at, review_request_sent_at";
const REVIEW_WAIT_DAYS = 7;
const REVIEW_WAIT_MS = REVIEW_WAIT_DAYS * 24 * 60 * 60 * 1000;

function isEligible(order: OrderRow, eligibleBeforeMs: number, force: boolean) {
  if (order.status !== "delivered") return false;
  if (!order.user_id) return false;
  if (order.review_request_sent_at) return false;
  if (force) return true;
  if (!order.delivered_at) return false;

  return new Date(order.delivered_at).getTime() <= eligibleBeforeMs;
}

function buildReviewUrl(siteUrl: string, order: OrderRow, item: OrderItemRow) {
  const url = new URL("/review", siteUrl);
  url.searchParams.set("order", order.id);
  url.searchParams.set("item", item.id);
  url.searchParams.set("orderItemId", item.id);
  url.searchParams.set("productId", item.stripe_product_id);
  url.searchParams.set("productName", item.product_name);
  return url.toString();
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get("dry_run") === "true";
  const manualOrderId = req.nextUrl.searchParams.get("order_id");
  const force = req.nextUrl.searchParams.get("force") === "true";
  const limit = Math.min(
    Math.max(
      Number.parseInt(req.nextUrl.searchParams.get("limit") || "25", 10),
      1
    ),
    100
  );

  if (force && !manualOrderId) {
    return NextResponse.json(
      { error: "force=true requires order_id" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const eligibleBeforeMs = Date.now() - REVIEW_WAIT_MS;
  const eligibleBefore = new Date(eligibleBeforeMs).toISOString();
  let orders: OrderRow[] = [];

  if (manualOrderId) {
    const { data: order, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("id", manualOrderId)
      .maybeSingle<OrderRow>();

    if (error) {
      console.error("Review request manual order lookup failed:", error);
      return NextResponse.json(
        { error: "Order lookup failed" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    orders = isEligible(order, eligibleBeforeMs, force) ? [order] : [];
  } else {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("status", "delivered")
      .not("user_id", "is", null)
      .is("review_request_sent_at", null)
      .not("delivered_at", "is", null)
      .lte("delivered_at", eligibleBefore)
      .order("delivered_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Review request order query failed:", error);
      return NextResponse.json(
        { error: "Order query failed" },
        { status: 500 }
      );
    }

    orders = (data ?? []) as OrderRow[];
  }

  if (orders.length === 0) {
    return NextResponse.json({
      success: true,
      dryRun,
      mode: manualOrderId ? "manual" : "scheduled",
      eligibleBefore,
      eligibleOrders: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
    });
  }

  const orderIds = orders.map((order) => order.id);
  const { data: orderItems, error: orderItemsError } = await supabase
    .from("order_items")
    .select("id, order_id, stripe_product_id, product_name, product_image_url")
    .in("order_id", orderIds);

  if (orderItemsError) {
    console.error("Review request order item query failed:", orderItemsError);
    return NextResponse.json(
      { error: "Order item query failed" },
      { status: 500 }
    );
  }

  const items = (orderItems ?? []) as OrderItemRow[];
  const itemIds = items.map((item) => item.id);
  let reviewedItemIds = new Set<string>();

  if (itemIds.length > 0) {
    const { data: existingReviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("order_item_id")
      .in("order_item_id", itemIds);

    if (reviewsError) {
      console.error(
        "Review request existing review query failed:",
        reviewsError
      );
      return NextResponse.json(
        { error: "Review query failed" },
        { status: 500 }
      );
    }

    reviewedItemIds = new Set(
      ((existingReviews ?? []) as ExistingReviewRow[]).map(
        (review) => review.order_item_id
      )
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";
  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    if (reviewedItemIds.has(item.id)) continue;
    const current = itemsByOrder.get(item.order_id) ?? [];
    current.push(item);
    itemsByOrder.set(item.order_id, current);
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  const sample: Array<{
    orderNumber: string;
    email: string;
    itemCount: number;
    reviewUrls: string[];
  }> = [];

  for (const order of orders) {
    const reviewItems = (itemsByOrder.get(order.id) ?? []).map((item) => ({
      name: item.product_name,
      image: item.product_image_url,
      reviewUrl: buildReviewUrl(siteUrl, order, item),
    }));

    if (reviewItems.length === 0) {
      skipped += 1;
      continue;
    }

    sample.push({
      orderNumber: order.order_number,
      email: order.email,
      itemCount: reviewItems.length,
      reviewUrls: reviewItems.map((item) => item.reviewUrl),
    });

    if (dryRun) continue;

    try {
      await sendEmail("review-request", order.email, {
        orderNumber: order.order_number,
        shippingName: order.shipping_name || undefined,
        items: reviewItems,
        siteUrl,
      });

      const { error: updateError } = await supabase
        .from("orders")
        .update({ review_request_sent_at: new Date().toISOString() })
        .eq("id", order.id);

      if (updateError) {
        console.error("Review request sent-at update failed:", updateError);
        failed += 1;
        continue;
      }

      sent += 1;
    } catch (emailError) {
      console.error("Review request email failed:", emailError);
      failed += 1;
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    mode: manualOrderId ? "manual" : "scheduled",
    force,
    eligibleBefore,
    eligibleOrders: orders.length,
    sent,
    skipped,
    failed,
    sample: sample.slice(0, 5),
  });
}
