"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "What makes your rings different from other wood rings?",
    a: "A few things no other brand can claim: I\u2019ve been making rings from broken skateboards donated by the local community since I was 14. My father is an Austrian master jeweler trained under the craftsman who made pieces for the emperor. And the philosophy behind every piece — Rebirth, embracing unavoidable change — isn\u2019t a tagline. It\u2019s my actual life.",
  },
  {
    q: "Are the rings durable enough for daily wear?",
    a: "Yes. I use stabilized wood — vacuum-infused with resin for hardness and moisture resistance — and finish the interior with CA glue for a protective seal. Hundreds of customers wear these daily, including surfers and skaters.",
  },
  {
    q: "How long does it take to make my ring?",
    a: "Every ring is handmade to order — allow 5\u201310 business days before it ships. US orders arrive 2\u20134 days after shipping. Need it sooner? DM me on Instagram and I\u2019ll do everything I can.",
  },
  {
    q: "What are the apparel collections? How do drops work?",
    a: "Each apparel collection is a one-of-a-kind seasonal drop tied to a theme I\u2019m currently resonating with — designed in collaboration with local artists. When it\u2019s gone, it doesn\u2019t come back. These aren\u2019t basics. They\u2019re wearable messages for whatever chapter you\u2019re in.",
  },
  {
    q: "Can I get custom engraving?",
    a: "Yes — add laser engraving to any ring at checkout for $9. Up to 10 characters inside the band. Dates, initials, coordinates, a word that means something. Custom/engraved rings are final sale.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship worldwide. I\u2019ve shipped to 25+ countries. International orders take 10\u201315 business days. Rates calculated at checkout.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-[#ede8df] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[5fr_7fr] md:gap-16">
          {/* Left: Media placeholder (hidden on mobile) */}
          <div className="hidden md:block md:sticky md:top-[100px]">
            <div className="flex aspect-[3/4] items-center justify-center border-2 border-dashed border-[var(--rebirth-amber)] bg-[#ede8df] text-center">
              <div>
                <div className="text-4xl">🪵</div>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-wider">
                  Calm, Confident Shot
                </div>
                <p className="mx-auto mt-1 max-w-[260px] px-3 text-[11px] leading-snug text-[#8a8578]">
                  Ring on a book, journal, or beside a coffee. &quot;Considering&quot;
                  energy. This section is about reassurance — the image should
                  feel unhurried and trustworthy.
                </p>
              </div>
            </div>
          </div>

          {/* Right: FAQ accordion */}
          <div>
            <h2 className="mb-8 font-[family-name:var(--font-caps)] text-[clamp(28px,4vw,44px)] leading-[1.05] tracking-[2px]">
              FREQUENTLY
              <br />
              ASKED QUESTIONS
            </h2>

            <div>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border-b border-[#e0dbd2]">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === i ? -1 : i)
                    }
                    className="flex w-full items-center justify-between gap-4 py-4 text-left font-[family-name:var(--font-body)] text-sm font-medium text-[var(--rebirth-warm-black)]"
                  >
                    {item.q}
                    <span
                      className={`flex-shrink-0 text-xl text-[#8a8578] transition-transform ${
                        openIndex === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === i ? "auto" : 0,
                      opacity: openIndex === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-[13px] leading-[1.75] text-[#8a8578]">
                      {item.a}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <Link
                href="/shop"
                className="flex w-full items-center justify-center gap-2 bg-[var(--rebirth-warm-black)] px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-[var(--rebirth-film-cream)] transition-all hover:-translate-y-0.5 hover:bg-[#222]"
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
