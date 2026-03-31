"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const FAQ_ITEMS = [
  { q: "Is the wood really durable for daily wear?", a: "Yes. We use stabilized wood — vacuum-infused with resin, making it significantly harder and more moisture-resistant than raw wood. The interior is also finished with thin CA glue, creating a protective seal. Hundreds of customers wear these daily — including surfers and skaters." },
  { q: "How do I know my ring size?", a: "We have a free printable ring sizer guide. If you're between sizes, size up. We also offer a free first-time resize within 30 days of purchase." },
  { q: "Can I get custom engraving?", a: "Yes — add laser engraving at checkout for $9. Up to 10 characters (text), or submit a graphic URL. Coordinates, dates, initials, a meaningful word. Custom/engraved rings are final sale." },
  { q: "How long will my order take?", a: "Each ring is handmade to order — allow 5\u201310 business days before it ships. US orders arrive in 2\u20134 days after shipping. Need it faster? DM Daniel on Instagram — he'll do everything he can." },
  { q: "What if it doesn't fit or I'm not happy?", a: "30-day hassle-free returns on non-engraved rings. One free resize available within 30 days. We want you to love it — if you don't, we make it right." },
  { q: "Do you ship internationally?", a: "Yes — we ship worldwide. International orders typically take 10\u201315 business days. We've shipped to 25+ countries." },
  { q: "How is each clothing collection different?", a: "Every clothing drop is a one-of-a-kind limited season collection tied to a specific Rebirth theme. When the collection sells out, it doesn't come back. The design, the message, and the story belong to that moment. It's wearable intention — not basics." },
];

interface RingFaqProps {
  image?: string;
  ctaHref?: string;
}

export function RingFaq({ image, ctaHref = "/shop" }: RingFaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[var(--warm-white)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
          {/* Left: Sticky image (hidden on mobile) */}
          <div className="hidden md:block md:sticky md:top-[100px]">
            {image ? (
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={image} alt="Ring detail shot" fill className="object-cover" sizes="40vw" />
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center bg-[var(--cream)] text-sm text-[var(--gray)]">
                Trust image placeholder
              </div>
            )}
          </div>

          {/* Right: FAQ */}
          <div>
            <h2 className="mb-8 font-[family-name:var(--font-caps)] text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[1.5px] text-[var(--black)]">
              FREQUENTLY<br />ASKED QUESTIONS
            </h2>

            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-[var(--light-gray)]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-[18px] text-left text-sm font-medium leading-[1.4] text-[var(--black)] cursor-pointer"
                >
                  {item.q}
                  <span className="shrink-0 text-[22px] text-[var(--gray)] transition-transform duration-200"
                    style={{ transform: openIndex === i ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.25 }, opacity: { duration: 0.2 } }}
                      className="overflow-hidden"
                    >
                      <p className="pb-[18px] text-[13px] leading-[1.75] text-[var(--gray)]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="mt-7">
              <Link
                href={ctaHref}
                className="inline-flex w-full items-center justify-center gap-2.5 bg-[var(--black)] px-10 py-[18px] font-[family-name:var(--font-caps)] text-lg tracking-[2.5px] text-[var(--warm-white)] transition-all hover:bg-[var(--off-black,#222)] hover:-translate-y-px"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
