import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const supabase = createServiceClient();

  // Current month range
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  // Fetch this month's orders for KPI metrics
  const { data: monthOrders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .gte("created_at", monthStart)
    .lte("created_at", monthEnd);

  const orders = monthOrders ?? [];
  const orderCount = orders.length;
  const activeOrders = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "refunded"
  );
  const revenue = activeOrders.reduce((sum, o) => sum + (o.total ?? 0), 0) / 100;
  const avgOrderValue = activeOrders.length > 0 ? revenue / activeOrders.length : 0;
  const pendingShipments = orders.filter(
    (o) => o.status === "confirmed" || o.status === "processing"
  ).length;

  // Fetch last 90 days of orders for chart
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: chartOrders } = await supabase
    .from("orders")
    .select("total, created_at")
    .gte("created_at", ninetyDaysAgo.toISOString());

  // Aggregate by date
  const byDate = new Map<string, { orders: number; revenue: number }>();
  for (const o of chartOrders ?? []) {
    const date = o.created_at.slice(0, 10);
    const existing = byDate.get(date) ?? { orders: 0, revenue: 0 };
    existing.orders += 1;
    existing.revenue += (o.total ?? 0) / 100;
    byDate.set(date, existing);
  }

  // Fill in all dates (including zero-order days) for a continuous chart
  const chartData: { date: string; orders: number; revenue: number }[] = [];
  const cursor = new Date(ninetyDaysAgo);
  const today = new Date();
  while (cursor <= today) {
    const dateStr = cursor.toISOString().slice(0, 10);
    const data = byDate.get(dateStr) ?? { orders: 0, revenue: 0 };
    chartData.push({ date: dateStr, ...data });
    cursor.setDate(cursor.getDate() + 1);
  }

  return NextResponse.json({
    metrics: { orderCount, revenue, avgOrderValue, pendingShipments },
    chartData,
  });
}
