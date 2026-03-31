"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight";
import { Award, Recycle, Leaf, Pen, Clock, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DiffItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ITEMS: DiffItem[] = [
  { icon: Award, title: "Austrian Master Jeweler Heritage", description: "Third-generation craftsmanship rooted in a six-year old-world apprenticeship at Koppenwallner's in Salzburg." },
  { icon: Recycle, title: "Community-Sourced Materials", description: "Broken skateboards donated by local riders instead of going to landfill. Every deck has a story." },
  { icon: Leaf, title: "Zero-Waste Philosophy", description: "Every scrap of wood is used — nothing goes to waste. Offcuts become pendants, earrings, or art pieces." },
  { icon: Pen, title: "Free Custom Engraving", description: "Up to 20 characters laser-engraved for free on every ring. Make it yours." },
  { icon: Clock, title: "Handmade-to-Order (2–3 Weeks)", description: "No mass production. Each ring is crafted individually after you order, ensuring the highest quality." },
  { icon: Shield, title: "1-Year Craftsmanship Warranty", description: "If anything goes wrong within the first year, we'll repair or replace it — no questions asked." },
];

interface RingDifferentiatorsProps {
  ctaHref?: string;
}

export function RingDifferentiators({ ctaHref = "/shop" }: RingDifferentiatorsProps) {
  return (
    <section data-section-theme="dark" className="section-dark bg-grain py-16 md:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-fluid-heading font-[family-name:var(--font-display)]">
          Why Rebirth is Different
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard className="h-full rounded-xl border border-white/10 bg-white/5 p-6">
                <item.icon className="mb-3 size-5 text-section-accent" />
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-section-muted">{item.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="secondary" className="px-8">
            <Link href={ctaHref}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
