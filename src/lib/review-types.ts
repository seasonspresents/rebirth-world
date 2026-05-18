export interface ReviewDisplayItem {
  id: string;
  productStripeId: string;
  rating: number;
  title: string | null;
  body: string | null;
  photos: string[];
  verifiedPurchase: boolean;
  adminResponse: string | null;
  createdAt: string;
}

export interface ReviewSummary {
  productStripeId: string;
  averageRating: number;
  reviewCount: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export function emptyReviewSummary(productStripeId: string): ReviewSummary {
  return {
    productStripeId,
    averageRating: 0,
    reviewCount: 0,
    breakdown: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };
}

export function buildReviewSummary(
  productStripeId: string,
  reviews: ReviewDisplayItem[]
): ReviewSummary {
  const summary = emptyReviewSummary(productStripeId);
  const matchingReviews = reviews.filter(
    (review) => review.productStripeId === productStripeId
  );

  if (matchingReviews.length === 0) {
    return summary;
  }

  const ratingTotal = matchingReviews.reduce((total, review) => {
    const rating = Math.min(Math.max(Math.round(review.rating), 1), 5) as
      | 1
      | 2
      | 3
      | 4
      | 5;

    summary.breakdown[rating] += 1;
    return total + rating;
  }, 0);

  return {
    ...summary,
    averageRating: ratingTotal / matchingReviews.length,
    reviewCount: matchingReviews.length,
  };
}

export function formatReviewCount(count: number) {
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}
