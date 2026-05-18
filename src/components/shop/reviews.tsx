import Image from "next/image";
import { BadgeCheck, MessageSquareReply } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/reviews/rating-stars";
import {
  formatReviewCount,
  type ReviewDisplayItem,
  type ReviewSummary,
} from "@/lib/review-types";

interface ProductReviewsProps {
  productName: string;
  reviews: ReviewDisplayItem[];
  summary: ReviewSummary;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ProductReviews({
  productName,
  reviews,
  summary,
}: ProductReviewsProps) {
  const hasReviews = summary.reviewCount > 0;

  return (
    <section className="bg-background border-y px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-3 text-sm font-medium uppercase">
                Verified reviews
              </p>
              <h2 className="max-w-[12ch] font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold md:text-5xl">
                What buyers say
              </h2>
            </div>

            {hasReviews ? (
              <div className="space-y-5">
                <div className="flex items-end gap-3">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-semibold">
                    {summary.averageRating.toFixed(1)}
                  </span>
                  <div className="pb-1">
                    <RatingStars
                      rating={summary.averageRating}
                      label={`${summary.averageRating.toFixed(1)} out of 5 stars`}
                    />
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatReviewCount(summary.reviewCount)} for {productName}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      summary.breakdown[rating as 1 | 2 | 3 | 4 | 5] ?? 0;
                    const percent =
                      summary.reviewCount > 0
                        ? (count / summary.reviewCount) * 100
                        : 0;

                    return (
                      <div
                        key={rating}
                        className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-3 text-sm"
                      >
                        <span className="text-muted-foreground">{rating}★</span>
                        <div className="bg-muted h-2 overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border-border bg-muted/30 rounded-lg border p-5">
                <p className="font-medium">No approved reviews yet.</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Verified customer reviews will appear here once approved.
                </p>
              </div>
            )}
          </div>

          {hasReviews && (
            <div className="grid gap-5">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <RatingStars
                      rating={review.rating}
                      label={`${review.rating} out of 5 stars`}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {review.verifiedPurchase && (
                        <Badge variant="secondary" className="rounded-md">
                          <BadgeCheck className="h-3 w-3" />
                          Verified purchase
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-xs">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  {review.title && (
                    <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold">
                      {review.title}
                    </h3>
                  )}
                  {review.body && (
                    <p className="text-muted-foreground mt-3 leading-relaxed">
                      {review.body}
                    </p>
                  )}

                  {review.photos.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {review.photos.slice(0, 3).map((photo) => (
                        <div
                          key={photo}
                          className="bg-muted relative aspect-square overflow-hidden rounded-md"
                        >
                          <Image
                            src={photo}
                            alt={`Customer photo for ${productName}`}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 768px) 45vw, 180px"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {review.adminResponse && (
                    <div className="bg-muted/40 mt-5 rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <MessageSquareReply className="h-4 w-4" />
                        Rebirth response
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {review.adminResponse}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
