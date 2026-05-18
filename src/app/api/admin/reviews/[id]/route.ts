import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { normalizeNullableText, reviewModerationSchema } from "@/lib/reviews";
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

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (reviewError || !review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error, status } = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error }, { status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reviewModerationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};

  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
  }

  if (parsed.data.adminResponse !== undefined) {
    updates.admin_response = normalizeNullableText(parsed.data.adminResponse);
    updates.admin_response_at = updates.admin_response
      ? new Date().toISOString()
      : null;
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: review, error: updateError } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Review moderation error:", updateError);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ review });
}
