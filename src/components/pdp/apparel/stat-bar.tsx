const STATS = [
  { num: "100%", label: "Limited Drops" },
  { num: "~7", label: "Bottles Saved / Garment" },
  { num: "4.9\u2605", label: "Average Rating" },
  { num: "Local", label: "Artist Collabs" },
];

export function StatBar() {
  return (
    <div style={{ backgroundColor: "#c4603a", padding: "22px 0" }}>
      <div
        className="flex justify-center flex-wrap px-6 mx-auto"
        style={{ maxWidth: 1200 }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="text-center py-2 px-8 flex-1 min-w-[100px]"
            style={{
              borderRight:
                i < STATS.length - 1
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "none",
            }}
          >
            <div
              className="font-[family-name:var(--font-caps)] text-white leading-none"
              style={{ fontSize: 36, letterSpacing: 2 }}
            >
              {stat.num}
            </div>
            <div
              className="text-[10px] tracking-[2px] uppercase mt-[3px]"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
