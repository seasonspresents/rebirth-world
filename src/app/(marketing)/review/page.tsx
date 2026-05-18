import { Suspense } from "react";
import { Metadata } from "next";
import { ReviewSubmissionForm } from "@/components/reviews/review-submission-form";

export const metadata: Metadata = {
  title: "Review Your Piece",
  description:
    "Submit a verified purchase review for your Rebirth World order item.",
  openGraph: {
    title: "Review Your Piece | Rebirth World",
    description:
      "Submit a verified purchase review for your Rebirth World order item.",
    url: "https://rebirth.world/review",
    siteName: "Rebirth World",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Review Your Piece | Rebirth World",
    description:
      "Submit a verified purchase review for your Rebirth World order item.",
  },
};

function ReviewFallback() {
  return (
    <section className="border-b px-6 pt-24 pb-14 md:pt-28">
      <div className="mx-auto max-w-6xl border-x px-6 py-10 md:py-14">
        <div className="bg-muted h-[420px] animate-pulse rounded-lg" />
      </div>
    </section>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewFallback />}>
      <ReviewSubmissionForm />
    </Suspense>
  );
}
