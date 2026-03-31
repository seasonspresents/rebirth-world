"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight";

interface Differentiator {
  title: string;
  description: string;
}

const DEFAULT_DIFFERENTIATORS: Differentiator[] = [
  {
    title: "Handcrafted, Not Mass-Produced",
    description: "Every ring is shaped by hand on a lathe in Daniel's Mapleton, Utah workshop. No factories, no molds.",
  },
  {
    title: "Recycled Skateboard Wood",
    description: "Seven layers of Canadian maple from broken decks donated by local skaters. Each piece is unique.",
  },
  {
    title: "Austrian Jewelry Heritage",
    description: "Daniel's father trained at Koppenwallner's in Salzburg — court jeweler for Austrian emperors. Six-year old-world apprenticeship.",
  },
  {
    title: "CA Glue Finish, Not Poly",
    description: "Sealed with thin CA glue for a glass-like finish that's water-resistant and durable. Not polyurethane.",
  },
  {
    title: "1-Year Craftsmanship Warranty",
    description: "If something goes wrong within the first year, we'll make it right. Every ring backed by our guarantee.",
  },
  {
    title: "Community-Sourced Materials",
    description: "Boards donated by local skaters instead of being thrown away. Waste becomes wearable art.",
  },
];

interface PDPDifferentiatorsProps {
  heading?: string;
  items?: Differentiator[];
  ctaText?: string;
  ctaHref?: string;
}

export function PDPDifferentiators({
  heading = "What makes Rebirth different",
  items = DEFAULT_DIFFERENTIATORS,
  ctaText = "Shop Now",
  ctaHref = "/shop",
}: PDPDifferentiatorsProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-fluid-heading font-[family-name:var(--font-display)]">
          {heading}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard className="h-full rounded-xl border border-border/50 bg-card p-6">
                <h3 className="text-base font-semibold font-[family-name:var(--font-display)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
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
