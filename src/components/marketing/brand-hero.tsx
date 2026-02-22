"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { Magnetic } from "@/components/ui/magnetic";
import { ParallaxLayer } from "@/components/ui/parallax-layer";

export function BrandHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const headline = headlineRef.current;
      if (!section || !headline) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Show everything immediately
        gsap.set(
          [
            eyebrowRef.current,
            headline,
            subtextRef.current,
            ctaRef.current,
            scrollIndicatorRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline();

      // Eyebrow fade in
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // SplitText headline — char-by-char with rotation
      const split = SplitText.create(headline, { type: "chars" });
      tl.fromTo(
        split.chars,
        { opacity: 0, y: 30, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Subtitle
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );

      // CTA button
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );

      // Scroll indicator fade in
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.2"
      );

      // Pin the hero for 0.5x viewport scroll distance
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=50%",
          pin: true,
          pinSpacing: true,
          scrub: false,
        },
      });

      // Watermark drifts up during the pin
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=50%",
            scrub: 0.5,
          },
        });
      }

      // Scroll indicator fades out on scroll
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100",
            scrub: true,
          },
        });
      }

      return () => {
        split.revert();
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      data-section-theme="warm"
      className="section-warm bg-grain relative flex min-h-screen items-center overflow-hidden px-6"
    >
      {/* Watermark */}
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span className="text-mega-lg whitespace-nowrap opacity-[0.04]">
          REBIRTH
        </span>
      </div>

      {/* Teal particles */}
      <ParallaxLayer speed={-0.3} className="absolute inset-0">
        <Particles
          className="pointer-events-none absolute inset-0"
          quantity={20}
          color="#2a9d8f"
          size={0.6}
          staticity={60}
          ease={50}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={-0.1} className="relative z-10 mx-auto max-w-[1200px]">
        <p
          ref={eyebrowRef}
          className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary opacity-0 font-[family-name:var(--font-dm-mono)]"
        >
          Handcrafted from recycled skateboards
        </p>

        <h1
          ref={headlineRef}
          className="text-mega max-w-[14ch] opacity-0"
          style={{ perspective: "600px" }}
        >
          Broken boards,{" "}
          <em className="not-italic text-primary">reborn</em>
        </h1>

        <p
          ref={subtextRef}
          className="mt-8 max-w-[48ch] text-lg leading-relaxed text-muted-foreground opacity-0 md:text-xl"
        >
          Local skaters donate their broken decks. Daniel shapes them by hand in
          his North Shore workshop — seven layers of maple, sanded, sealed, and
          turned into rings you&apos;ll never want to take off.
        </p>

        <div ref={ctaRef} className="mt-12 opacity-0">
          <Magnetic strength={0.25}>
            <Button asChild className="px-8 py-4 text-base">
              <Link href="/shop">
                Browse the collection <span className="ml-1">&rarr;</span>
              </Link>
            </Button>
          </Magnetic>
        </div>
      </ParallaxLayer>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground font-[family-name:var(--font-dm-mono)]">
            Scroll
          </span>
          <div className="h-8 w-px bg-muted-foreground/40" />
        </div>
      </div>
    </section>
  );
}
