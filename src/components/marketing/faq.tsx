"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "What are the rings made from?",
    answer:
      "Our skateboard rings are made from recycled 7-ply Canadian maple — the same wood used in pro decks. Local skaters on the North Shore donate their broken boards, and Daniel shapes each ring by hand. Our wedding bands feature gold-plated steel shells lined with stabilized ancient wood like bog oak or Hawaiian koa.",
  },
  {
    question: "How do I find my ring size?",
    answer:
      "Check the sizing guide on each product page for tips on measuring at home with string or paper. You can also visit any local jeweler for a free sizing. Keep in mind our wood-lined wedding bands run about one size smaller due to the interior liner (a size 9 shell with a 0.8mm wood liner wears like a size 7). When in doubt, size up.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5–10 business days within the US. Express shipping (2–5 business days) is available at checkout. International orders typically arrive in 10–15 business days. Every order includes tracking from our North Shore workshop to your door.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return window for unworn items in original packaging. Engraved or custom pieces are final sale. If your ring doesn't fit, reach out through the contact page and we'll work with you to make it right.",
  },
  {
    question: "How do I care for my ring?",
    answer:
      "The interior of each ring is sealed with a thin CA glue finish for durability — not polyurethane. Avoid prolonged water exposure and store in the included pouch when you're not wearing it. A soft cloth is all you need for polishing. With basic care, your ring will last for years.",
  },
  {
    question: "Do you offer engraving?",
    answer:
      "Yes — most rings can be laser engraved with up to 10 characters of text or a small graphic. You can add engraving during checkout for $9. It adds 2–3 business days to production time. Engraved pieces are final sale.",
  },
  {
    question: "Do you make wedding bands?",
    answer:
      "Yes. Our premium wedding bands feature gold-plated steel shells lined with stabilized ancient wood — including bog oak and Hawaiian koa. These start at $75 and go up depending on materials and customization. They're built to be worn every day for a lifetime.",
  },
];

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof faqItems)[0];
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
            {faqItems.map((item, index) => (
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
