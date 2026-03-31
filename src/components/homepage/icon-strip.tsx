interface IconItem {
  icon: string;
  line1: string;
  line2: string;
}

interface IconStripProps {
  variant?: "light" | "cream";
  items: IconItem[];
}

export function IconStrip({ variant = "light", items }: IconStripProps) {
  return (
    <div
      className={`overflow-x-auto border-b border-[#e0dbd2] py-6 ${
        variant === "cream" ? "bg-[#ede8df]" : "bg-[var(--rebirth-film-cream)]"
      }`}
    >
      <div className="mx-auto flex min-w-[560px] max-w-[1200px] px-6">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex-1 px-1.5 py-2.5 text-center ${
              i < items.length - 1 ? "border-r border-[#e0dbd2]" : ""
            }`}
          >
            <div className="mb-1 text-2xl">{item.icon}</div>
            <div className="text-[10px] font-semibold leading-tight tracking-wide text-[var(--rebirth-warm-black)]">
              {item.line1}
              <br />
              {item.line2}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
