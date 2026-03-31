import { motion } from "motion/react";

const STATS = [
  { num: "1,000+", label: "Happy Customers" },
  { num: "4.9\u2605", label: "Average Rating" },
  { num: "100%", label: "Handmade" },
  { num: "30-Day", label: "Guarantee" },
];

export function RingStatBar() {
  return (
    <div className="bg-[var(--teal)] py-5">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-3 px-6">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-1 min-w-[100px] flex-col items-center border-r border-white/20 px-6 py-2 text-center last:border-r-0 max-md:flex-[0_0_50%] max-md:border-r-0 max-md:border-b max-md:border-white/10 max-md:py-3 max-md:[&:nth-child(odd)]:border-r max-md:[&:nth-child(odd)]:border-white/10"
          >
            <div className="font-[family-name:var(--font-caps)] text-4xl tracking-[2px] text-white leading-none max-md:text-[28px]">
              {s.num}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[2px] text-white/65">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
