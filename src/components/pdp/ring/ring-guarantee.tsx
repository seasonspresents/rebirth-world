"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface RingGuaranteeProps {
  ctaHref?: string;
}

export function RingGuarantee({ ctaHref = "/shop" }: RingGuaranteeProps) {
  return (
    <section className="bg-[var(--teal)] px-6 py-20 md:py-24 text-center">
      <motion.div
        className="mx-auto max-w-[680px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-5 text-[72px] max-md:text-[56px]">{"\u{1F6E1}\uFE0F"}</div>
        <h2 className="mb-[18px] font-[family-name:var(--font-caps)] text-[clamp(40px,7vw,72px)] leading-none tracking-[3px] text-white">
          30-DAY SATISFACTION<br />GUARANTEE
        </h2>
        <p className="mb-8 text-base leading-[1.8] text-white/80">
          We make every ring by hand with everything we&apos;ve got. If you&apos;re not completely satisfied — for any reason — send it back within 30 days for a full refund or exchange. No paperwork. No questions. No friction. That&apos;s our word.
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2.5 bg-[var(--black)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:bg-[#111] hover:-translate-y-px"
        >
          SHOP RISK-FREE
        </Link>
      </motion.div>
    </section>
  );
}
