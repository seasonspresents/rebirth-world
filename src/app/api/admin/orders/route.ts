import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const supabase = createServiceClient();

  const statusFilter = req.nextUrl.searchParams.get("status");
  const page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 1), 100);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: orders, count, error: queryError } = await query;

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  // Fetch item counts for all orders
  const orderIds = (orders ?? []).map((o) => o.id);
  let itemCounts: Record<string, number> = {};

  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id")
      .in("order_id", orderIds);

    if (items) {
      for (const item of items) {
        itemCounts[item.order_id] = (itemCounts[item.order_id] || 0) + 1;
      }
    }
  }

  return NextResponse.json({
    orders: orders ?? [],
    itemCounts,
    total: count ?? 0,
    page,
    limit,
  });
}
