import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return NextResponse.json({ order, items: items ?? [] });
}

const updateSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  tracking_number: z.string().optional(),
  tracking_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Fetch current order state for safe transitions
  const { data: current } = await supabase
    .from("orders")
    .select("status, shipped_at, delivered_at")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;

    // Set fulfillment_status in sync with status
    if (parsed.data.status === "shipped" || parsed.data.status === "delivered") {
      updates.fulfillment_status = "fulfilled";
    }

    // Only set shipped_at if not already set in DB
    if (parsed.data.status === "shipped" && !current.shipped_at) {
      updates.shipped_at = new Date().toISOString();
    }

    // Only set delivered_at if not already set in DB
    if (parsed.data.status === "delivered" && !current.delivered_at) {
      updates.delivered_at = new Date().toISOString();
    }
  }

  if (parsed.data.tracking_number !== undefined) updates.tracking_number = parsed.data.tracking_number;
  if (parsed.data.tracking_url !== undefined) updates.tracking_url = parsed.data.tracking_url || null;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const { data: order, error: updateError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ order });
}
