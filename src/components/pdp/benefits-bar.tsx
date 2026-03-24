"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Hammer,
  Recycle,
  Shield,
  Truck,
  Heart,
  Sparkles,
  Leaf,
} from "lucide-react";

interface BenefitItem {
  icon: LucideIcon;
  label: string;
}

const DEFAULT_BENEFITS: BenefitItem[] = [
  { icon: Hammer, label: "Handmade" },
  { icon: Recycle, label: "Recycled Materials" },
  { icon: Shield, label: "1-Year Warranty" },
  { icon: Truck, label: "Free Shipping $75+" },
  { icon: Heart, label: "Made with Aloha" },
  { icon: Sparkles, label: "One of a Kind" },
  { icon: Leaf, label: "Eco-Friendly" },
];

interface PDPBenefitsBarProps {
  benefits?: BenefitItem[];
}

export function PDPBenefitsBar({ benefits = DEFAULT_BENEFITS }: PDPBenefitsBarProps) {
  return (
    <section className="border-y border-border/50 bg-muted/20 py-8">
      <div className="mx-auto max-w-[1200px] overflow-x-auto scrollbar-hide px-6">
        <div className="flex items-center justify-between gap-8 min-w-max md:min-w-0">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.label}
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <benefit.icon className="size-4 text-primary" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                {benefit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
