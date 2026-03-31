"use client";

import Image from "next/image";
import { motion } from "motion/react";

const CHAPTERS = [
  {
    num: "Chapter 01",
    title: "Where It Started — Age 14",
    text: "I've been skateboarding since I was eight. By fourteen, I had a collection of broken boards I couldn't bring myself to throw away. My dad — an Austrian master jeweler trained under the craftsman who made jewels for the emperor — sat down with me one day and we made our first ring together. Something reborn from something broken. That was the moment.",
    place: "Utah, USA",
  },
  {
    num: "Chapter 02",
    title: "The Community Builds It — Local Boards, Local Love",
    text: "Word spread. Skaters in the community started donating their snapped decks. I started repurposing them — ring by ring, layer by layer. Each one carrying the story of a session that ended and something new that began. Every skateboard ring I make is handmade from broken decks donated by the local skate community. Each ring is one of a kind. Each one carries a story.",
    place: "Provo, Utah",
  },
  {
    num: "Chapter 03",
    title: "Hawaii — The Philosophy Deepens",
    text: "I moved to Oahu to attend BYU\u2013Hawaii in Laie and opened my first real workshop there. The culture of Hawaii — the ocean, the people, the constant motion — inspired me deeply. The name Rebirth started to mean something bigger. Not just recycled material. Unavoidable change. Spiritual rebirth. The lotus growing through mud. Embrace it or be buried by it.",
    place: "Laie, Oahu, Hawaii",
  },
  {
    num: "Chapter 04",
    title: "Guatemala — Service, Connection, & a New Collection",
    text: "A two-year service mission brought me to Guatemala, where I found myself beside Lake Atitlan in San Lucas Toliman — one of the most beautiful places on earth. I collaborated with a small group of Mayan women who live by that lake and together we created a limited handwoven bag collection. Part art. Part service. Pure love for the people and the place. It wasn't the rings — but it was entirely Rebirth.",
    place: "San Lucas Toliman, Lake Atitlan, Guatemala",
  },
  {
    num: "Chapter 05 — Current",
    title: "The Wedding Band — A Ring for Your Next Chapter",
    text: "Now based in Mapleton, Utah — in the shadow of the Wasatch Mountains — I'm building the next chapter of Rebirth World: premium wood-lined metal wedding bands. For the person stepping into their commitment chapter. For anyone who wants to wear their values, their story, and their willingness to change and grow on their hand every single day.",
    place: "Mapleton, Utah",
  },
];

interface RingFounderStoryProps {
  image?: string;
}

export function RingFounderStory({ image }: RingFounderStoryProps) {
  return (
    <section className="bg-[var(--black)] py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-20">
          {/* Left: Portrait (sticky on desktop, hidden on mobile) */}
          <div className="hidden md:block md:sticky md:top-[100px]">
            {image ? (
              <div className="relative mb-3.5 aspect-[3/4] overflow-hidden">
                <Image src={image} alt="Daniel Malzl in his workshop" fill className="object-cover" sizes="50vw" />
              </div>
            ) : (
              <div className="mb-3.5 flex aspect-[3/4] items-center justify-center bg-[#1e1e1e] text-sm text-[var(--gray)]">
                Portrait placeholder
              </div>
            )}
            <div className="text-[11px] tracking-wide text-[#444]">
              Daniel Malzl &middot; Founder, Rebirth World &middot; Mapleton, Utah
            </div>
          </div>

          {/* Right: Story chapters */}
          <div>
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[3.5px] text-[var(--amber)]">
              The Story Behind Rebirth
            </span>
            <h2 className="mb-7 font-[family-name:var(--font-serif)] text-[clamp(28px,4vw,46px)] italic leading-[1.2] text-[var(--warm-white)]">
              From a Broken Board<br />to a Ring for Your<br />Forever Chapter
            </h2>

            {CHAPTERS.map((ch, i) => (
              <motion.div
                key={ch.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="mb-7 border-b border-[#2a2a2a] pb-7 last:mb-0 last:border-b-0 last:pb-0"
              >
                <div className="mb-1.5 font-[family-name:var(--font-caps)] text-[11px] tracking-[3px] text-[var(--teal)]">
                  {ch.num}
                </div>
                <div className="mb-2 text-[15px] font-semibold text-[var(--warm-white)]">
                  {ch.title}
                </div>
                <p className="text-sm leading-[1.75] text-[#888]">{ch.text}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-[var(--teal)]">
                  {"\u{1F4CD}"} {ch.place}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
