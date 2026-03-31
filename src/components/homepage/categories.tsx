import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  description: string;
  price: string;
  tag: string;
  tagColor: string;
  icon: string;
  mediaNote: string;
}

const CATEGORIES: Category[] = [
  {
    name: "Wedding Bands",
    slug: "wedding-bands",
    description:
      "Premium wood-lined metal bands, handmade to order. For the commitment chapter.",
    price: "From $149",
    tag: "Wedding Bands",
    tagColor: "bg-[var(--rebirth-teal)] text-white",
    icon: "💍",
    mediaNote: "Wedding band lifestyle — ring on hand, outdoor warm light",
  },
  {
    name: "Skateboard Rings",
    slug: "skateboard-rings",
    description:
      "Handmade from broken decks donated by the local skate community. Each one carries a story.",
    price: "From $25",
    tag: "Skate Rings",
    tagColor: "bg-[var(--rebirth-amber)] text-white",
    icon: "🛹",
    mediaNote:
      "Skateboard ring collection flatlay — show the colorful layers",
  },
  {
    name: "Apparel Drops",
    slug: "apparel",
    description:
      "Limited seasonal collections designed with local artists. One theme, one season, one story. When it\u2019s gone, it\u2019s gone.",
    price: "From $45",
    tag: "Drop Live",
    tagColor: "bg-[#5a6b4a] text-white",
    icon: "👕",
    mediaNote: "Current apparel drop — person wearing the crewneck outdoors",
  },
  {
    name: "Necklaces & More",
    slug: "accessories",
    description:
      "Recycled skateboard pendants and accessories — same philosophy, different form.",
    price: "From $25",
    tag: "Accessories",
    tagColor: "bg-[var(--rebirth-warm-black)] text-[var(--rebirth-film-cream)]",
    icon: "📿",
    mediaNote:
      "Necklace and accessories — lifestyle shot showing the piece worn",
  },
];

export function Categories() {
  return (
    <section className="bg-[#ede8df] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-amber)]">
            Explore
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px]">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 min-[400px]:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?collection=${cat.slug}`}
              className="group overflow-hidden border border-[#e0dbd2] bg-[var(--rebirth-film-cream)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Image placeholder */}
              <div className="relative flex aspect-square items-center justify-center bg-[#ede8df] text-center">
                <span className={`absolute left-2.5 top-2.5 z-10 px-2 py-1 text-[9px] font-bold uppercase tracking-[2px] ${cat.tagColor}`}>
                  {cat.tag}
                </span>
                <div>
                  <div className="text-4xl">{cat.icon}</div>
                  <p className="mx-auto mt-1 max-w-[200px] px-2 text-[10px] leading-snug text-[#8a8578]">
                    {cat.mediaNote}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="mb-1.5 text-sm font-bold">{cat.name}</div>
                <div className="mb-3 text-xs leading-snug text-[#8a8578]">
                  {cat.description}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-[family-name:var(--font-caps)] text-xl tracking-wider text-[var(--rebirth-teal)]">
                    {cat.price}
                  </div>
                  <span className="bg-[var(--rebirth-warm-black)] px-3.5 py-1.5 font-[family-name:var(--font-caps)] text-xs tracking-[1.5px] text-[var(--rebirth-film-cream)] transition-colors group-hover:bg-[var(--rebirth-teal)]">
                    SHOP NOW
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
