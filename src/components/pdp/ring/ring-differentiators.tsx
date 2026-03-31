"use client";

import Link from "next/link";
import { motion } from "motion/react";

const DIFF_CARDS = [
  { icon: "\u{1F6F9}", title: "Born from Skateboard Culture", body: "I've been skating since I was 8. Every skateboard ring I make comes from broken decks donated by the local skate community. That's not a marketing angle — that's how this started." },
  { icon: "\u{1F3D4}\uFE0F", title: "Austrian Master Jeweler Lineage", body: "My father apprenticed under the jeweler who crafted for the Austrian emperor — six years of old-world technique. I learned from him. That standard runs in everything I make." },
  { icon: "\u{1F30A}", title: "Inspired by Many Cultures", body: "Hawaii shaped my philosophy. Guatemala deepened my purpose. Solo travels through Latin America broadened my perspective. I build in Utah — but every ring carries all of it." },
  { icon: "\u{1F33F}", title: "Materials With History", body: "Irish bog oak preserved for thousands of years. Koa. Stabilized exotic woods from around the world. Your ring has a past as rich as yours." },
  { icon: "\u{1F49B}", title: "Service at the Core", body: "During my service mission, I collaborated with a small group of Mayan women who live by Lake Atitlan, Guatemala — creating handwoven bags together, built on community and love. That spirit of service is woven into everything I do." },
  { icon: "\u{1FAB7}", title: "The Philosophy Is Real", body: "Embrace Change. I believe we are all in miniature spiritual rebirths throughout our lives. Your ring is a reminder to keep stepping into the next chapter — whatever it holds." },
];

interface RingDifferentiatorsProps {
  ctaHref?: string;
}

export function RingDifferentiators({ ctaHref = "/shop" }: RingDifferentiatorsProps) {
  return (
    <section className="bg-[var(--warm-white)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-2.5 font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] text-[var(--black)]">
            WHY REBIRTH IS UNLIKE<br />ANYTHING ELSE
          </h2>
          <p className="text-[15px] text-[var(--gray)]">
            Mass-produced rings are made for everyone. Ours are made for the person you&apos;re becoming.
          </p>
        </div>

        {/* Grid */}
        <div className="mb-11 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIFF_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="border border-[var(--light-gray)] p-7 transition-all hover:border-[var(--teal)] hover:shadow-[0_4px_24px_rgba(42,157,143,0.08)]"
            >
              <div className="mb-3 text-[30px]">{card.icon}</div>
              <div className="mb-2 text-sm font-bold text-[var(--black)]">
                {card.title}
              </div>
              <div className="text-xs leading-[1.65] text-[var(--gray)]">
                {card.body}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2.5 bg-[var(--black)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:bg-[var(--off-black,#222)] hover:-translate-y-px"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
