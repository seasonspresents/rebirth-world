"use client";

import { motion } from "motion/react";

interface ProductStoryProps {
  story: string;
  productName: string;
}

export function ProductStory({ story, productName }: ProductStoryProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl py-16 text-center"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        The Story
      </p>
      <h2 className="mb-6 text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-[family-name:var(--font-display)]">
        Behind the {productName}
      </h2>
      <p className="leading-relaxed text-muted-foreground">{story}</p>
    </motion.section>
  );
}
