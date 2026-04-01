import Image from "next/image";
import Link from "next/link";

interface Testimonial {
  quote: string;
  name: string;
  meta: string;
  mediaNote?: string;
  mediaImage?: string;
}

/* ——————————————————————————————————
   Light variant — "THE WORK SPEAKS FOR ITSELF"
—————————————————————————————————— */

const LIGHT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "\u201CEverything looks incredible, I\u2019m so stoked. My mom FaceTimed me as she opened it and it looks better than I could have ever imagined. Thank you for turning my dreams into reality.\u201D",
    name: "Verified Buyer",
    meta: "Custom Ring · DM",
    mediaNote:
      "Customer DM screenshot showing genuine reaction",
    mediaImage: "/images/people/malzl002722-r1-066-31a.webp",
  },
  {
    quote:
      "\u201CUs looking at my engagement ring made by Daniel \u2014 it has one of my first favorite skateboards inside! Shoutout + thank you @rebirthrings\u201D",
    name: "Jared",
    meta: "Engagement Ring · @mormonjared",
    mediaNote:
      "Customer showing engagement ring with skateboard inside",
    mediaImage: "/images/people/dame-in-rebirth.webp",
  },
  {
    quote:
      "\u201CI\u2019ve been addicted to using this journal. I am obsessed.\u201D",
    name: "Lexx H.",
    meta: "Rebirth Journal · @lexxhidalgo",
    mediaNote:
      "Customer photo with Rebirth journal",
    mediaImage: "/images/testimonials/img_0651.webp",
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
              {t.mediaImage && (
                <div className="relative aspect-square overflow-hidden">
                  <Image src={t.mediaImage} alt={`${t.name} with Rebirth product`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
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
      "\u201CIn love with this new ring that @rebirthrings made for me. Hit up my boy if you want one!\u201D",
    name: "Jackson J.",
    meta: "Wedding Band",
    mediaNote:
      "Customer Instagram post with Rebirth ring",
    mediaImage: "/images/people/000041.webp",
  },
  {
    quote:
      "\u201CShe makes these really sick rings out of old skateboard decks & he engraved a few for me & some of the other members... how stinking cool\u201D",
    name: "Sierra F.",
    meta: "Engraved Ring · @sierra.fernald",
    mediaNote:
      "Customer photo of engraved skateboard ring",
    mediaImage: "/images/people/men-wedding-ring.webp",
  },
  {
    quote:
      "\u201CThank you guys so much!!! They are PERFECT\u201D",
    name: "Emma",
    meta: "Verified Buyer",
    mediaNote:
      "Customer DM showing genuine excitement",
    mediaImage: "/images/testimonials/img_0648.webp",
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
              {t.mediaImage && (
                <div className="relative aspect-square overflow-hidden">
                  <Image src={t.mediaImage} alt={`${t.name} with Rebirth product`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
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
