"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface TestimonialCard {
  quote: string;
  name: string;
  meta: string;
}

/* ── Light testimonials (after philosophy section) ── */
const LIGHT_CARDS: TestimonialCard[] = [
  { quote: "We ordered matching sets and both felt the weight of them — the real, handmade weight. Not the usual factory ring. Something else entirely.", name: "Sarah & Luis M.", meta: "Matching Set \u00B7 June 2025" },
  { quote: "Wearing this every day — surfing, working, living. It holds up and it means something. That combination is rare.", name: "Brendan T.", meta: "Irish Bog Oak \u00B7 Verified Buyer" },
  { quote: "I read Daniel's story and immediately knew this was different. A skateboarder, a jeweler's son, two years in Guatemala. The ring carries all of it.", name: "Kayla N.", meta: "Gift Purchase \u00B7 Holiday 2025" },
];

/* ── Dark testimonials (after guarantee) ── */
const DARK_CARDS: TestimonialCard[] = [
  { quote: "Worn it every day — skate sessions included — for 4 months. Not a scratch on the metal. Wood still looks perfect.", name: "Jordan F.", meta: "Koa Wood \u00B7 Skater, Portland OR" },
  { quote: "My old ring looked like every other guy's. This one starts conversations everywhere. Best $149 I've ever spent.", name: "Alex T.", meta: "Gold Shell \u00B7 Maple Burl" },
  { quote: "Daniel answered my DM personally about sizing. Delivered on time for the wedding. He genuinely cares — you can feel it in the ring.", name: "Chris & Mia L.", meta: "Matching Set \u00B7 Black Shell" },
];

function Stars() {
  return (
    <span className="text-[13px] tracking-[1.5px] text-[var(--amber)]">
      {"\u2605\u2605\u2605\u2605\u2605"}
    </span>
  );
}

interface RingTestimonialsProps {
  variant: "light" | "dark";
  ctaHref?: string;
}

export function RingTestimonials({ variant, ctaHref = "/shop" }: RingTestimonialsProps) {
  const isDark = variant === "dark";
  const cards = isDark ? DARK_CARDS : LIGHT_CARDS;

  return (
    <section className={isDark ? "bg-[#111] py-20 md:py-24" : "bg-[var(--cream)] py-20 md:py-24"}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--amber)]">
            {isDark ? "More Love" : "Verified Reviews"}
          </span>
          <h2 className={`font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] ${isDark ? "text-[var(--warm-white)]" : "text-[var(--black)]"}`}>
            {isDark ? (<>REAL PEOPLE.<br />REAL RINGS.</>) : (<>THE RINGS SPEAK<br />FOR THEMSELVES</>)}
          </h2>
          {!isDark && (
            <p className="mt-2 text-sm text-[var(--gray)]">
              Real couples &middot; Real stories &middot; 4.9 {"\u2605"} from 200+ reviews
            </p>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`flex flex-col gap-3.5 border p-6 ${isDark ? "border-[#2a2a2a] bg-[#1a1a1a]" : "border-[var(--light-gray)] bg-[var(--warm-white)]"}`}
            >
              {/* Media placeholder */}
              <div className={`aspect-square ${isDark ? "bg-[#1a1a1a]" : "bg-[var(--cream)]"}`} />
              <Stars />
              <p className={`flex-1 text-[13px] italic leading-[1.7] ${isDark ? "text-[#aaa]" : "text-[#444]"}`}>
                &ldquo;{card.quote}&rdquo;
              </p>
              <div className={`text-[13px] font-bold ${isDark ? "text-[var(--warm-white)]" : "text-[var(--black)]"}`}>
                {card.name}
              </div>
              <div className="text-[11px] text-[var(--gray)]">{card.meta}</div>
            </motion.div>
          ))}
        </div>

        {isDark && (
          <div className="mt-10 text-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2.5 border-2 border-white/40 px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:border-white hover:bg-white/[0.08]"
            >
              SEE ALL REVIEWS
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
