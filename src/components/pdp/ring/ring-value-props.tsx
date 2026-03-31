"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

/* ── Value Prop 1: The Craft (light bg) ── */
interface RingCraftProps {
  image?: string;
  ctaHref?: string;
}

export function RingCraft({ image, ctaHref = "/shop" }: RingCraftProps) {
  return (
    <section className="bg-[var(--warm-white)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-[72px]">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--cream)]">
                <Image src={image} alt="Daniel's hands fitting a wood liner into a ring" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-[var(--cream)] text-sm text-[var(--gray)]">
                Process shot placeholder
              </div>
            )}
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--teal)]">
              The Craft
            </span>
            <h2 className="mb-5 font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] text-[var(--black)]">
              ONE OF A KIND.<br />MADE BY HAND.<br />EVERY TIME.
            </h2>
            <p className="mb-6 text-[15px] leading-[1.8] text-[#555]">
              I don&apos;t run a factory. I run a workshop. Every ring is hand-sourced, hand-fitted, hand-finished — the same way my father was taught during a six-year apprenticeship under the jeweler who crafted pieces for the Austrian emperor. That precision, that care — it&apos;s in my hands. It&apos;s in yours.
            </p>
            <ul className="mb-7 list-none space-y-0">
              {[
                "Wood grain varies ring to ring — yours is genuinely one of a kind",
                "My father's Austrian master jeweler training runs through everything I make",
                "I inspect and finish every ring by hand before it ships",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-[var(--light-gray)] py-3 text-sm text-[#444] last:border-b-0"
                >
                  <span className="mt-0.5 shrink-0 text-base text-[var(--teal)]">
                    {"\u2713"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2.5 bg-[var(--black)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:bg-[var(--off-black,#222)] hover:-translate-y-px"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Value Prop 2: The Philosophy (dark bg, reversed) ── */
interface RingPhilosophyProps {
  image?: string;
  ctaHref?: string;
}

export function RingPhilosophy({ image, ctaHref = "/shop" }: RingPhilosophyProps) {
  const benefits = [
    {
      icon: "\u{1FAB7}",
      title: "The Rebirth Philosophy",
      text: "I believe we're all moving through miniature spiritual rebirths. I started by turning broken skateboards into rings at 14 — and I've been chasing transformation ever since. Every ring I make carries that belief.",
    },
    {
      icon: "\u{1F30A}",
      title: "Inspired by Many Cultures, Made in Utah",
      text: "I've been shaped by everywhere I've been — Hawaii, Guatemala, solo travels through Latin America. That's not background noise. It's in the philosophy, the materials, the way I think about craft. Now I build in Mapleton, Utah, and every ring carries all of it.",
    },
    {
      icon: "\u{1F30D}",
      title: "Service at the Core",
      text: "During my service mission in Guatemala, I collaborated with a small group of Mayan women who live by Lake Atitlan — one of the most beautiful places on earth. We made handwoven bags together. It was about community, love for the people, and showing up for something bigger than yourself. That spirit lives in everything I make.",
    },
  ];

  return (
    <section className="bg-[var(--black)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-[72px]">
          {/* Copy (left on desktop via order) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--teal)]">
              Why We Exist
            </span>
            <h2 className="mb-5 font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] text-[var(--warm-white)]">
              A RING THAT<br />MEANS SOMETHING
            </h2>
            <ul className="mb-7 list-none space-y-0">
              {benefits.map((b) => (
                <li
                  key={b.title}
                  className="flex items-start gap-3 border-b border-[#2a2a2a] py-3 text-sm text-[#aaa] last:border-b-0"
                >
                  <span className="mt-0.5 shrink-0 text-base text-[var(--teal)]">
                    {b.icon}
                  </span>
                  <div>
                    <strong className="mb-1 block text-[var(--warm-white)]">
                      {b.title}
                    </strong>
                    {b.text}
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2.5 bg-[var(--teal)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-white transition-all hover:bg-[var(--teal-dark,#1e7a6e)] hover:-translate-y-px"
            >
              SHOP NOW
            </Link>
          </motion.div>

          {/* Image (right, or first on mobile via default order) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-md:order-first"
          >
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-[#1e1e1e]">
                <Image src={image} alt="Daniel in his environment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-[#1e1e1e] text-sm text-[var(--gray)]">
                Lifestyle shot placeholder
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
