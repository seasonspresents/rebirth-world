import { createClient } from "@/lib/supabase/server";
import {
  buildReviewSummary,
  emptyReviewSummary,
  type ReviewDisplayItem,
  type ReviewSummary,
} from "@/lib/review-types";

type ReviewRow = {
  id: string;
  product_stripe_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  photos: string[] | null;
  verified_purchase: boolean | null;
  admin_response: string | null;
  created_at: string;
};

const APPROVED_REVIEW_SELECT =
  "id, product_stripe_id, rating, title, body, photos, verified_purchase, admin_response, created_at";

function toDisplayReview(row: ReviewRow): ReviewDisplayItem {
  return {
    id: row.id,
    productStripeId: row.product_stripe_id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    photos: Array.isArray(row.photos) ? row.photos : [],
    verifiedPurchase: row.verified_purchase ?? false,
    adminResponse: row.admin_response,
    createdAt: row.created_at,
  };
}

function logReviewReadError(scope: string, error: unknown) {
  const serialized = JSON.stringify(error);
  if (
    serialized.includes("public.reviews") ||
    serialized.includes("PGRST205")
  ) {
    return;
  }

  if (error && typeof error === "object" && "code" in error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      return;
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = String(error.message);
    if (
      message.includes("Could not find the table 'public.reviews'") ||
      message.includes("Dynamic server usage")
    ) {
      return;
    }
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    String(error.message).includes("schema cache")
  ) {
    return;
  }

  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    error.digest === "DYNAMIC_SERVER_USAGE"
  ) {
    return;
  }

  console.warn(`[reviews] ${scope} read failed`, error);
}

export async function getApprovedReviewsForProduct(
  productStripeId: string,
  limit = 20
): Promise<{ reviews: ReviewDisplayItem[]; summary: ReviewSummary }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(APPROVED_REVIEW_SELECT)
      .eq("product_stripe_id", productStripeId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logReviewReadError("product", error);
      return {
        reviews: [],
        summary: emptyReviewSummary(productStripeId),
      };
    }

    const reviews = ((data ?? []) as ReviewRow[]).map(toDisplayReview);

    return {
      reviews,
      summary: buildReviewSummary(productStripeId, reviews),
    };
  } catch (error) {
    logReviewReadError("product", error);
    return {
      reviews: [],
      summary: emptyReviewSummary(productStripeId),
    };
  }
}

export async function getApprovedReviews(
  limit = 6
): Promise<ReviewDisplayItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(APPROVED_REVIEW_SELECT)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logReviewReadError("latest", error);
      return [];
    }

    return ((data ?? []) as ReviewRow[]).map(toDisplayReview);
  } catch (error) {
    logReviewReadError("latest", error);
    return [];
  }
}

export async function getReviewSummariesForProducts(
  productStripeIds: string[]
): Promise<Record<string, ReviewSummary>> {
  const uniqueProductIds = [...new Set(productStripeIds.filter(Boolean))];
  const summaries = Object.fromEntries(
    uniqueProductIds.map((id) => [id, emptyReviewSummary(id)])
  );

  if (uniqueProductIds.length === 0) {
    return summaries;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(APPROVED_REVIEW_SELECT)
      .eq("status", "approved")
      .in("product_stripe_id", uniqueProductIds);

    if (error) {
      logReviewReadError("summary", error);
      return summaries;
    }

    const reviews = ((data ?? []) as ReviewRow[]).map(toDisplayReview);
    for (const productId of uniqueProductIds) {
      summaries[productId] = buildReviewSummary(productId, reviews);
    }

    return summaries;
  } catch (error) {
    logReviewReadError("summary", error);
    return summaries;
  }
}
