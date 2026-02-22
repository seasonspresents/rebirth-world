"use client";

import { Marquee } from "@/components/ui/marquee";

const phrases = [
  "Embrace Change",
  "Handmade on the North Shore",
  "Recycled Skateboard Rings",
  "Free Shipping on Orders $75+",
  "Wood-Lined Wedding Bands",
  "Every Board Reborn",
];

export function AnnouncementBar() {
  return (
    <div className="relative z-50 border-b border-border/40 bg-foreground text-background">
      <Marquee className="py-1.5 [--duration:30s] [--gap:2rem]">
        {phrases.map((phrase) => (
          <span
            key={phrase}
            className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.15em] font-[family-name:var(--font-dm-mono)]"
          >
            {phrase}
            <span className="text-[8px] opacity-40" aria-hidden="true">
              &#9671;
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
