"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

/* ——————————————————————————————————
   VP1 — "The Original" (skateboard rings)
   Image left, copy right, light background
—————————————————————————————————— */
export function ValueProp1() {
  return (
    <section className="bg-[var(--rebirth-film-cream)] py-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-7 px-4 md:grid-cols-2 md:gap-[72px] md:px-6">
        {/* Media placeholder */}
        <div className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-[var(--rebirth-amber)] bg-[#ede8df] text-center">
          <div>
            <div className="text-4xl">🛹</div>
            <div className="mt-2 text-[11px] font-bold uppercase tracking-wider">
              Broken Board → Ring
            </div>
            <p className="mx-auto mt-1 max-w-[260px] px-3 text-[11px] leading-snug text-[#8a8578]">
              The transformation — a broken skateboard deck next to a finished
              ring. Or Daniel&apos;s hands in the act of making.
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-teal)]">
            The Original
          </span>
          <h2 className="mb-5 font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px]">
            EVERY BROKEN
            <br />
            BOARD HAS
            <br />A NEW LIFE.
          </h2>
          <p className="mb-6 text-[15px] leading-[1.8] text-[#555]">
            I started making rings from broken skateboard decks at 14 — donated
            by the local skate community who couldn&apos;t bring themselves to
            throw them away either. Each 7-layer maple ring is handmade from
            those decks. One of a kind. Carrying the story of every session that
            ended, and every new chapter that began.
          </p>
          <ul className="mb-7 list-none">
            {[
              "Made from boards donated by the local skate community",
              "Each ring is one of a kind — no two boards are ever identical",
              "My father is an Austrian master jeweler — the craft runs in the family",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-[#e0dbd2] py-3 text-sm text-[#444] last:border-b-0"
              >
                <span className="mt-0.5 flex-shrink-0 text-base text-[var(--rebirth-teal)]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/shop?collection=skateboard-rings"
            className="inline-flex items-center justify-center gap-2 bg-[var(--rebirth-warm-black)] px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-[var(--rebirth-film-cream)] transition-all hover:-translate-y-0.5 hover:bg-[#222]"
          >
            SHOP RINGS
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ——————————————————————————————————
   VP2 — "Wedding Bands"
   Reversed layout, dark background, expandable benefit list
—————————————————————————————————— */
interface BenefitItem {
  title: string;
  body: string;
}

const WEDDING_BENEFITS: BenefitItem[] = [
  {
    title: "Premium Wood-Lined Metal Shell",
    body: "Gold-plated, black-coated, or brushed steel shell hand-fitted with a stabilized wood liner — Irish bog oak, Koa, Maple Burl, or Ebony. 0.8mm slim profile. Built to wear every day.",
  },
  {
    title: "Handmade to Order in Mapleton, Utah",
    body: "I make every ring by hand — no batch production, no shortcuts. Allow 5\u201310 business days. Each one inspected before it ships.",
  },
  {
    title: "Free Custom Engraving",
    body: "Add a personal message inside the band at checkout — up to 10 characters for $9. Coordinates, a date, initials, or a word that means something.",
  },
  {
    title: "Matching Sets Available",
    body: "Order his and hers together and save $40. Both handmade, both unique, both carrying the same philosophy.",
  },
];

export function ValueProp2() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[var(--rebirth-warm-black)] py-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-7 px-4 md:grid-cols-2 md:gap-[72px] md:px-6">
        {/* Content — first on mobile, second on desktop (using order) */}
        <div className="order-2 md:order-1">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-teal)]">
            Wedding Bands
          </span>
          <h2 className="mb-5 font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px] text-[var(--rebirth-film-cream)]">
            A RING FOR YOUR
            <br />
            COMMITMENT
            <br />
            CHAPTER.
          </h2>
          <ul className="mb-7 list-none">
            {WEDDING_BENEFITS.map((item, i) => (
              <li
                key={i}
                className="border-b border-[#2a2a2a] py-3.5 last:border-b-0"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-[var(--rebirth-film-cream)]"
                >
                  {item.title}
                  <span
                    className={`ml-4 text-[var(--rebirth-teal)] transition-transform ${
                      openIndex === i ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === i ? "auto" : 0,
                    opacity: openIndex === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pt-2 text-[13px] leading-relaxed text-[#8a8578]">
                    {item.body}
                  </p>
                </motion.div>
              </li>
            ))}
          </ul>
          <Link
            href="/shop?collection=wedding-bands"
            className="inline-flex items-center justify-center gap-2 bg-[var(--rebirth-teal)] px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e]"
          >
            SHOP WEDDING BANDS
          </Link>
        </div>

        {/* Media placeholder */}
        <div className="order-1 md:order-2">
          <div className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-[#2a2a2a] bg-[#1e1e1e] text-center">
            <div>
              <div className="text-4xl">💍</div>
              <p className="mx-auto mt-2 max-w-[260px] px-3 text-[11px] leading-snug text-[#8a8578]">
                Wedding band in a meaningful setting — on a hand, on a dark
                surface, beside nature. Warm, dramatic light.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——————————————————————————————————
   VP3 — "The Philosophy"
   4 benefit headlines on dark bg
—————————————————————————————————— */
const PHILOSOPHY_ITEMS = [
  {
    icon: "🪷",
    title: "Every Piece Is a Reminder",
    desc: "I make everything with one intention — to put something in your hands or on your body that reminds you to embrace the change you\u2019re going through.",
  },
  {
    icon: "🛹",
    title: "Nothing Is Wasted",
    desc: "Broken skateboards become rings. Old chapters become new ones. The Rebirth philosophy started with a broken board and a master jeweler dad — and it\u2019s in every piece I make.",
  },
  {
    icon: "🎨",
    title: "Thoughtfully Designed, Always",
    desc: "From handwoven bags with Mayan women in Guatemala to apparel drops designed with local artists — everything is collaborative, intentional, and built to mean something.",
  },
  {
    icon: "💛",
    title: "Service Is the Foundation",
    desc: "I believe in giving back — with specific people, in specific places. The Mayan women of Lake Atitl\u00E1n. The skate community. The people around me. Community is how Rebirth was built.",
  },
];

export function ValueProp3() {
  return (
    <section className="bg-[var(--rebirth-warm-black)] py-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-6">
        {/* Left: Content */}
        <div>
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[3.5px] text-white/45">
            The Philosophy
          </span>
          <h2 className="mb-8 font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px] text-[var(--rebirth-film-cream)]">
            MADE FOR THE
            <br />
            PERSON IN THE
            <br />
            MIDDLE OF
            <br />
            SOMETHING.
          </h2>
          <ul className="mb-7 list-none">
            {PHILOSOPHY_ITEMS.map((item, i) => (
              <li
                key={i}
                className="border-b border-[#2a2a2a] py-5 last:border-b-0"
              >
                <div className="mb-1.5 text-[15px] font-bold text-[var(--rebirth-film-cream)]">
                  {item.icon} {item.title}
                </div>
                <div className="text-[13px] leading-relaxed text-[#777]">
                  {item.desc}
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--rebirth-teal)] px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e]"
          >
            SHOP NOW
          </Link>
        </div>

        {/* Right: Media placeholder */}
        <div className="hidden md:block">
          <div className="flex aspect-[3/4] items-center justify-center border-2 border-dashed border-[#2a2a2a] bg-[#1a1a1a] text-center">
            <div>
              <div className="text-4xl">🧑‍🎨</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--rebirth-film-cream)]">
                Daniel in the Workshop
              </div>
              <p className="mx-auto mt-1 max-w-[260px] px-3 text-[11px] leading-snug text-[#8a8578]">
                Daniel at his workbench — mid-process, hands working on a ring.
                Editorial quality, not styled. Real &gt; polished.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
