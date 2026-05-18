import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, CircleHelp, Ruler } from "lucide-react";
import { PrintSizeGuideButton } from "@/components/size-guide/print-size-guide-button";

export const metadata: Metadata = {
  title: "Ring Size Guide",
  description:
    "Find your Rebirth ring size with measurement instructions, a US size chart, and fit notes for wood-lined wedding bands.",
  alternates: {
    canonical: "/size-guide",
  },
};

const ringSizes = [
  { size: "5", diameter: "15.7", circumference: "49.3" },
  { size: "5.5", diameter: "16.1", circumference: "50.6" },
  { size: "6", diameter: "16.5", circumference: "51.9" },
  { size: "6.5", diameter: "16.9", circumference: "53.1" },
  { size: "7", diameter: "17.3", circumference: "54.4" },
  { size: "7.5", diameter: "17.7", circumference: "55.7" },
  { size: "8", diameter: "18.1", circumference: "57.0" },
  { size: "8.5", diameter: "18.5", circumference: "58.3" },
  { size: "9", diameter: "18.9", circumference: "59.5" },
  { size: "9.5", diameter: "19.4", circumference: "60.8" },
  { size: "10", diameter: "19.8", circumference: "62.1" },
  { size: "10.5", diameter: "20.2", circumference: "63.4" },
  { size: "11", diameter: "20.6", circumference: "64.6" },
  { size: "11.5", diameter: "21.0", circumference: "65.9" },
  { size: "12", diameter: "21.4", circumference: "67.2" },
  { size: "12.5", diameter: "21.8", circumference: "68.5" },
  { size: "13", diameter: "22.2", circumference: "69.7" },
];

const measurementSteps = [
  "Measure at the end of the day, when hands are warm and relaxed.",
  "Wrap a thin strip of paper or string around the base of the finger.",
  "Mark the exact overlap point, then measure that length in millimeters.",
  "Match the measurement to the circumference column. If you are between sizes, size up.",
];

const fitNotes = [
  "Wood-lined wedding bands should slide over the knuckle with gentle resistance and sit without pinching.",
  "Wide 8mm bands can feel slightly tighter than narrow rings, especially on larger knuckles.",
  "Cold hands measure smaller. Heat, travel, salt, and training can make fingers temporarily swell.",
  "Rebirth offers one free resize within 30 days on eligible non-engraved rings.",
];

export default function SizeGuidePage() {
  return (
    <main className="bg-[var(--rebirth-film-cream)] text-[var(--rebirth-warm-black)] print:bg-white">
      <section className="relative overflow-hidden bg-[var(--rebirth-warm-black)] text-white print:bg-white print:text-black">
        <div className="absolute inset-0 print:hidden">
          <Image
            src="/images/wedding-bands/spalted-maple-burl/hand-lifestyle-shot-.webp"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--rebirth-warm-black)] via-[var(--rebirth-warm-black)]/82 to-[var(--rebirth-warm-black)]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--rebirth-warm-black)]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24 lg:py-28 print:py-8">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[2.6px] text-[#d5a56c] print:text-black">
            Rebirth fit guide
          </p>
          <h1 className="max-w-[12ch] font-[family-name:var(--font-serif)] text-[clamp(42px,7vw,84px)] font-bold italic leading-[1.02] text-[var(--rebirth-film-cream)] print:text-black">
            Find the ring size that actually feels right
          </h1>
          <p className="mt-6 max-w-[620px] text-base leading-[1.75] text-white/75 md:text-lg print:text-black">
            Rebirth rings are handmade, so a confident measurement matters. Use
            this guide before choosing a skateboard ring or wood-lined wedding
            band.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#measure"
              className="inline-flex min-h-12 items-center justify-center bg-[var(--rebirth-teal)] px-7 py-3 font-[family-name:var(--font-caps)] text-base tracking-[2px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e] print:hidden"
            >
              Measure Now
            </Link>
            <PrintSizeGuideButton />
          </div>
        </div>
      </section>

      <section
        id="measure"
        className="mx-auto grid max-w-[1200px] gap-8 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-6 md:py-20 print:block print:px-0 print:py-6"
      >
        <div>
          <div className="inline-flex size-12 items-center justify-center bg-[var(--rebirth-teal)] text-white print:hidden">
            <Ruler className="size-5" />
          </div>
          <h2 className="mt-5 font-[family-name:var(--font-serif)] text-4xl font-bold italic leading-tight md:text-5xl print:mt-0 print:text-2xl">
            Measure once, then confirm twice
          </h2>
          <p className="mt-4 max-w-[48ch] leading-7 text-muted-foreground print:text-black">
            The most reliable at-home method is circumference. Keep the paper
            snug, not tight, and repeat the measurement a few times.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {measurementSteps.map((step, index) => (
            <div
              key={step}
              className="border border-[var(--rebirth-warm-black)]/10 bg-white p-5 shadow-sm print:border-black print:shadow-none"
            >
              <span className="font-[family-name:var(--font-caps)] text-3xl leading-none text-[var(--rebirth-teal)] print:text-black">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm leading-6 text-muted-foreground print:text-black">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-14 md:px-6 md:py-20 print:px-0 print:py-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[2.4px] text-[var(--rebirth-teal)] print:text-black">
                US ring size chart
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-bold italic leading-tight md:text-5xl print:text-2xl">
                Match your measurement
              </h2>
            </div>
            <p className="max-w-[42ch] text-sm leading-6 text-muted-foreground print:text-black">
              Measurements are rounded. If your finger lands between two
              numbers, the better everyday fit is usually the larger size.
            </p>
          </div>

          <div className="mt-8 overflow-hidden border border-[var(--rebirth-warm-black)]/10 print:mt-4 print:border-black">
            <div className="grid grid-cols-3 bg-[var(--rebirth-warm-black)] px-4 py-3 text-[11px] font-bold uppercase tracking-[2px] text-white print:bg-white print:text-black">
              <span>US Size</span>
              <span>Inside Diameter</span>
              <span>Circumference</span>
            </div>
            {ringSizes.map((row) => (
              <div
                key={row.size}
                className="grid grid-cols-3 border-t border-[var(--rebirth-warm-black)]/10 px-4 py-3 text-sm print:border-black"
              >
                <span className="font-semibold">{row.size}</span>
                <span>{row.diameter} mm</span>
                <span>{row.circumference} mm</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-5 py-14 md:grid-cols-2 md:px-6 md:py-20 print:block print:px-0 print:py-6">
        <div className="border border-[var(--rebirth-warm-black)]/10 bg-white p-6 shadow-sm print:border-black print:shadow-none">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-[var(--rebirth-teal)] print:text-black" />
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold italic print:text-xl">
              Wedding band fit notes
            </h2>
          </div>
          <ul className="mt-5 space-y-4">
            {fitNotes.map((note) => (
              <li
                key={note}
                className="border-l-2 border-[var(--rebirth-teal)] pl-4 text-sm leading-6 text-muted-foreground print:border-black print:text-black"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div
          id="apparel-fit"
          className="border border-[var(--rebirth-warm-black)]/10 bg-[var(--rebirth-warm-black)] p-6 text-white shadow-sm print:border-black print:bg-white print:text-black print:shadow-none"
        >
          <div className="flex items-center gap-3">
            <CircleHelp className="size-5 text-[#d5a56c] print:text-black" />
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold italic print:text-xl">
              Apparel fit
            </h2>
          </div>
          <p className="mt-5 text-sm leading-7 text-white/72 print:text-black">
            Rebirth apparel uses relaxed unisex sizing. Choose your usual size
            for an easy fit, size down for a cleaner silhouette, or size up for
            an oversized layer.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
            {["XS-S", "M-L", "XL-2XL"].map((size) => (
              <div
                key={size}
                className="border border-white/20 px-3 py-4 print:border-black"
              >
                <span className="font-[family-name:var(--font-caps)] text-xl tracking-[1px]">
                  {size}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-6 md:pb-24 print:hidden">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 border-t border-[var(--rebirth-warm-black)]/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Ready to choose a band?</p>
            <p className="text-sm text-muted-foreground">
              Start with wedding bands, then keep this guide open while you pick
              your size.
            </p>
          </div>
          <Link
            href="/shop?collection=wedding-bands"
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--rebirth-warm-black)] px-6 py-3 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-white transition-all hover:-translate-y-0.5"
          >
            Shop Wedding Bands
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
