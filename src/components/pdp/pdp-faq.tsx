"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_FAQ = [
  {
    question: "What are the rings made from?",
    answer: "Recycled 7-ply Canadian maple from broken skateboards donated by local North Shore skaters. Each ring is hand-shaped by Daniel in his workshop.",
  },
  {
    question: "How do I find my ring size?",
    answer: "Wrap string around your finger, measure in mm, and compare to a standard chart. Our wood-lined bands run ~1 size smaller. When in doubt, size up.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard: 5-10 business days (US). Express: 2-5 days. International: 10-15 days. Every order includes tracking.",
  },
  {
    question: "What is your return policy?",
    answer: "30-day returns on unworn items in original packaging. Engraved pieces are final sale. We'll work with you on sizing issues.",
  },
];

interface PDPFaqProps {
  items?: { question: string; answer: string }[];
  image?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function PDPFaq({
  items = DEFAULT_FAQ,
  image,
  ctaText = "Shop Now",
  ctaHref = "/shop",
}: PDPFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-fluid-heading font-[family-name:var(--font-display)]">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Image (optional) */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/30">
                <Image
                  src={image}
                  alt="Product FAQ"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          )}

          {/* FAQ accordion */}
          <div className={image ? "" : "md:col-span-2 mx-auto max-w-[700px] w-full"}>
            {items.map((item, i) => (
              <div key={i} className="border-b border-border/50">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-base font-semibold pr-4">{item.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/50"
                  >
                    {openIndex === i ? (
                      <Minus className="size-3.5 text-primary" />
                    ) : (
                      <Plus className="size-3.5 text-muted-foreground" />
                    )}
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { type: "spring", stiffness: 500, damping: 40 },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="px-8">
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
