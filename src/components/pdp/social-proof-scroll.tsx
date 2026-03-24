"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const DEFAULT_TESTIMONIALS = [
  {
    quote: "The colors in the wood are unreal. I told my wife it used to be a skateboard and she didn't believe me until she saw the layers.",
    name: "Marcus T.",
    title: "Skateboard ring, size 10",
  },
  {
    quote: "Got this as a gift for my husband — he's skated for 20 years and teared up when he realized it was made from an actual deck.",
    name: "Sarah K.",
    title: "Gift purchase",
  },
  {
    quote: "The engraving was perfect and the ring fits like a glove. You can see the seven layers of maple — each one a different color.",
    name: "Chris W.",
    title: "Engraved skateboard ring",
  },
  {
    quote: "We wanted wedding bands that actually meant something. The bog oak and steel bands are stunning.",
    name: "Lena & James R.",
    title: "Wedding band pair",
  },
  {
    quote: "You can tell Daniel actually makes these by hand. The quality is next level.",
    name: "Priya S.",
    title: "Repeat customer",
  },
];

interface PDPSocialProofScrollProps {
  testimonials?: { quote: string; name: string; title: string }[];
  heading?: string;
}

export function PDPSocialProofScroll({
  testimonials = DEFAULT_TESTIMONIALS,
  heading = "What Our Customers Say",
}: PDPSocialProofScrollProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-8 text-center text-fluid-heading font-[family-name:var(--font-display)]">
          {heading}
        </h2>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
        pauseOnHover
      />
    </section>
  );
}

interface PDPSocialProofBannerProps {
  heading?: string;
}

export function PDPSocialProofBanner({
  heading = "Loved by 1,000+ customers worldwide",
}: PDPSocialProofBannerProps) {
  return (
    <section className="border-y border-border/50 bg-muted/30 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-5 fill-[var(--rebirth-amber)] text-[var(--rebirth-amber)]" />
          ))}
        </div>
        <p className="text-lg font-medium font-[family-name:var(--font-display)]">
          {heading}
        </p>
      </div>
    </section>
  );
}
