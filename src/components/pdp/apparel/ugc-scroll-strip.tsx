"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";

const UGC_CARDS = [
  {
    hasMedia: true,
    mediaLabel: "Video",
    stars: 5,
    quote:
      "I wear mine every time I\u2019m going through something hard. It\u2019s become a ritual. The message on the back hits differently when you need it.",
    initials: "KL",
    name: "Kayla L.",
    detail: "Crewneck \u00b7 Olive \u00b7 Size M",
    avatarBg: "#c4603a",
  },
  {
    hasMedia: true,
    mediaLabel: "Lifestyle",
    stars: 5,
    quote:
      "The quality is real. This isn\u2019t a band tee \u2014 it\u2019s built. The fleece weight is perfect and the graphic is something I actually want to talk about.",
    initials: "JM",
    name: "James M.",
    detail: "Crewneck \u00b7 Charcoal \u00b7 Size L",
    avatarBg: "#5c6644",
  },
  {
    hasMedia: false,
    stars: 5,
    quote:
      "I bought it because of the story. I kept wearing it because of the quality. Both reasons are still true six months later.",
    initials: "RN",
    name: "Rachel N.",
    detail: "Verified Buyer \u00b7 Portland, OR",
    avatarBg: "#b8922a",
  },
  {
    hasMedia: true,
    mediaLabel: "IG Post",
    stars: 5,
    quote:
      "People keep stopping me to ask about my crew. I love getting to tell them the story behind it. That\u2019s rare for a piece of clothing.",
    initials: "TS",
    name: "Talia S.",
    detail: "Sand \u00b7 Austin, TX",
    avatarBg: "#8b6b4a",
  },
  {
    hasMedia: false,
    stars: 5,
    quote:
      "I\u2019ve been going through a transition in my life and this piece found me at exactly the right time. Feels like it was made for this moment.",
    initials: "DW",
    name: "Dan W.",
    detail: "Crewneck \u00b7 Olive \u00b7 Size XL",
    avatarBg: "#c4603a",
  },
];

export function UgcScrollStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section style={{ backgroundColor: "#1c1a17", padding: "64px 0 48px" }}>
      {/* Header */}
      <div className="text-center px-6 mb-9">
        <span
          className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Worn by the Community
        </span>
        <h2
          className="font-[family-name:var(--font-caps)] tracking-[2px] leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 72px)", color: "#f2ece0" }}
        >
          WEARING
          <br />
          THE MESSAGE
        </h2>
        <p className="text-sm mt-2" style={{ color: "#9a9186" }}>
          Real people &middot; Real chapters &middot; 4.9 &#9733; average
        </p>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-3.5 overflow-x-auto px-6 pb-4"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
          scrollbarColor: "#c4603a rgba(255,255,255,0.05)",
        }}
      >
        {UGC_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 flex flex-col gap-3 p-5"
            style={{
              width: 290,
              backgroundColor: "#272320",
              border: "1px solid #332e28",
              scrollSnapAlign: "start",
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            {card.hasMedia && (
              <div
                className="flex items-center justify-center text-xs"
                style={{
                  aspectRatio: "3/4",
                  backgroundColor: "#1e1b17",
                  color: "#9a9186",
                }}
              >
                {card.mediaLabel}
              </div>
            )}
            <div style={{ color: "#c4603a", fontSize: 13, letterSpacing: 1 }}>
              {"★".repeat(card.stars)}
            </div>
            <p
              className="italic text-[13px] leading-[1.65] flex-1"
              style={{ color: "#bbb" }}
            >
              &ldquo;{card.quote}&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-auto">
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: card.avatarBg }}
              >
                {card.initials}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: "#f2ece0" }}>
                  {card.name}
                </div>
                <div className="text-[10px]" style={{ color: "#9a9186" }}>
                  {card.detail}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-9 px-6">
        <Link
          href="/shop?collection=apparel"
          className="inline-flex items-center justify-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 transition-all hover:bg-white/[0.08]"
          style={{
            border: "2px solid rgba(255,255,255,0.35)",
            color: "#fff",
          }}
        >
          SEE ALL COLLECTIONS
        </Link>
      </div>
    </section>
  );
}
