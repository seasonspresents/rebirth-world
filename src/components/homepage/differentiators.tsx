import Link from "next/link";

const DIFFS = [
  {
    icon: "🛹",
    title: "Born from Skateboard Culture",
    body: "I\u2019ve been skating since I was 8. Every skateboard ring starts with a broken deck donated by the local community. The culture isn\u2019t a marketing angle — it\u2019s who I am.",
  },
  {
    icon: "🏔️",
    title: "Austrian Master Jeweler Lineage",
    body: "My father apprenticed under the jeweler who crafted for the Austrian emperor — six years of old-world technique. That standard is in everything I make.",
  },
  {
    icon: "🌊",
    title: "Inspired by Many Cultures",
    body: "Hawaii shaped my philosophy. Guatemala deepened my purpose through service with the Mayan women of Lake Atitl\u00E1n. Solo travels through Latin America broadened my perspective. Made in Utah. Shaped by everywhere.",
  },
  {
    icon: "🌿",
    title: "Materials With History",
    body: "Irish bog oak preserved for thousands of years. Stabilized exotic woods from around the world. Recycled skate decks from the local community. Your piece has a past as rich as yours.",
  },
  {
    icon: "💛",
    title: "Service at the Core",
    body: "I collaborated with a small group of Mayan women who live by Lake Atitl\u00E1n, Guatemala to create a handwoven collection. Service isn\u2019t a campaign — it\u2019s how I operate.",
  },
  {
    icon: "🪷",
    title: "The Philosophy Is Real",
    body: "Embrace Change. We are all going through miniature spiritual rebirths. Every piece I make is a reminder to keep stepping into the next chapter — whatever it holds.",
  },
];

export function Differentiators() {
  return (
    <section className="bg-[var(--rebirth-film-cream)] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-teal)]">
            Why Rebirth
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px]">
            HOW I DO IT —
            <br />
            AND WHAT MAKES
            <br />
            IT DIFFERENT
          </h2>
        </div>

        {/* 3x2 Grid */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DIFFS.map((d, i) => (
            <div
              key={i}
              className="border border-[#e0dbd2] p-6 transition-all hover:border-[var(--rebirth-teal)] hover:shadow-[0_4px_24px_rgba(42,157,143,0.08)]"
            >
              <div className="mb-3 text-3xl">{d.icon}</div>
              <div className="mb-2 text-sm font-bold">{d.title}</div>
              <div className="text-xs leading-relaxed text-[#8a8578]">
                {d.body}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[var(--rebirth-warm-black)] px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-[var(--rebirth-film-cream)] transition-all hover:-translate-y-0.5 hover:bg-[#222]"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
