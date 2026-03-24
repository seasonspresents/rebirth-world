"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";
import { motion } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight";
import { SparklesText } from "@/components/ui/sparkles-text";
import { ButtonMovingBorder } from "@/components/ui/moving-border";
import { Magnetic } from "@/components/ui/magnetic";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { Button } from "@/components/ui/button";

interface BrandHeroProps {
  heroImage?: string;
}

export function BrandHero({ heroImage }: BrandHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const headline = headlineRef.current;
      if (!section || !headline) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            headline,
            subtextRef.current,
            ctaRef.current,
            scrollIndicatorRef.current,
            imageRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({ delay: 0.2 });

      // Hero image — cinematic scale-in
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );

      // Eyebrow — slides in with blur
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, x: -40, filter: "blur(8px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      // SplitText headline — char-by-char with 3D rotation + scale
      const split = SplitText.create(headline, { type: "chars,words" });
      tl.fromTo(
        split.chars,
        { opacity: 0, y: 50, rotateX: -60, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.025,
          ease: "power4.out",
        },
        "-=0.5"
      );

      // Subtitle
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      // CTA — scale spring
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.4)" },
        "-=0.4"
      );

      // Scroll indicator
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2"
      );

      // Pin hero
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

      // Watermark parallax
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          y: -120,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=50%",
            scrub: 0.5,
          },
        });
      }

      // Scroll indicator fades
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
      className="section-warm bg-grain relative flex min-h-screen items-end overflow-hidden md:items-center"
    >
      {/* Aceternity Spotlight */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--rebirth-teal)"
      />

      {/* Watermark */}
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span className="text-mega-lg whitespace-nowrap opacity-[0.03]">
          REBIRTH
        </span>
      </div>

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--rebirth-teal)] opacity-[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-[var(--rebirth-amber)] opacity-[0.05] blur-[100px]" />

      {/* Split hero layout: text + image */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-2 md:gap-12 md:px-6 lg:gap-16">
        {/* Left — Copy */}
        <div className="order-2 flex flex-col justify-center px-6 pb-12 md:order-1 md:px-0 md:py-12">
          <motion.p
            ref={eyebrowRef}
            className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary opacity-0 font-[family-name:var(--font-dm-mono)]"
          >
            Handcrafted from recycled skateboards
          </motion.p>

          <h1
            ref={headlineRef}
            className="text-mega max-w-[14ch] opacity-0"
            style={{ perspective: "800px" }}
          >
            Broken boards,{" "}
            <SparklesText
              text="reborn"
              className="not-italic text-primary"
              sparklesCount={8}
              colors={{ first: "#2d8a7e", second: "#cc7e3a" }}
            />
          </h1>

          <p
            ref={subtextRef}
            className="mt-8 max-w-[48ch] text-lg leading-relaxed text-muted-foreground opacity-0 md:text-xl"
          >
            Local skaters donate their broken decks. Daniel shapes them by hand
            in his North Shore workshop — seven layers of maple, sanded, sealed,
            and turned into rings you&apos;ll never want to take off.
          </p>

          <div ref={ctaRef} className="mt-12 flex items-center gap-4 opacity-0">
            <Magnetic strength={0.25}>
              <Link href="/shop">
                <ButtonMovingBorder
                  borderRadius="1.75rem"
                  className="bg-background px-8 py-3 text-base font-medium text-foreground"
                  containerClassName="h-auto"
                  duration={3000}
                >
                  Shop Rings <span className="ml-2">&rarr;</span>
                </ButtonMovingBorder>
              </Link>
            </Magnetic>
            <Magnetic strength={0.15}>
              <Button asChild variant="ghost" className="px-6 py-4 text-base">
                <Link href="/our-story">
                  Our Story <span className="ml-1">&rarr;</span>
                </Link>
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* Right — Hero Image */}
        <div className="order-1 md:order-2">
          <ParallaxLayer speed={-0.1} className="h-full">
            <div
              ref={imageRef}
              className="relative h-[60vh] w-full opacity-0 md:h-full md:min-h-[600px]"
            >
              <Image
                src={heroImage || "/images/hero-ring.jpg"}
                alt="Handcrafted recycled skateboard ring"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover md:rounded-2xl"
              />
              <div className="pointer-events-none absolute inset-0 bg-grain opacity-30 md:rounded-2xl" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--section-bg)] to-transparent md:hidden" />
            </div>
          </ParallaxLayer>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground font-[family-name:var(--font-dm-mono)]">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
