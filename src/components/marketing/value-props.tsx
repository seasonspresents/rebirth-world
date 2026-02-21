"use client";

import { motion } from "motion/react";
import { Hammer, Recycle, Heart, Shield } from "lucide-react";

const values = [
  {
    icon: Hammer,
    title: "Made by Hand, One at a Time",
    description:
      "Daniel shapes every ring in his North Shore workshop. No factories, no assembly lines — just a craftsman, his tools, and the wood.",
  },
  {
    icon: Recycle,
    title: "Community-Donated Boards",
    description:
      "Local skaters donate their broken decks instead of tossing them. Seven layers of maple get a second life as something you can wear every day.",
  },
  {
    icon: Heart,
    title: "Humanitarian at Heart",
    description:
      "Rebirth started with a simple belief: waste is just potential waiting to be unlocked. Every purchase supports that mission.",
  },
  {
    icon: Shield,
    title: "1-Year Warranty",
    description:
      "Every ring is sealed with CA glue for durability. If something goes wrong within the first year, we'll make it right.",
  },
];

export function ValueProps() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          className="mx-auto mb-14 max-w-[480px] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Why Rebirth
          </p>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] leading-[1.15] tracking-tight font-[family-name:var(--font-display)]">
            Made different, on purpose
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="rounded-xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <value.icon className="mb-4 size-6 text-primary" />
              <h3 className="mb-2 text-base font-semibold">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
