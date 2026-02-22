"use client";

import { motion } from "motion/react";
import { Hammer, Recycle, Heart, Shield } from "lucide-react";
import { TextReveal } from "@/components/ui/text-reveal";
import { AnimatedIcon } from "@/components/ui/animated-icon";

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
    <section className="section-earth px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <TextReveal as="h2" className="text-fluid-display" type="words">
          Made different, on purpose
        </TextReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="border-t border-border pt-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <AnimatedIcon className="mb-4">
                <value.icon className="size-8" style={{ color: "var(--section-accent, var(--primary))" }} />
              </AnimatedIcon>
              <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
