"use client";

import { motion } from "motion/react";
import type { Product } from "@/lib/payments/constants";

interface CollectionStoryProps {
  product: Product;
}

export function CollectionStory({ product }: CollectionStoryProps) {
  const conceptName = product.metadata.story || "Limited Collection";

  return (
    <section
      className="py-16 md:py-24 lg:py-32"
      style={{ backgroundColor: "var(--apparel-parchment)", color: "var(--apparel-charcoal)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — Editorial story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] font-[family-name:var(--font-dm-mono)]" style={{ color: "var(--apparel-olive)" }}>
              The Story Behind
            </p>
            <h2 className="text-fluid-heading font-[family-name:var(--font-editorial)] font-semibold italic" style={{ color: "var(--apparel-clay)" }}>
              {conceptName}
            </h2>
            <p className="mt-6 max-w-[48ch] leading-relaxed" style={{ opacity: 0.7 }}>
              Each collection is a one-of-a-kind limited seasonal drop tied to a theme
              I&apos;m currently resonating with, designed with local artists, meant to carry
              a wearable message. When it&apos;s gone, it&apos;s gone.
            </p>
            <p className="mt-4 max-w-[48ch] leading-relaxed" style={{ opacity: 0.7 }}>
              The design process starts with a feeling — a record, a place, a conversation.
              I work with a local artist to translate that into something you can wear.
              Every piece is limited to a single production run.
            </p>
          </motion.div>

          {/* Right — Photography placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex aspect-[4/5] items-center justify-center rounded-2xl p-8 text-center text-xs" style={{ backgroundColor: "var(--apparel-linen)", color: "var(--apparel-charcoal)", opacity: 0.5 }}>
              Mood board or design process photography placeholder — record aesthetics, artist collaboration, design sketches
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
