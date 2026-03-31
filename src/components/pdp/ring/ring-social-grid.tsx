"use client";

import Link from "next/link";
import { motion } from "motion/react";

const SOCIAL_CARDS = [
  { quote: "Obsessed with this ring \u{1F919} #rebirthrings #embracechange", handle: "@jake_surfsnorth" },
  { quote: "Our forever rings \u{1F48D} couldn't be more us", handle: "@themalonecouple" },
  { quote: "Skate forever. Rebirth always \u{1F6F9}", handle: "@coastalskatelife" },
  { quote: "The grain is insane. Nothing like it \u{1F33F}", handle: "@sustainablestyled" },
];

interface RingSocialGridProps {
  ctaHref?: string;
}

export function RingSocialGrid({ ctaHref = "/shop" }: RingSocialGridProps) {
  return (
    <section className="bg-[var(--cream)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--teal)]">
            Community
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] text-[var(--black)]">
            THE COMMUNITY<br />LOVES REBIRTH
          </h2>
        </div>

        {/* Cards */}
        <div className="mb-9 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {SOCIAL_CARDS.map((card, i) => (
            <motion.div
              key={card.handle}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="overflow-hidden border border-[var(--light-gray)] bg-[var(--warm-white)]"
            >
              {/* Media placeholder */}
              <div className="flex aspect-square items-center justify-center bg-[var(--cream)] text-sm text-[var(--gray)]">
                Social image
              </div>
              <div className="p-3.5">
                <div className="mb-1.5 text-xs text-[var(--amber)]">
                  {"\u2605\u2605\u2605\u2605\u2605"}
                </div>
                <p className="mb-2 text-xs italic leading-[1.5] text-[#555]">
                  &ldquo;{card.quote}&rdquo;
                </p>
                <div className="text-[10px] font-bold tracking-wide text-[var(--teal)]">
                  {card.handle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2.5 border-2 border-[var(--mid-gray)] bg-transparent px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--black)] transition-all hover:border-[var(--teal)] hover:text-[var(--teal)]"
          >
            SHOP THE COLLECTION
          </Link>
        </div>
      </div>
    </section>
  );
}
