"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Hammer,
  Pen,
  Shield,
  Truck,
  Leaf,
  MapPin,
  Users,
} from "lucide-react";

interface BenefitItem {
  icon: LucideIcon;
  label: string;
}

const RING_BENEFITS: BenefitItem[] = [
  { icon: Hammer, label: "Handmade" },
  { icon: Pen, label: "Free Engraving" },
  { icon: Shield, label: "1-Year Warranty" },
  { icon: Leaf, label: "Eco-Friendly" },
  { icon: Truck, label: "Free Shipping $100+" },
  { icon: MapPin, label: "Made in USA" },
  { icon: Users, label: "1000+ Customers" },
];

const APPAREL_BENEFITS: BenefitItem[] = [
  { icon: Hammer, label: "Limited Drop" },
  { icon: Leaf, label: "Recycled Poly" },
  { icon: Truck, label: "Free Shipping $100+" },
  { icon: MapPin, label: "Made in USA" },
  { icon: Users, label: "Artist Collab" },
  { icon: Shield, label: "Quality Guarantee" },
  { icon: Pen, label: "One-of-a-Kind" },
];

interface BenefitIconsScrollProps {
  type?: "ring" | "apparel";
  benefits?: BenefitItem[];
}

export function BenefitIconsScroll({
  type = "ring",
  benefits,
}: BenefitIconsScrollProps) {
  const items = benefits ?? (type === "ring" ? RING_BENEFITS : APPAREL_BENEFITS);

  return (
    <section className="border-y border-border/50 bg-muted/20 py-6">
      <div className="mx-auto max-w-[1200px] overflow-x-auto scrollbar-hide px-6">
        <div className="flex items-center justify-between gap-8 min-w-max md:min-w-0">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="size-4 text-primary" />
              </div>
              <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground font-[family-name:var(--font-dm-mono)]">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
