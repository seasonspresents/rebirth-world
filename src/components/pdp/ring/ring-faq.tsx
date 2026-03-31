"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const RING_FAQ = [
  { question: "How do I find my ring size?", answer: "Wrap a piece of string around your finger, measure the length in millimeters, and compare with a standard ring size chart. Our wood-lined wedding bands run about one size smaller due to the interior liner. When in doubt, size up." },
  { question: "What's the turnaround time?", answer: "Each ring is handmade to order in our Mapleton, Utah workshop. Typical turnaround is 2-3 weeks. Rush orders may be available — email daniel@rebirth.world to ask." },
  { question: "Can I get custom engraving?", answer: "Yes — every ring includes free laser engraving up to 20 characters. For custom graphics or longer text, email daniel@rebirth.world." },
  { question: "What if my ring doesn't fit?", answer: "We offer free exchanges within 30 days for unworn rings. Engraved pieces are final sale, but we'll work with you on sizing issues." },
  { question: "What materials are used?", answer: "Our skateboard rings use recycled 7-ply Canadian maple. Wedding bands feature gold-plated ARZ stainless steel shells with stabilized exotic wood interiors (Red Amboyna Burl, Spalted Maple Burl, bog oak, Hawaiian koa)." },
  { question: "How do I care for my ring?", answer: "Remove before swimming or showering. Clean with a soft cloth. Store in the included pouch when not wearing. The CA glue finish is water-resistant but prolonged exposure should be avoided." },
];

interface RingFaqProps {
  image?: string;
  ctaHref?: string;
}

export function RingFaq({ image, ctaHref = "/shop" }: RingFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-fluid-heading font-[family-name:var(--font-display)]">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Image */}
          {image && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/30">
              <Image src={image} alt="Rebirth ring craftsmanship detail" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          )}

          {/* FAQ accordion */}
          <div className={image ? "" : "md:col-span-2 mx-auto max-w-[700px] w-full"}>
            {RING_FAQ.map((item, i) => (
              <div key={i} className="border-b border-border/50">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-sm font-semibold pr-4 md:text-base">{item.question}</span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/50">
                    {openIndex === i ? <Minus className="size-3.5 text-primary" /> : <Plus className="size-3.5 text-muted-foreground" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { type: "spring", stiffness: 500, damping: 40 }, opacity: { duration: 0.2 } }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="px-8">
            <Link href={ctaHref}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
