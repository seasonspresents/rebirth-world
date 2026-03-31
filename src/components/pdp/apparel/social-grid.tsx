"use client";

import { motion } from "motion/react";
import Link from "next/link";

const SOCIAL_CARDS = [
  {
    label: "IG Post",
    quote: "This piece goes everywhere with me #embracechange",
    handle: "@liveingrowth",
  },
  {
    label: "Travel Shot",
    quote: "Traveled through 4 countries in this tee. Still my favorite.",
    handle: "@wandersofia",
  },
  {
    label: "Detail Shot",
    quote: "The message hits every time someone asks about it",
    handle: "@chaptersbychris",
  },
  {
    label: "Group/Community",
    quote: "The whole crew got one. We wore them to the session.",
    handle: "@skateculture_sd",
  },
];

export function SocialGrid() {
  return (
    <section style={{ backgroundColor: "#f2ece0", padding: "80px 0" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
            style={{ color: "#c4603a" }}
          >
            Community
          </span>
          <h2
            className="font-[family-name:var(--font-caps)] tracking-[2px] leading-[1.05]"
            style={{
              fontSize: "clamp(28px, 4.5vw, 56px)",
              color: "#1c1a17",
            }}
          >
            WEARING IT
            <br />
            INTO THE WORLD
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-9">
          {SOCIAL_CARDS.map((card, i) => (
            <motion.div
              key={card.handle}
              className="overflow-hidden"
              style={{
                backgroundColor: "#ede5d8",
                border: "1px solid #e6ddd0",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div
                className="flex items-center justify-center text-xs"
                style={{
                  aspectRatio: "1",
                  backgroundColor: "#ede5d8",
                  border: "2px dashed #c4603a",
                  color: "#9a9186",
                }}
              >
                {card.label}
              </div>
              <div className="p-3.5">
                <div
                  className="text-xs mb-1.5"
                  style={{ color: "#c4603a" }}
                >
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                </div>
                <p
                  className="italic text-xs leading-[1.5] mb-2"
                  style={{ color: "#555" }}
                >
                  &ldquo;{card.quote}&rdquo;
                </p>
                <div
                  className="text-[10px] font-bold tracking-[0.5px]"
                  style={{ color: "#c4603a" }}
                >
                  {card.handle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="#"
            className="inline-flex items-center justify-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 transition-all hover:border-[#c4603a] hover:text-[#c4603a]"
            style={{
              border: "2px solid #c4bdb4",
              color: "#1c1a17",
              backgroundColor: "transparent",
            }}
          >
            SHOP CURRENT DROP
          </Link>
        </div>
      </div>
    </section>
  );
}
