"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const FEATURES = [
  { icon: "\u{1F4A7}", title: "Water-Resistant Finish", desc: "CA glue interior seals the wood against daily water exposure. Built for real life — not a display case." },
  { icon: "\u{1F529}", title: "Stainless Steel Shell", desc: "Gold-plated, black, or brushed steel — won't tarnish or corrode. Looks as good in 10 years as it does today." },
  { icon: "\u{1F4D0}", title: "Precision 0.8mm Wood Liner", desc: "Slim enough to sit comfortably, thick enough to show the grain. Hand-fitted to fractions of a millimeter." },
  { icon: "\u{1F6E1}\uFE0F", title: "1-Year Craftsmanship Warranty", desc: "If anything goes wrong with the work, we make it right. That's the Rebirth promise." },
];

interface RingFeaturesProps {
  image?: string;
  ctaHref?: string;
}

export function RingFeatures({ image, ctaHref = "/shop" }: RingFeaturesProps) {
  return (
    <section className="bg-[var(--black)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-[72px]">
          {/* Left: Copy */}
          <div>
            <div className="mb-9">
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--teal)]">
                Built to Last
              </span>
              <h2 className="mb-2 font-[family-name:var(--font-caps)] text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[1.5px] text-[var(--warm-white)]">
                A Ring as Durable<br />as Your Commitment
              </h2>
              <p className="text-sm text-[#666]">
                Made to be worn every day — surfing, skating, working, living.
              </p>
            </div>

            <ul className="mb-3 list-none">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex gap-4 border-b border-[#252525] py-5 last:border-b-0"
                >
                  <span className="mt-0.5 shrink-0 text-[26px]">{f.icon}</span>
                  <div>
                    <div className="mb-1.5 text-[15px] font-semibold text-[var(--warm-white)]">
                      {f.title}
                    </div>
                    <div className="text-[13px] leading-[1.65] text-[#777]">
                      {f.desc}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Link
              href={ctaHref}
              className="mt-3 inline-flex items-center justify-center gap-2.5 bg-[var(--teal)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-white transition-all hover:bg-[var(--teal-dark,#1e7a6e)] hover:-translate-y-px"
            >
              SHOP NOW
            </Link>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
          >
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={image} alt="Ring close-up showing material quality" fill className="object-cover" sizes="50vw" />
              </div>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/wedding-bands/spalted-maple-burl/design-4-detail.webp" alt="Ring close-up showing material quality and wood grain detail" fill className="object-cover" sizes="50vw" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
