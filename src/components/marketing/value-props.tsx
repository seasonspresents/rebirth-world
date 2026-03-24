"use client";

import { motion } from "motion/react";
import { Hammer, Recycle, Heart, Shield } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SpotlightCard } from "@/components/ui/spotlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const values = [
  {
    icon: Hammer,
    title: "Made by Hand, One at a Time",
    description:
      "Daniel shapes every ring in his North Shore workshop. No factories, no assembly lines — just a craftsman, his tools, and the wood.",
    accent: "var(--rebirth-teal)",
  },
  {
    icon: Recycle,
    title: "Community-Donated Boards",
    description:
      "Local skaters donate their broken decks instead of tossing them. Seven layers of maple get a second life as something you can wear every day.",
    accent: "var(--rebirth-moss)",
  },
  {
    icon: Heart,
    title: "Humanitarian at Heart",
    description:
      "Rebirth started with a simple belief: waste is just potential waiting to be unlocked. Every purchase supports that mission.",
    accent: "var(--rebirth-rose)",
  },
  {
    icon: Shield,
    title: "1-Year Warranty",
    description:
      "Every ring is sealed with CA glue for durability. If something goes wrong within the first year, we'll make it right.",
    accent: "var(--rebirth-amber)",
  },
];

export function ValueProps() {
  return (
    <section data-section-theme="earth" className="section-earth px-6 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px]">
        <TextGenerateEffect
          words="Made different, on purpose"
          className="text-fluid-display text-section-fg"
          duration={0.5}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <SpotlightCard
                className="h-full rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
                spotlightColor={`color-mix(in oklch, ${value.accent}, transparent 85%)`}
              >
                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <value.icon
                    className="size-6"
                    style={{ color: value.accent }}
                  />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold font-[family-name:var(--font-display)]">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
