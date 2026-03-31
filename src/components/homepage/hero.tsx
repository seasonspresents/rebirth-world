"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

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

export function Hero() {
  return (
    <section className="relative min-h-[92vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[var(--rebirth-warm-black)]">
      {/* Radial gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(42,157,143,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 90% 20%, rgba(224,122,58,0.09) 0%, transparent 55%)",
        }}
      />

      {/* Left: Content */}
      <div className="relative z-10 flex flex-col justify-center px-5 py-12 md:py-20 md:pl-6 md:pr-14 md:ml-auto md:max-w-[640px]">
        {/* Social Proof #1 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-7 flex flex-wrap items-center gap-2.5"
        >
          <span className="text-[var(--rebirth-amber)] text-sm tracking-wider">
            ★★★★★
          </span>
          <span className="text-xs text-white/50">
            4.9/5 · 1,000+ customers worldwide
          </span>
          <span className="h-3.5 w-px bg-white/15" />
          <span className="rounded-none border border-[rgba(42,157,143,0.3)] bg-[rgba(42,157,143,0.15)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--rebirth-teal)]">
            Eco-Conscious
          </span>
          <span className="rounded-none border border-[rgba(42,157,143,0.3)] bg-[rgba(42,157,143,0.15)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--rebirth-teal)]">
            Handmade in Utah
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-4 font-[family-name:var(--font-serif)] text-[clamp(40px,6vw,80px)] font-bold italic leading-[1.05] text-[var(--rebirth-film-cream)]"
        >
          Stop Wearing
          <br />
          <em className="not-italic text-[var(--rebirth-teal)]">
            Someone Else&apos;s
          </em>
          <br />
          Story.
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-7 max-w-[480px] text-base leading-[1.75] text-white/65"
        >
          I make handmade rings crafted from broken skateboards donated by the local skate community and other recycled materials — alongside limited apparel drops that carry the deeper message of Rebirth. Every piece is one of a kind, made with intention, purpose, and a story worth wearing.{" "}
          <strong className="text-white/85">Embrace change.</strong>
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <Link
            href="/shop?collection=wedding-bands"
            className="inline-flex items-center justify-center gap-2 bg-[var(--rebirth-teal)] px-12 py-5 font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e]"
          >
            SHOP RINGS
          </Link>
          <Link
            href="/shop?collection=apparel"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 bg-transparent px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/[0.08]"
          >
            SHOP APPAREL
          </Link>
        </motion.div>

        {/* FUD reducers */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-6 md:gap-5"
        >
          {[
            { icon: "🚚", text: "Free US Shipping $75+" },
            { icon: "🔁", text: "30-Day Returns" },
            { icon: "🛡️", text: "1-Year Warranty" },
            { icon: "✍️", text: "Free Engraving" },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 text-xs text-white/40"
            >
              <span className="text-sm">{item.icon}</span> {item.text}
            </span>
          ))}
        </motion.div>

        {/* Social Proof #2 — Stat bar */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-7 flex flex-wrap items-center gap-4 border border-white/[0.08] bg-white/[0.04] p-4 md:px-5"
        >
          <div>
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-wider text-[var(--rebirth-teal)]">
              1,000+
            </div>
            <div className="max-w-[180px] text-xs leading-snug text-white/45">
              rings &amp; pieces shipped to customers worldwide
            </div>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div>
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-wider text-[var(--rebirth-teal)]">
              10
            </div>
            <div className="max-w-[180px] text-xs leading-snug text-white/45">
              years of craft — started making rings at age 14
            </div>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div>
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-wider text-[var(--rebirth-teal)]">
              100%
            </div>
            <div className="max-w-[180px] text-xs leading-snug text-white/45">
              handmade — no factories, no shortcuts
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Hero Media — Cinematic Slideshow */}
      <HeroSlideshow />
    </section>
  );
}

/* ── Cinematic Hero Slideshow ── */
function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 flex items-stretch min-h-[300px] md:min-h-[500px] overflow-hidden">
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
            sizes="50vw"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle overlay gradient */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[var(--rebirth-warm-black)]/30 to-transparent" />

      {/* Buying dimensions overlay */}
      <div className="absolute bottom-8 left-5 right-5 z-[3] hidden border border-white/[0.08] bg-[rgba(26,26,26,0.88)] p-4 backdrop-blur-sm md:block">
        <div className="mb-2.5 text-[9px] font-bold uppercase tracking-[2.5px] text-[var(--rebirth-teal)]">
          Why people buy Rebirth
        </div>
        <div className="flex gap-4">
          {[
            {
              label: "Functional",
              text: "Lightweight, comfortable, and made to stand out — crafted from reclaimed materials.",
            },
            {
              label: "Emotional",
              text: "A reminder that transformation begins the moment we embrace change.",
            },
            {
              label: "Social",
              text: "A conversation starter that reflects your values, story, and culture.",
            },
          ].map((dim) => (
            <div key={dim.label} className="flex-1">
              <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                {dim.label}
              </div>
              <div className="text-[11px] leading-snug text-white/75">
                {dim.text}
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
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
