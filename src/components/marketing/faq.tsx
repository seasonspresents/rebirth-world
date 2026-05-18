"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CONTACT_FAQ_ITEMS } from "@/lib/seo";

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof CONTACT_FAQ_ITEMS)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-b border-border/50"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-base font-semibold md:text-lg pr-4">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50"
        >
          {isOpen ? (
            <Minus className="size-4 text-primary" />
          ) : (
            <Plus className="size-4 text-muted-foreground" />
          )}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
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
            <p className="max-w-[62ch] pb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      data-section-theme="earth"
      className="section-earth bg-grain px-6 py-24 md:py-32 lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          {/* Left column — header */}
          <div className="md:sticky md:top-24 md:self-start">
            <TextGenerateEffect
              words="Everything you need to know"
              className="text-fluid-display text-section-fg"
              duration={0.4}
            />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Questions about sizing, materials, shipping, or care — we&apos;ve
              got you covered.
            </p>
          </div>

          {/* Right column — Framer Motion spring accordion */}
          <div>
            {CONTACT_FAQ_ITEMS.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
