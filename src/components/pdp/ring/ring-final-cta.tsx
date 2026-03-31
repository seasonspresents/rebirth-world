"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatPrice } from "@/lib/payments/constants";

interface RingFinalCTAProps {
  productName: string;
  price?: number;
  currency?: string;
  ctaHref?: string;
}

export function RingFinalCTA({
  productName,
  price,
  currency = "usd",
  ctaHref = "/shop",
}: RingFinalCTAProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--black)] px-6 py-28 text-center md:py-32">
      {/* Ambient gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 20% 50%, rgba(42,157,143,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 85% 20%, rgba(224,122,58,0.08) 0%, transparent 65%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-[660px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--amber)]">
          Your Next Chapter
        </span>
        <h2 className="mb-4 font-[family-name:var(--font-serif)] text-[clamp(34px,6vw,62px)] italic leading-[1.15] text-[var(--warm-white)]">
          Your Ring Should<br /><em className="not-italic text-[var(--teal)]">Mean Something.</em>
        </h2>
        <p className="mx-auto mb-10 max-w-[520px] text-[15px] leading-[1.8] text-[#888]">
          I make these by hand in Mapleton, Utah — shaped by everything I&apos;ve lived through. Hawaii. Guatemala. The Mayan women by Lake Atitlan. A father who learned his craft from the emperor&apos;s jeweler. It&apos;s all in here. Wear it as a reminder: you are always in the middle of a rebirth. Embrace it.
        </p>
        <Link
          href={ctaHref}
          className="mx-auto mb-3.5 block max-w-[380px] bg-[var(--teal)] px-10 py-5 font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] text-white transition-all hover:bg-[var(--teal-dark,#1e7a6e)] hover:-translate-y-px max-md:max-w-full"
        >
          SHOP NOW {price ? `\u2014 FROM ${formatPrice(price, currency)}` : ""}
        </Link>
        <p className="text-[11px] tracking-wide text-[#444]">
          Free US Shipping &middot; 30-Day Returns &middot; 1-Year Warranty &middot; Handmade in Utah
        </p>
      </motion.div>
    </section>
  );
}
