"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";
import { motion } from "motion/react";
import { ScrollImage } from "@/components/ui/scroll-image";

const STORY_BLOCKS = [
  {
    eyebrow: "The Beginning",
    heading: "I was fourteen, surrounded by broken boards.",
    body: "My name is Daniel Malzl. I started making rings in my father's workshop in Austria — he trained for six years at Koppenwallner's in Salzburg, court jeweler for Austrian emperors. I didn't know it then, but those broken skateboards would become my life's work.",
    imageAlt: "Daniel's hands working in the workshop, close-up of ring crafting on lathe with sawdust and warm overhead lighting",
  },
  {
    eyebrow: "The Community",
    heading: "Local riders started dropping off their snapped decks.",
    body: "Word got around. Skaters in the neighborhood would leave their broken boards at my door instead of tossing them. Seven layers of Canadian maple — each one a different color. I started seeing the rings inside the wood before I even turned the lathe on.",
    imageAlt: "Pile of colorful broken skateboard decks showing exposed maple layers, natural light, workshop setting",
  },
  {
    eyebrow: "The Chapters",
    heading: "Hawaii, Guatemala, solo travels through Latin America.",
    body: "I lived on the North Shore, where skating and surfing shaped my aesthetic. In Guatemala, I worked with the Mayan women of Lake Atitlán, San Lucas Tolimán — a non-profit textile collaboration called Tejidos de Santiagitos. Service at the core. Every chapter added a layer to the work.",
    imageAlt: "Guatemala landscape with Lake Atitlán in background, or close-up of traditional Mayan textile weaving patterns",
  },
  {
    eyebrow: "Today",
    heading: "Made in Mapleton, Utah. Inspired by everywhere I've been.",
    body: "Today I craft every ring and wedding band by hand in my Mapleton workshop. Each piece carries something from every chapter — Austrian precision, North Shore soul, Guatemalan heart. Broken boards, reborn.",
    imageAlt: "Finished wedding band on natural wood surface, Mapleton Utah mountain landscape visible through workshop window",
  },
];

export function BrandStory() {
  const quoteRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = quoteRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const split = SplitText.create(el, { type: "words" });

      gsap.from(split.words, {
        opacity: 0.15,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      return () => split.revert();
    },
    { scope: quoteRef, dependencies: [] }
  );

  return (
    <section
      data-section-theme="warm"
      className="section-warm bg-grain py-24 md:py-32 lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <p className="mb-8 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-primary font-[family-name:var(--font-dm-mono)]">
          Our Story
        </p>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-[2fr_3fr] md:gap-20">
          {/* Left — Sticky pull quote */}
          <div className="md:sticky md:top-28 md:self-start">
            <h2
              ref={quoteRef}
              className="text-fluid-display leading-[1.1] font-[family-name:var(--font-display)]"
            >
              I started making rings from broken skateboards when I was fourteen.
            </h2>
          </div>

          {/* Right — Scrolling story blocks */}
          <div className="space-y-16 md:space-y-24">
            {STORY_BLOCKS.map((block, i) => (
              <motion.div
                key={block.eyebrow}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Photography placeholder */}
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-xl bg-muted/30">
                  <div className="flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
                    {block.imageAlt}
                  </div>
                </div>

                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-primary font-[family-name:var(--font-dm-mono)]">
                  {block.eyebrow}
                </p>
                <h3 className="text-xl font-semibold leading-tight md:text-2xl font-[family-name:var(--font-display)]">
                  {block.heading}
                </h3>
                <p className="mt-3 max-w-[52ch] leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
