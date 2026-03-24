"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const testimonials = [
  {
    quote:
      "I told my wife the ring on my finger used to be a skateboard and she didn't believe me until she saw the layers. The colors in the wood are unreal.",
    name: "Marcus T.",
    title: "Skateboard ring, size 10",
  },
  {
    quote:
      "Got this as a gift for my husband — he's skated for 20 years and teared up when he realized it was made from an actual deck. He hasn't taken it off.",
    name: "Sarah K.",
    title: "Gift purchase",
  },
  {
    quote:
      "We wanted wedding bands that actually meant something. The bog oak and steel bands are stunning and people always ask about them. Worth every penny.",
    name: "Lena & James R.",
    title: "Wedding band pair",
  },
  {
    quote:
      "The engraving was perfect and the ring fits like a glove. You can see the seven layers of maple — each one a different color. Truly one of a kind.",
    name: "Chris W.",
    title: "Engraved skateboard ring",
  },
  {
    quote:
      "I've bought from a lot of 'sustainable' brands but Rebirth is the real deal. You can tell Daniel actually makes these by hand. The quality is next level.",
    name: "Priya S.",
    title: "Repeat customer",
  },
  {
    quote:
      "Sized up like the guide suggested and it's perfect. The wood grain pattern is completely unique — no two are alike. Already planning my next order.",
    name: "Jake D.",
    title: "Skateboard ring, size 12",
  },
];

const featured = testimonials[0];

export function Testimonials() {
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useGSAP(
    () => {
      const el = quoteRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const split = SplitText.create(el, { type: "chars" });

      gsap.from(split.chars, {
        opacity: 0,
        y: 12,
        rotateX: -20,
        duration: 0.6,
        stagger: 0.01,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: quoteRef, dependencies: [] }
  );

  return (
    <section
      data-section-theme="ocean"
      className="section-ocean bg-grain py-24 md:py-32 lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Featured editorial pull quote */}
        <div className="relative">
          <span
            className="pointer-events-none absolute -top-8 -left-2 select-none text-mega-lg opacity-[0.08] md:-top-12 md:-left-6"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote
            ref={quoteRef}
            className="relative text-mega-sm max-w-[22ch] md:max-w-[28ch]"
            style={{ perspective: "600px" }}
          >
            {featured.quote}
          </blockquote>

          <div className="mt-8">
            <p className="text-lg font-medium">{featured.name}</p>
            <p className="mt-1 text-sm text-section-muted font-[family-name:var(--font-dm-mono)]">
              {featured.title}
            </p>
          </div>
        </div>

        {/* Aceternity InfiniteMovingCards — auto-scrolling testimonial strip */}
        <div className="mt-20 md:mt-28">
          <InfiniteMovingCards
            items={testimonials.slice(1)}
            direction="left"
            speed="slow"
            pauseOnHover
          />
        </div>
      </div>
    </section>
  );
}
