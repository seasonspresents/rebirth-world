interface StatItem {
  num: string;
  label: string;
}

const STATS: StatItem[] = [
  { num: "1,000+", label: "Customers Worldwide" },
  { num: "4.9★", label: "Average Rating" },
  { num: "10 Yrs", label: "Of Craft" },
  { num: "100%", label: "Handmade" },
];

export function StatBar() {
  return (
    <div className="bg-[var(--rebirth-teal)] py-5">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center px-6">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`flex-1 min-w-[100px] px-8 py-2 text-center max-md:min-w-[50%] max-md:border-b max-md:border-white/10 max-md:px-3 max-md:py-3 ${
              i < STATS.length - 1
                ? "border-r border-white/20 max-md:odd:border-r max-md:even:border-r-0"
                : "max-md:border-b-0"
            }`}
          >
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-[2px] text-white">
              {stat.num}
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[2px] text-white/65">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
