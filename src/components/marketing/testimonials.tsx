"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const testimonials = [
  {
    quote:
      "I told my wife the ring on my finger used to be a skateboard and she didn't believe me until she saw the layers. The colors in the wood are unreal.",
    name: "Marcus T.",
    detail: "Skateboard ring, size 10",
  },
  {
    quote:
      "Got this as a gift for my husband — he's skated for 20 years and teared up when he realized it was made from an actual deck. He hasn't taken it off.",
    name: "Sarah K.",
    detail: "Gift purchase",
  },
  {
    quote:
      "We wanted wedding bands that actually meant something. The bog oak and steel bands are stunning and people always ask about them. Worth every penny.",
    name: "Lena & James R.",
    detail: "Wedding band pair",
  },
  {
    quote:
      "The engraving was perfect and the ring fits like a glove. You can see the seven layers of maple — each one a different color. Truly one of a kind.",
    name: "Chris W.",
    detail: "Engraved skateboard ring",
  },
  {
    quote:
      "I've bought from a lot of 'sustainable' brands but Rebirth is the real deal. You can tell Daniel actually makes these by hand. The quality is next level.",
    name: "Priya S.",
    detail: "Repeat customer",
  },
  {
    quote:
      "Sized up like the guide suggested and it's perfect. The wood grain pattern is completely unique — no two are alike. Already planning my next order.",
    name: "Jake D.",
    detail: "Skateboard ring, size 12",
  },
];

const featured = testimonials[0];
const secondary = testimonials.slice(1);

function SecondaryCard({
  quote,
  name,
  detail,
}: (typeof testimonials)[0]) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
      <p className="text-base leading-relaxed md:text-lg">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-5">
        <p className="font-medium">{name}</p>
        <p className="mt-0.5 text-sm opacity-60 font-[family-name:var(--font-dm-mono)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

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
      className="section-ocean bg-grain py-24 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Featured editorial pull quote */}
        <div className="relative">
          {/* Decorative quotation mark */}
          <span
            className="pointer-events-none absolute -top-8 -left-2 select-none text-mega-lg opacity-[0.08] md:-top-12 md:-left-6"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote
            ref={quoteRef}
            className="relative text-mega-sm max-w-[22ch] md:max-w-[28ch]"
          >
            {featured.quote}
          </blockquote>

          <div className="mt-8">
            <p className="text-lg font-medium">{featured.name}</p>
            <p className="mt-1 text-sm text-section-muted font-[family-name:var(--font-dm-mono)]">
              {featured.detail}
            </p>
          </div>
        </div>

        {/* Secondary testimonials grid */}
        <ScrollReveal
          stagger={0.1}
          className="mt-20 grid grid-cols-1 gap-6 md:mt-28 md:grid-cols-2 lg:grid-cols-3"
        >
          {secondary.map((item) => (
            <SecondaryCard key={item.name} {...item} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
