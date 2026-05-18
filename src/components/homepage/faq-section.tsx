"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HOMEPAGE_FAQ_ITEMS } from "@/lib/seo";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-[#ede8df] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[5fr_7fr] md:gap-16">
          {/* Left: Sticky image (hidden on mobile) */}
          <div className="hidden md:block md:sticky md:top-[100px]">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/people/daniel-workshop.webp" alt="Daniel Malzl at the drill press making rings in his workshop" fill className="object-cover" sizes="40vw" />
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
              {HOMEPAGE_FAQ_ITEMS.map((item, i) => (
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
