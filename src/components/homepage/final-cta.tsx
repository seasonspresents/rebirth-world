import Link from "next/link";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--rebirth-warm-black)] px-5 py-20 text-center md:py-32">
      {/* Radial gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, rgba(42,157,143,0.12) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 80% 20%, rgba(224,122,58,0.08) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[700px]">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-amber)]">
          Embrace Change
        </span>

        <h2 className="mb-4 font-[family-name:var(--font-serif)] text-[clamp(36px,6vw,68px)] font-bold italic leading-[1.1] text-[var(--rebirth-film-cream)]">
          The Right Ring.
          <br />
          The Right Message.
          <br />
          <em className="not-italic text-[var(--rebirth-teal)]">Right Now.</em>
        </h2>

        <p className="mx-auto mb-11 max-w-[540px] text-base leading-[1.8] text-[#777]">
          I make handmade rings from broken skateboards, premium wood-lined
          wedding bands, and limited apparel drops that carry deeper messages.
          All of it rooted in one belief — we are always in the middle of a
          rebirth. Wear yours.
        </p>

        <div className="mb-4 flex flex-col items-center justify-center gap-3 md:flex-row">
          <Link
            href="/shop?collection=wedding-bands"
            className="inline-flex w-full max-w-[340px] items-center justify-center gap-2 bg-[var(--rebirth-teal)] px-12 py-5 font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e] md:w-auto"
          >
            SHOP RINGS
          </Link>
          <Link
            href="/shop?collection=apparel"
            className="inline-flex w-full max-w-[340px] items-center justify-center gap-2 border-2 border-white/40 bg-transparent px-12 py-5 font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/[0.08] md:w-auto"
          >
            SHOP APPAREL
          </Link>
        </div>

        <p className="text-[11px] tracking-wide text-[#444]">
          Free US Shipping $75+ · 30-Day Returns · 1-Year Warranty · Handmade
          in Mapleton, Utah · Embrace Change
        </p>
      </div>
    </section>
  );
}
