"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface UgcTestimonial {
  initials: string;
  initialsColor: string;
  name: string;
  detail: string;
  quote: string;
  hasMedia: boolean;
  mediaLabel?: string;
  mediaNote?: string;
}

const TESTIMONIALS: UgcTestimonial[] = [
  {
    initials: "JC",
    initialsColor: "bg-[var(--rebirth-teal)]",
    name: "Jake C.",
    detail: "Wedding Band · Hawaii",
    quote:
      "\u201CThe quality hit me the second I put it on. My wife cried. This ring tells our story better than I ever could.\u201D",
    hasMedia: true,
    mediaLabel: "Video",
    mediaNote:
      "Customer video testimonial — 30-60 sec, selfie style, showing their ring",
  },
  {
    initials: "MR",
    initialsColor: "bg-[var(--rebirth-amber)]",
    name: "Marco R.",
    detail: "Skate Ring · San Diego",
    quote:
      "\u201CI've been skating 15 years. Wearing this ring feels like my whole journey is on my hand. Nobody else has one like it.\u201D",
    hasMedia: true,
    mediaLabel: "Customer Photo",
    mediaNote:
      "Customer photo of their ring or apparel in the wild",
  },
  {
    initials: "SR",
    initialsColor: "bg-[#5a6b4a]",
    name: "Sofia R.",
    detail: "Flower Tee · Verified Buyer",
    quote:
      "\u201CI wore the crewneck through six countries in Latin America. Every time someone asked about it, I got to share something real.\u201D",
    hasMedia: false,
  },
  {
    initials: "TW",
    initialsColor: "bg-[#c49494]",
    name: "Tyler W.",
    detail: "Wedding Band · Portland",
    quote:
      "\u201CDaniel personally answered my DM about sizing. A real human behind a real brand. The ring arrived in 8 days, perfect.\u201D",
    hasMedia: true,
    mediaLabel: "Instagram",
    mediaNote:
      "Screenshot of real @rebirthrings tag or story",
  },
  {
    initials: "KN",
    initialsColor: "bg-[#8b6b4a]",
    name: "Kayla N.",
    detail: "Gift Purchase · Austin",
    quote:
      "\u201CI read the story behind these rings and immediately knew this was different. A skateboarder, a jeweler\u2019s son, Guatemala. It carries all of it.\u201D",
    hasMedia: false,
  },
];

export function UgcStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[var(--rebirth-warm-black)] py-12 md:py-16">
      {/* Header */}
      <div className="mb-9 px-6 text-center">
        <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-amber)]">
          Real Customers · Real Stories
        </span>
        <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px] text-[var(--rebirth-film-cream)]">
          WHAT PEOPLE
          <br />
          ARE SAYING
        </h2>
        <p className="mt-2 text-sm text-[#8a8578]">
          4.9 ★ average · 1,000+ happy customers worldwide
        </p>
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex gap-3.5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-thin"
        style={{ scrollbarColor: "var(--rebirth-teal) transparent" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex w-[290px] flex-none snap-start flex-col gap-3 border border-[#2e2e2e] bg-[#222] p-5"
          >
            {t.hasMedia && (
              <div className="flex aspect-[4/3] items-center justify-center bg-[#1a1a1a] text-center text-[11px] text-[#8a8578]">
                {t.mediaNote}
              </div>
            )}
            <div className="text-sm tracking-wider text-[var(--rebirth-amber)]">
              ★★★★★
            </div>
            <p className="flex-1 text-[13px] italic leading-relaxed text-[#bbb]">
              {t.quote}
            </p>
            <div className="mt-auto flex items-center gap-2.5">
              <div
                className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.initialsColor}`}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--rebirth-film-cream)]">
                  {t.name}
                </div>
                <div className="text-[10px] text-[#8a8578]">{t.detail}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-9 text-center">
        <Link
          href="/reviews"
          className="inline-flex items-center justify-center gap-2 border-2 border-white/40 bg-transparent px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/[0.08]"
        >
          SEE ALL REVIEWS
        </Link>
      </div>
    </section>
  );
}
