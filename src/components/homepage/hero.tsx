"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  Hammer,
  PenLine,
  Recycle,
  RotateCcw,
  Shield,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";

const HERO_IMAGES = [
  "/images/hero/rebirth-1-3.webp",
  "/images/hero/img_0572.webp",
  "/images/hero/rebirth-1-1-2.webp",
  "/images/hero/rebirth-1-14.webp",
  "/images/hero/img_0681.webp",
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const PROOF_POINTS = [
  "4.9 average rating",
  "1,000+ rings crafted",
  "Handmade by Daniel",
];

const HERO_STATS = [
  {
    value: "1,000+",
    label: "rings and pieces shipped to customers worldwide",
  },
  {
    value: "10",
    label: "years of craft, started at age 14",
  },
  {
    value: "100%",
    label: "handmade by Daniel, no factory shortcuts",
  },
];

const TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Truck, text: "Free US shipping $75+" },
  { icon: RotateCcw, text: "30-day returns" },
  { icon: Shield, text: "1-year warranty" },
  { icon: PenLine, text: "Free engraving" },
];

const CRAFT_POINTS: { icon: LucideIcon; label: string; text: string }[] = [
  {
    icon: Recycle,
    label: "Material",
    text: "Broken boards become layered maple color.",
  },
  {
    icon: Hammer,
    label: "Craft",
    text: "Cut, shaped, lined, and finished by hand.",
  },
  {
    icon: Star,
    label: "Proof",
    text: "Worn by customers around the world.",
  },
];

export function Hero() {
  return (
    <section className="relative grid min-h-[100svh] grid-cols-1 overflow-hidden bg-[var(--rebirth-warm-black)] md:min-h-[92vh] md:grid-cols-2">
      {/* Radial gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(42,157,143,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 90% 20%, rgba(224,122,58,0.09) 0%, transparent 55%)",
        }}
      />
      <HeroSlideshow variant="background" />

      {/* Left: Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-5 pb-24 pt-20 md:ml-auto md:min-h-0 md:max-w-[640px] md:py-20 md:pl-6 md:pr-14">
        {/* Social Proof #1 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 flex max-w-[520px] flex-wrap items-center gap-x-3 gap-y-2"
        >
          <span className="flex items-center gap-0.5 text-[var(--rebirth-amber)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-3.5 w-3.5 fill-current"
                aria-hidden="true"
              />
            ))}
          </span>
          {PROOF_POINTS.map((point, index) => (
            <span
              key={point}
              className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[1.8px] text-white/60"
            >
              {index > 0 ? (
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
              ) : null}
              {point}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-5 max-w-[560px] font-[family-name:var(--font-serif)] text-[clamp(42px,6vw,78px)] font-bold italic leading-[1.02] text-[var(--rebirth-film-cream)]"
        >
          Handcrafted Rings
          <br />
          <em className="not-italic text-[var(--rebirth-teal)]">
            From Broken
          </em>
          <br />
          Skateboards.
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-7 max-w-[520px] text-base leading-[1.7] text-white/70 md:text-lg"
        >
          One-of-a-kind recycled skateboard rings, wood-lined wedding bands,
          and small-batch apparel made by Daniel from materials that already
          lived a story. Built to remind you to{" "}
          <strong className="text-white/90">embrace change.</strong>
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mb-7 flex flex-wrap gap-3"
        >
          <Link
            href="/shop?collection=wedding-bands"
            className="inline-flex min-h-14 items-center justify-center gap-2 bg-[var(--rebirth-teal)] px-8 py-4 font-[family-name:var(--font-caps)] text-lg tracking-[2px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e] md:px-10 md:text-xl"
          >
            SHOP RINGS
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/our-story"
            className="inline-flex min-h-14 items-center justify-center gap-2 border-2 border-white/40 bg-black/10 px-7 py-4 font-[family-name:var(--font-caps)] text-base tracking-[2px] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/[0.08] md:px-9 md:text-[17px]"
          >
            OUR STORY
          </Link>
        </motion.div>

        {/* Social Proof #2 - Stat bar */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="hidden max-w-[560px] grid-cols-3 border-y border-white/[0.1] bg-white/[0.04] py-4 backdrop-blur-sm md:grid md:px-5"
        >
          {HERO_STATS.map((stat) => (
            <div
              key={stat.value}
              className="border-r border-white/10 px-3 last:border-r-0 first:pl-0 last:pr-0 md:px-5"
            >
              <div className="font-[family-name:var(--font-caps)] text-[clamp(26px,7vw,40px)] leading-none tracking-wider text-[var(--rebirth-teal)]">
                {stat.value}
              </div>
              <div className="mt-1 max-w-[160px] text-[11px] leading-snug text-white/55 md:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* FUD reducers */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-5 hidden flex-wrap gap-x-4 gap-y-2 md:flex md:gap-x-5"
        >
          {TRUST_SIGNALS.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5 text-xs font-medium text-white/55"
            >
              <Icon className="h-3.5 w-3.5 text-[var(--rebirth-amber)]" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Right: Hero Media - Cinematic Slideshow */}
      <HeroSlideshow />
    </section>
  );
}

/* Cinematic Hero Slideshow */
function HeroSlideshow({
  variant = "panel",
}: {
  variant?: "panel" | "background";
}) {
  const [current, setCurrent] = useState(0);
  const isBackground = variant === "background";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={
        isBackground
          ? "absolute inset-0 z-0 min-h-full overflow-hidden md:hidden"
          : "relative z-10 hidden min-h-[500px] items-stretch overflow-hidden md:flex"
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 6, ease: "easeOut" },
          }}
        >
          <Image
            src={HERO_IMAGES[current]}
            alt="Rebirth World handcrafted ring"
            fill
            className="object-cover"
            sizes={isBackground ? "100vw" : "50vw"}
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle overlay gradient */}
      <div
        className={
          isBackground
            ? "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--rebirth-warm-black)] via-[var(--rebirth-warm-black)]/70 to-[var(--rebirth-warm-black)]/25"
            : "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[var(--rebirth-warm-black)]/30 to-transparent"
        }
      />

      {/* Buying dimensions overlay */}
      <div className="absolute bottom-8 left-5 right-5 z-[3] hidden border border-white/[0.08] bg-[rgba(26,26,26,0.88)] p-4 backdrop-blur-sm md:block">
        <div className="mb-2.5 text-[9px] font-bold uppercase tracking-[2.5px] text-[var(--rebirth-teal)]">
          Real material. Real maker.
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CRAFT_POINTS.map(({ icon: Icon, label, text }) => (
            <div key={label}>
              <Icon className="mb-2 h-4 w-4 text-[var(--rebirth-amber)]" />
              <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/55">
                {label}
              </div>
              <div className="text-[11px] leading-snug text-white/75">
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 z-[3] flex -translate-x-1/2 gap-1.5 md:hidden">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Show Rebirth hero image ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
