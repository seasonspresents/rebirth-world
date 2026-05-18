import { NextRequest, NextResponse } from "next/server";
import { normalizeNullableText, reviewUpdateSchema } from "@/lib/reviews";
import { createClient } from "@/lib/supabase/server";

type ReviewRow = {
  id: string;
  status: string;
  user_id: string;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const parsed = reviewUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const { data: currentReview, error: fetchError } = await supabase
    .from("reviews")
    .select("id, status, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<ReviewRow>();

  if (fetchError) {
    console.error("Review fetch error:", fetchError);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }

  if (!currentReview) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (currentReview.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending reviews can be updated" },
      { status: 409 }
    );
  }

  const updates: Record<string, unknown> = {};
  const reviewInput = parsed.data;

  if (reviewInput.rating !== undefined) updates.rating = reviewInput.rating;
  if (reviewInput.title !== undefined) {
    updates.title = normalizeNullableText(reviewInput.title);
  }
  if (reviewInput.body !== undefined) {
    updates.body = normalizeNullableText(reviewInput.body);
  }
  if (reviewInput.photos !== undefined) updates.photos = reviewInput.photos;

  const { data: review, error: updateError } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", currentReview.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateError) {
    console.error("Review update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ review });
}
