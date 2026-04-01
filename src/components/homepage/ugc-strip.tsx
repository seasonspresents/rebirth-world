"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
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
  mediaImage?: string;
}

const TESTIMONIALS: UgcTestimonial[] = [
  {
    initials: "JJ",
    initialsColor: "bg-[var(--rebirth-teal)]",
    name: "Jackson J.",
    detail: "Wedding Band · @jacksonnjudd",
    quote:
      "\u201CIn love with this new ring that @rebirthrings made for me. Hit up my boy if you want one!\u201D",
    hasMedia: true,
    mediaLabel: "Instagram",
    mediaNote:
      "Customer Instagram post showing their Rebirth ring",
    mediaImage: "/images/people/men-wedding-ring.webp",
  },
  {
    initials: "SF",
    initialsColor: "bg-[var(--rebirth-amber)]",
    name: "Sierra F.",
    detail: "Engraved Ring · @sierra.fernald",
    quote:
      "\u201COne of the members in The Unbound makes these really sick rings out of old skateboard decks & he engraved a few for me & some of the other members... how stinking cool\u201D",
    hasMedia: true,
    mediaLabel: "Customer Photo",
    mediaNote:
      "Customer photo of engraved skateboard ring",
    mediaImage: "/images/people/img_9537.webp",
  },
  {
    initials: "VB",
    initialsColor: "bg-[#5a6b4a]",
    name: "Verified Buyer",
    detail: "Custom Ring · DM",
    quote:
      "\u201CEverything looks incredible, I\u2019m so stoked. Thank you. My mom FaceTimed me as she opened it and it looks better than I could have ever imagined, thank you for turning my dreams into reality\u201D",
    hasMedia: false,
  },
  {
    initials: "MJ",
    initialsColor: "bg-[#c49494]",
    name: "Jared",
    detail: "Engagement Ring · @mormonjared",
    quote:
      "\u201CUs looking at my engagement ring made by @danielmalzl \u2014 It has one of my first / favorite skateboards inside!\u201D",
    hasMedia: true,
    mediaLabel: "Instagram",
    mediaNote:
      "Customer showing engagement ring with skateboard inside",
    mediaImage: "/images/people/dame-in-rebirth.webp",
  },
  {
    initials: "JJ",
    initialsColor: "bg-[#8b6b4a]",
    name: "Jackson J.",
    detail: "Rebirth Hoodie · @jacksonnjudd",
    quote:
      "\u201CFavorite hoodie fr @rebirthrings\u201D",
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
              <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                {t.mediaImage ? (
                  <Image src={t.mediaImage} alt={`${t.name} wearing Rebirth product`} fill className="object-cover" sizes="290px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-[11px] text-[#8a8578]">
                    {t.mediaNote}
                  </div>
                )}
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
