import Link from "next/link";

const OFFERS = [
  {
    icon: "💍",
    title: "Custom Ring\nConsultation",
    desc: "Not sure which ring is right for you? I offer personal consultations to help you find the right metal, wood, size, and engraving for your chapter. DM me directly or fill out the form — I respond personally.",
    cta: "GET IN TOUCH",
    href: "/contact",
    btnClass:
      "bg-[var(--rebirth-teal)] text-white hover:bg-[#1e7a6e]",
  },
  {
    icon: "🎁",
    title: "Gift a Ring\nor Collection Drop",
    desc: "Every Rebirth piece makes a meaningful gift — for a wedding, a birthday, a milestone, or just because someone you love is in the middle of a chapter. Gift cards and gift packaging available.",
    cta: "SHOP GIFTS",
    href: "/shop?collection=accessories",
    btnClass:
      "bg-[var(--rebirth-amber)] text-white hover:bg-[#c05f22]",
  },
  {
    icon: "📩",
    title: "Join the List —\nNever Miss a Drop",
    desc: "Collections sell out. Wedding band batches go fast. Get early access to every drop, behind-the-scenes from the workshop, and first notice of new rings before they hit the site.",
    cta: "JOIN THE LIST",
    href: "/newsletter",
    btnClass:
      "border-2 border-white/40 bg-transparent text-white hover:border-white hover:bg-white/[0.08]",
  },
];

export function Offers() {
  return (
    <section className="bg-[var(--rebirth-warm-black)] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-amber)]">
            More Ways In
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px] text-[var(--rebirth-film-cream)]">
            FIND YOUR
            <br />
            ENTRY POINT
          </h2>
        </div>

        {/* Cards */}
        <div className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {OFFERS.map((offer, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 border border-[#2e2a24] bg-[#2e2b26] p-7 transition-colors hover:border-[var(--rebirth-teal)]"
            >
              <div className="text-4xl">{offer.icon}</div>
              <h3 className="font-[family-name:var(--font-caps)] text-[26px] leading-[1.1] tracking-[1.5px] text-[var(--rebirth-film-cream)] whitespace-pre-line">
                {offer.title}
              </h3>
              <p className="flex-1 text-[13px] leading-[1.7] text-[#888]">
                {offer.desc}
              </p>
              <Link
                href={offer.href}
                className={`mt-auto inline-flex items-center justify-center gap-2 px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] transition-all hover:-translate-y-0.5 ${offer.btnClass}`}
              >
                {offer.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust stat */}
        <div className="border border-white/[0.06] bg-white/[0.03] p-7 text-center">
          <p className="text-xs italic text-[#555]">
            Over 1,000 rings shipped worldwide · 25+ countries · 4.9 ★ average
          </p>
        </div>
      </div>
    </section>
  );
}
