import { NextRequest, NextResponse } from "next/server";
import {
  isReviewableOrder,
  normalizeNullableText,
  reviewCreateSchema,
} from "@/lib/reviews";
import { createClient, createServiceClient } from "@/lib/supabase/server";

type OrderItemRow = {
  id: string;
  order_id: string;
  stripe_product_id: string;
};

type OrderRow = {
  id: string;
  user_id: string | null;
  status: string;
  payment_status: string;
};

function ineligibleReviewResponse() {
  return NextResponse.json(
    { error: "Order item is not eligible for review" },
    { status: 403 }
  );
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const productId =
    req.nextUrl.searchParams.get("productId") ??
    req.nextUrl.searchParams.get("product_stripe_id");
  const page = Math.max(
    Number.parseInt(req.nextUrl.searchParams.get("page") || "1", 10),
    1
  );
  const limit = Math.min(
    Math.max(
      Number.parseInt(req.nextUrl.searchParams.get("limit") || "50", 10),
      1
    ),
    100
  );
  const offset = (page - 1) * limit;

  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (productId) {
    query = query.eq("product_stripe_id", productId);
  }

  const { data: reviews, count, error } = await query;

  if (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reviews: reviews ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reviewCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const reviewInput = parsed.data;
  const serviceSupabase = createServiceClient();

  const { data: orderItem, error: orderItemError } = await serviceSupabase
    .from("order_items")
    .select("id, order_id, stripe_product_id")
    .eq("id", reviewInput.orderItemId)
    .maybeSingle<OrderItemRow>();

  if (orderItemError) {
    console.error("Review order item lookup error:", orderItemError);
    return NextResponse.json(
      { error: "Failed to verify purchase" },
      { status: 500 }
    );
  }

  if (!orderItem) {
    return ineligibleReviewResponse();
  }

  if (
    reviewInput.productStripeId &&
    reviewInput.productStripeId !== orderItem.stripe_product_id
  ) {
    return NextResponse.json(
      { error: "Product does not match the purchased order item" },
      { status: 400 }
    );
  }

  const { data: order, error: orderError } = await serviceSupabase
    .from("orders")
    .select("id, user_id, status, payment_status")
    .eq("id", orderItem.order_id)
    .maybeSingle<OrderRow>();

  if (orderError) {
    console.error("Review order lookup error:", orderError);
    return NextResponse.json(
      { error: "Failed to verify purchase" },
      { status: 500 }
    );
  }

  if (!order || order.user_id !== user.id || !isReviewableOrder(order)) {
    return ineligibleReviewResponse();
  }

  const { data: existingReview, error: existingReviewError } =
    await serviceSupabase
      .from("reviews")
      .select("id")
      .eq("order_item_id", orderItem.id)
      .eq("user_id", user.id)
      .maybeSingle<{ id: string }>();

  if (existingReviewError) {
    console.error("Review duplicate lookup error:", existingReviewError);
    return NextResponse.json(
      { error: "Failed to verify review status" },
      { status: 500 }
    );
  }

  if (existingReview) {
    return NextResponse.json(
      { error: "A review already exists for this order item" },
      { status: 409 }
    );
  }

  const { data: review, error: insertError } = await supabase
    .from("reviews")
    .insert({
      order_item_id: orderItem.id,
      user_id: user.id,
      product_stripe_id: orderItem.stripe_product_id,
      rating: reviewInput.rating,
      title: normalizeNullableText(reviewInput.title),
      body: normalizeNullableText(reviewInput.body),
      photos: reviewInput.photos,
      verified_purchase: true,
      status: "pending",
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "A review already exists for this order item" },
        { status: 409 }
      );
    }

    console.error("Review insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ review }, { status: 201 });
}
