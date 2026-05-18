import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { reviewStatusSchema } from "@/lib/reviews";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const statusFilter = req.nextUrl.searchParams.get("status") ?? "pending";
  const productId =
    req.nextUrl.searchParams.get("productId") ??
    req.nextUrl.searchParams.get("product_stripe_id");
  const userId = req.nextUrl.searchParams.get("userId");
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

  if (statusFilter !== "all") {
    const parsedStatus = reviewStatusSchema.safeParse(statusFilter);
    if (!parsedStatus.success) {
      return NextResponse.json(
        { error: "Invalid review status" },
        { status: 400 }
      );
    }
  }

  const supabase = createServiceClient();
  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (productId) {
    query = query.eq("product_stripe_id", productId);
  }

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: reviews, count, error: queryError } = await query;

  if (queryError) {
    console.error("Admin reviews fetch error:", queryError);
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
