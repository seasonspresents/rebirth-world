"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type LucideIcon, Flower2, Zap, Palette, Heart } from "lucide-react";

/* ——————————————————————————————————
   VP1 — "The Original" (skateboard rings)
   Image left, copy right, light background
—————————————————————————————————— */
export function ValueProp1() {
  return (
    <section className="bg-[var(--rebirth-film-cream)] py-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-7 px-4 md:grid-cols-2 md:gap-[72px] md:px-6">
        {/* Media */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src="/images/rebirth-2026/rebirth-1-4.webp" alt="Handcrafted skateboard ring product shot" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
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

const WEDDING_SLIDESHOW_IMAGES = [
  "/images/wedding-bands/red-amboyna-burl/red-amboyna-main.webp",
  "/images/wedding-bands/spalted-maple-burl/spalted-maple-main.webp",
  "/images/wedding-bands/red-amboyna-burl/deep-lifestyle-.webp",
  "/images/wedding-bands/spalted-maple-burl/cinematic-lifestyle-.webp",
  "/images/wedding-bands/spalted-maple-burl/hand-lifestyle-shot-.webp",
];

export function ValueProp2() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % WEDDING_SLIDESHOW_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

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

        {/* Media — Cinematic Slideshow */}
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1.12 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1.2, ease: "easeInOut" },
                  scale: { duration: 4, ease: "easeOut" },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={WEDDING_SLIDESHOW_IMAGES[slideIndex]}
                  alt="Handcrafted wood-lined wedding band"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={slideIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
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
interface PhilosophyItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const PHILOSOPHY_ITEMS: PhilosophyItem[] = [
  {
    icon: Flower2,
    title: "Every Piece Is a Reminder",
    desc: "I make everything with one intention — to put something in your hands or on your body that reminds you to embrace the change you\u2019re going through.",
  },
  {
    icon: Zap,
    title: "Nothing Is Wasted",
    desc: "Broken skateboards become rings. Old chapters become new ones. The Rebirth philosophy started with a broken board and a master jeweler dad — and it\u2019s in every piece I make.",
  },
  {
    icon: Palette,
    title: "Thoughtfully Designed, Always",
    desc: "From handwoven bags with Mayan women in Guatemala to apparel drops designed with local artists — everything is collaborative, intentional, and built to mean something.",
  },
  {
    icon: Heart,
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
                <div className="mb-1.5 flex items-center gap-2 text-[15px] font-bold text-[var(--rebirth-film-cream)]">
                  <item.icon className="size-5 flex-shrink-0 text-[var(--rebirth-teal)]" />
                  {item.title}
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

        {/* Right: Daniel portrait */}
        <div className="hidden md:block">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image src="/images/rebirth-2026/malzl007585-r1-046-21a.webp" alt="Daniel Malzl handcrafting a ring in his workshop" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
