"use client";

import { Marquee } from "@/components/ui/marquee";

const proofItems = [
  "1,000+ Rings Crafted",
  "\u2B50 4.9 Average Rating",
  "Handmade in Hawaii",
  "100% Recycled Materials",
  "1-Year Warranty",
];

export function SocialProofBar() {
  return (
    <section data-section-theme="earth" className="section-earth">
      <div className="py-4">
        <Marquee className="[--duration:25s] [--gap:3rem]">
          {proofItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.15em] font-[family-name:var(--font-dm-mono)]"
            >
              {item}
              <span className="text-[8px] opacity-40" aria-hidden="true">
                &#9671;
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
