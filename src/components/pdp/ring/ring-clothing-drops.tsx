"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const DROPS = [
  {
    season: "Spring 2026 \u00B7 Limited Drop",
    name: "The \u201CLetting Go\u201D Collection",
    theme: "Inspired by releasing what no longer serves you to move into the next chapter. Earthy tones, loose silhouettes, minimal graphics — wearable intention.",
    status: "Live Now",
    statusClass: "text-[var(--teal)]",
    statusIcon: "\u25CF",
    image: "/images/apparel/08c19d89-2593-4fc8-8ce3-af1ae307ca8d.webp",
  },
  {
    season: "Winter 2025 \u00B7 Sold Out",
    name: "The \u201CRoots\u201D Collection",
    theme: "A tribute to origin — family, craft, skateboarding, Salzburg to Oahu. Dark colorways, heavyweight fleece, embroidered lotus detail.",
    status: "Sold Out \u2014 Join Waitlist",
    statusClass: "text-[var(--gray)]",
    statusIcon: "\u2726",
    image: "/images/apparel/4eff2918-76af-433a-b334-f4f8c1ace087.webp",
  },
  {
    season: "Summer 2026 \u00B7 Coming Soon",
    name: "Untitled Summer Drop",
    theme: "Theme TBD — join the list to be the first to know. If history is any guide, it'll be worth the wait.",
    status: "Notify Me",
    statusClass: "text-[var(--amber)]",
    statusIcon: "\u25CE",
    image: "/images/rebirth-2026/crewneck-pre-sale_socials.webp",
  },
];

export function RingClothingDrops() {
  return (
    <section className="bg-[var(--cream)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--amber)]">
            Limited Collections
          </span>
          <h2 className="mb-2.5 font-[family-name:var(--font-caps)] text-[clamp(34px,5vw,60px)] leading-none tracking-[2px] text-[var(--black)]">
            EVERY COLLECTION<br />TELLS A STORY
          </h2>
          <p className="mx-auto max-w-[580px] text-[15px] text-[var(--gray)]">
            Each clothing drop is a one-of-a-kind seasonal collection — released once, tied to a theme that speaks to the current Rebirth message. When it&apos;s gone, it&apos;s gone. These aren&apos;t basics. They&apos;re chapters.
          </p>
        </div>

        {/* Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DROPS.map((drop, i) => (
            <motion.div
              key={drop.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="overflow-hidden border border-[var(--light-gray)] bg-[var(--warm-white)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Collection image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--cream)]">
                {drop.image ? (
                  <Image src={drop.image} alt={drop.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--gray)]">Coming soon</div>
                )}
              </div>
              <div className="p-[18px]">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[2px] text-[var(--teal)]">
                  {drop.season}
                </div>
                <div className="mb-1.5 text-[15px] font-bold text-[var(--black)]">
                  {drop.name}
                </div>
                <div className="mb-3 text-xs leading-[1.5] text-[var(--gray)]">
                  {drop.theme}
                </div>
                <div className={`text-[11px] font-bold uppercase tracking-[1.5px] ${drop.statusClass}`}>
                  {drop.statusIcon} {drop.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2.5 bg-[var(--black)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:bg-[var(--off-black,#222)] hover:-translate-y-px"
          >
            VIEW ALL COLLECTIONS
          </Link>
        </div>
      </div>
    </section>
  );
}
