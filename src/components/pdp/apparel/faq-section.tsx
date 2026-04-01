"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const FAQS = [
  {
    q: "Does each collection really sell out forever?",
    a: "Yes. Each Rebirth collection is a one-of-a-kind seasonal drop tied to a specific theme and moment. When it\u2019s gone, it doesn\u2019t come back. This is intentional \u2014 not scarcity marketing. The design, the story, and the message belong to that chapter. A new collection will carry a new one.",
  },
  {
    q: "How does the crewneck fit?",
    a: "The AS Colour Relax Crew has a relaxed fit with a drop shoulder construction. It\u2019s designed to feel easy, not boxy. Runs true to size \u2014 if you want a more fitted look, size down. View the size guide linked on the product page for exact measurements.",
  },
  {
    q: "What makes the fabric eco-conscious?",
    a: "The crewneck is 80% cotton / 20% recycled polyester. That recycled polyester content saves approximately 7 \u00d7 500ml plastic bottles from landfill per garment. It\u2019s not a greenwash claim \u2014 it\u2019s a specific, measurable impact built into the fabric choice.",
  },
  {
    q: "Who designs the graphics?",
    a: "I collaborate with local, talented artists on every collection. The designs are thoughtfully developed through real creative relationships \u2014 not outsourced to generic design services. Each collab is credited and celebrated.",
  },
  {
    q: "What was the Tejidos de Santiagitos collection?",
    a: "This was a non-profit collaboration I organized with a small group of Mayan women who live by Lake Atitl\u00e1n in San Lucas Tolim\u00e1n, Guatemala \u2014 during my service mission there. Together we made handwoven shoulder bags, table runners, huipiles, and other textiles. All proceeds went directly back to the women and their community. It was one of the most meaningful things I\u2019ve ever been part of.",
  },
  {
    q: "How do I care for the garments?",
    a: "Machine wash cold, inside out. Tumble dry low or lay flat to dry. Do not bleach. Iron on low if needed \u2014 avoid the graphic directly. The garments are pre-washed to minimize shrinkage, but cold wash will keep them looking best longest.",
  },
  {
    q: "Can I return if it doesn\u2019t fit?",
    a: "Yes \u2014 30-day returns on unworn items with original tags attached. Exchanges available for size within the same collection while stock lasts. Final sale on last-of-season clearance pieces.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section style={{ backgroundColor: "#ede5d8", padding: "80px 0" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-10 md:gap-16 items-start">
          {/* Left: Sticky image */}
          <div
            className="hidden md:block md:sticky md:top-[100px] relative overflow-hidden"
            style={{ aspectRatio: "3/4" }}
          >
            <Image src="/images/apparel/5fe5e7a2-b53b-42b9-9c07-635af0572e15.webp" alt="Rebirth apparel crewneck in a lifestyle setting" fill className="object-cover" sizes="40vw" />
          </div>

          {/* Right: FAQ list */}
          <div>
            <h2
              className="font-[family-name:var(--font-caps)] leading-[1.05] mb-8"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: 2,
              }}
            >
              FREQUENTLY
              <br />
              ASKED QUESTIONS
            </h2>

            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                style={{ borderBottom: "1px solid #e6ddd0" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex justify-between items-center py-[18px] cursor-pointer text-left gap-4"
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1c1a17",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                  <span
                    className="text-[22px] flex-shrink-0 transition-transform"
                    style={{
                      color: "#9a9186",
                      transform:
                        openIndex === i ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="pb-[18px] text-[13px] leading-[1.75]"
                        style={{ color: "#9a9186" }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="mt-7">
              <Link
                href="#"
                className="block w-full text-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 transition-all hover:-translate-y-px"
                style={{ backgroundColor: "#c4603a", color: "#fff" }}
              >
                SHOP CURRENT DROP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
