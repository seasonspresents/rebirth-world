"use client";

import { motion } from "motion/react";

const ICONS = [
  { icon: "\u270B", label: "Handmade\nin Utah" },
  { icon: "\u{1F33F}", label: "Sustainably\nSourced Wood" },
  { icon: "\u{1F48E}", label: "Premium\nMetal Shell" },
  { icon: "\u270D\uFE0F", label: "Custom\nEngraving" },
  { icon: "\u{1F6E1}\uFE0F", label: "1-Year\nWarranty" },
  { icon: "\u{1F69A}", label: "Free US\nShipping $75+" },
  { icon: "\u{1F30D}", label: "Gives Back to\nCommunity" },
];

export function RingIconStrip() {
  return (
    <div className="overflow-x-auto border-b border-[var(--light-gray)] bg-[var(--warm-white)] py-7">
      <div className="mx-auto flex min-w-[560px] max-w-[1200px] px-6">
        {ICONS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="flex flex-1 flex-col items-center gap-1.5 border-r border-[var(--light-gray)] px-2 py-3 text-center last:border-r-0"
          >
            <span className="text-[26px]">{item.icon}</span>
            <span className="whitespace-pre-line text-[10px] font-semibold leading-[1.3] tracking-wide text-[var(--black)]">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
