import Link from "next/link";

interface Testimonial {
  quote: string;
  name: string;
  meta: string;
  mediaNote?: string;
  mediaIcon?: string;
  mediaLabel?: string;
}

/* ——————————————————————————————————
   Light variant — "THE WORK SPEAKS FOR ITSELF"
—————————————————————————————————— */

const LIGHT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "\u201CWe ordered matching sets. Both felt the weight of them — real, handmade weight. Not the usual factory ring. Something else entirely.\u201D",
    name: "Sarah & Luis M.",
    meta: "Matching Set · Verified Buyers",
    mediaNote:
      "Wedding couple showing their matching set — 20-40 sec selfie video",
    mediaIcon: "🎥",
    mediaLabel: "Video",
  },
  {
    quote:
      "\u201CI wear mine surfing, skating, everywhere. The finish holds up and the story behind it means I\u2019ll never take it off anyway.\u201D",
    name: "Brendan T.",
    meta: "Irish Bog Oak · Surfer, CA",
    mediaNote:
      "Customer photo — ring on hand in real setting",
    mediaIcon: "📸",
    mediaLabel: "UGC Photo",
  },
  {
    quote:
      "\u201CBought the crewneck during a hard stretch. Wore it through the whole thing. Looking at it now feels like proof I made it through.\u201D",
    name: "Elena V.",
    meta: "A1\u2013B2 Crewneck · Verified",
    mediaNote:
      "Screenshot of @rebirthrings tag. Raw = trustworthy.",
    mediaIcon: "📱",
    mediaLabel: "Instagram",
  },
];

export function SocialProofLight() {
  return (
    <section className="bg-[#e0dbd2] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-12 text-center">
          <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-teal)]">
            Verified Reviews
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px]">
            THE WORK SPEAKS
            <br />
            FOR ITSELF
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LIGHT_TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-3.5 border border-[#e0dbd2] bg-[var(--rebirth-film-cream)] p-6"
            >
              {t.mediaNote && (
                <div className="flex aspect-square items-center justify-center border-2 border-dashed border-[var(--rebirth-amber)] bg-[#ede8df] text-center">
                  <div>
                    <div className="text-4xl">{t.mediaIcon}</div>
                    <p className="mx-auto mt-1 max-w-[220px] px-2 text-[11px] leading-snug text-[#8a8578]">
                      {t.mediaNote}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-sm tracking-[1.5px] text-[var(--rebirth-amber)]">
                ★★★★★
              </div>
              <p className="flex-1 text-[13px] italic leading-[1.7] text-[#444]">
                {t.quote}
              </p>
              <div className="text-[13px] font-bold">{t.name}</div>
              <div className="text-[11px] text-[#8a8578]">{t.meta}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#bfbab2] bg-transparent px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-[var(--rebirth-warm-black)] transition-all hover:border-[var(--rebirth-teal)] hover:text-[var(--rebirth-teal)]"
          >
            SEE ALL REVIEWS
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ——————————————————————————————————
   Dark variant — "REAL PEOPLE. REAL CHAPTERS."
—————————————————————————————————— */

const DARK_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "\u201CWorn it every skate session for 4 months. Not a scratch. The wood still looks perfect. Insane quality for the price.\u201D",
    name: "Jordan F.",
    meta: "Koa Wood · Portland OR",
    mediaNote:
      "Skater showing the ring during/after a session — durability proof",
    mediaIcon: "🛹",
    mediaLabel: "Skater Video",
  },
  {
    quote:
      "\u201CMy old ring looked like everyone else\u2019s. This one starts conversations everywhere I go. Best $149 I\u2019ve ever spent.\u201D",
    name: "Alex T.",
    meta: "Gold Shell · Maple Burl",
    mediaNote:
      "Before/After visual side-by-side. Great for Meta ads.",
    mediaIcon: "🔄",
    mediaLabel: "Before/After",
  },
  {
    quote:
      "\u201CGave one as a wedding gift and my friend messaged me three times to say he\u2019s obsessed. The story behind it makes it even better.\u201D",
    name: "Amanda S.",
    meta: "Gift Purchase · Austin TX",
    mediaNote:
      "Screenshot of a DM from a happy customer. Raw and real = trustworthy.",
    mediaIcon: "💌",
    mediaLabel: "DM Screenshot",
  },
];

export function SocialProofDark() {
  return (
    <section className="bg-[#111] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-12 text-center">
          <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-amber)]">
            More Love
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px] text-[var(--rebirth-film-cream)]">
            REAL PEOPLE.
            <br />
            REAL CHAPTERS.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DARK_TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-3.5 border border-[#2a2a2a] bg-[#1a1a1a] p-6"
            >
              {t.mediaNote && (
                <div className="flex aspect-square items-center justify-center border-2 border-dashed border-[#2a2a2a] bg-[#111] text-center">
                  <div>
                    <div className="text-4xl text-[#444]">{t.mediaIcon}</div>
                    <p className="mx-auto mt-1 max-w-[220px] px-2 text-[11px] leading-snug text-[#555]">
                      {t.mediaNote}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-sm tracking-[1.5px] text-[var(--rebirth-amber)]">
                ★★★★★
              </div>
              <p className="flex-1 text-[13px] italic leading-[1.7] text-[#aaa]">
                {t.quote}
              </p>
              <div className="text-[13px] font-bold text-[var(--rebirth-film-cream)]">
                {t.name}
              </div>
              <div className="text-[11px] text-[#8a8578]">{t.meta}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 bg-transparent px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/[0.08]"
          >
            SEE ALL REVIEWS
          </Link>
        </div>
      </div>
    </section>
  );
}
