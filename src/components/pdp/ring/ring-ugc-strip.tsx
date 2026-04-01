"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const UGC_CARDS = [
  {
    stars: 5,
    quote: "The quality blew me away. My wife cried when she saw it. Nothing generic about it — it's real craft.",
    initials: "JC",
    name: "Jake C.",
    detail: "Married 2025 \u00B7 Laie, HI",
    color: "var(--teal)",
    image: "/images/people/men-wedding-ring.webp",
  },
  {
    stars: 5,
    quote: "This ring is *me*. I've been skating 15 years and wearing this feels like that story is on my hand. Koa wood option is stunning.",
    initials: "MR",
    name: "Marco R.",
    detail: "Wedding Band \u00B7 San Diego, CA",
    color: "var(--amber)",
    image: "/images/people/000009.webp",
  },
  {
    stars: 5,
    quote: "Daniel answered my DM personally to help me with sizing. A real person who cares. Arrived in 8 days. Could not have asked for more.",
    initials: "TW",
    name: "Tyler W.",
    detail: "Verified Buyer \u00B7 Portland, OR",
    color: "var(--lotus,#c49494)",
    image: "/images/people/img_0681.webp",
  },
  {
    stars: 5,
    quote: "My husband didn't want a generic band. Found Rebirth World — he wore it out of the box before we left the house.",
    initials: "AS",
    name: "Amanda S.",
    detail: "Gift Purchase \u00B7 Austin, TX",
    color: "var(--moss,#5a6b4a)",
    image: "/images/people/000018.webp",
  },
  {
    stars: 5,
    quote: "Wore it on our wedding day in Guatemala. Had no idea Daniel had a connection there too until I read his story — felt like fate.",
    initials: "EG",
    name: "Elena G.",
    detail: "Matching Set \u00B7 Provo, UT",
    color: "#6b5b42",
    image: "/images/people/000013-copy.webp",
  },
];

interface RingUgcStripProps {
  ctaHref?: string;
}

export function RingUgcStrip({ ctaHref = "/shop" }: RingUgcStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[var(--black)] py-16 md:py-20">
      {/* Header */}
      <div className="mb-9 px-6 text-center">
        <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--amber)]">
          Real Customers &middot; Real Rings
        </span>
        <h2 className="font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] text-[var(--warm-white)]">
          WHAT PEOPLE<br />ARE SAYING
        </h2>
        <p className="mt-2 text-sm text-[var(--gray)]">
          4.9 {"\u2605"} average &middot; 200+ rings shipped worldwide
        </p>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-3.5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-thin"
        style={{
          scrollbarColor: "var(--teal) rgba(255,255,255,0.05)",
        }}
      >
        {UGC_CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="flex w-[290px] flex-none snap-start flex-col gap-3 border border-[#2e2e2e] bg-[#222] p-5"
          >
            {card.image && (
              <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                <Image src={card.image} alt={`${card.name} wearing Rebirth ring`} fill className="object-cover" sizes="290px" />
              </div>
            )}
            <div className="text-[13px] tracking-wide text-[var(--amber)]">
              {"\u2605\u2605\u2605\u2605\u2605"}
            </div>
            <p className="flex-1 text-[13px] italic leading-[1.65] text-[#bbb]">
              &ldquo;{card.quote}&rdquo;
            </p>
            <div className="mt-auto flex items-center gap-2.5">
              <div
                className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: card.color }}
              >
                {card.initials}
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--warm-white)]">
                  {card.name}
                </div>
                <div className="text-[10px] text-[var(--gray)]">
                  {card.detail}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-9 px-6 text-center">
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2.5 border-2 border-white/40 px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:border-white hover:bg-white/[0.08]"
        >
          SHOP THE COLLECTION
        </Link>
      </div>
    </section>
  );
}
