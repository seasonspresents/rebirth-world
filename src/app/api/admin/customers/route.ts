import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

interface CustomerAggregate {
  email: string;
  name: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  userId: string | null;
}

export async function GET() {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const supabase = createServiceClient();

  const { data: orders, error: queryError } = await supabase
    .from("orders")
    .select("email, user_id, shipping_name, total, created_at")
    .order("created_at", { ascending: false });

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  // Aggregate customers by email
  const customerMap = new Map<string, CustomerAggregate>();

  for (const order of orders ?? []) {
    const existing = customerMap.get(order.email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total ?? 0;
      // Keep the most recent name
      if (!existing.name && order.shipping_name) {
        existing.name = order.shipping_name;
      }
      // Keep the most recent user_id
      if (!existing.userId && order.user_id) {
        existing.userId = order.user_id;
      }
    } else {
      customerMap.set(order.email, {
        email: order.email,
        name: order.shipping_name,
        orderCount: 1,
        totalSpent: order.total ?? 0,
        lastOrderDate: order.created_at,
        userId: order.user_id,
      });
    }
  }

  // Sort by total spent descending
  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return NextResponse.json({ customers });
}
