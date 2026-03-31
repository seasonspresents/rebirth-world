"use client";

import { motion } from "motion/react";
import { Shirt, Ruler, Droplets, Leaf } from "lucide-react";
import type { Product } from "@/lib/payments/constants";

const DETAILS = [
  {
    icon: Shirt,
    title: "Materials",
    description: "80% cotton / 20% recycled polyester. 9.4 oz mid-weight fleece. AS Colour Relax Crew base.",
  },
  {
    icon: Ruler,
    title: "Fit",
    description: "Drop shoulder, relaxed fit. Tear-out label for comfort. True to size — size up for oversized look.",
  },
  {
    icon: Droplets,
    title: "Care",
    description: "Machine wash cold, gentle cycle. Tumble dry low. Do not bleach or iron the print directly.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Each garment saves ~7 × 500ml plastic bottles through recycled polyester content. Printed locally, not overseas.",
  },
];

interface ProductDetailsGridProps {
  product: Product;
}

export function ProductDetailsGrid({ product }: ProductDetailsGridProps) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--apparel-linen)", color: "var(--apparel-charcoal)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-fluid-heading font-[family-name:var(--font-editorial)] font-semibold">
          Product Details
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DETAILS.map((detail, i) => (
            <motion.div
              key={detail.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: "var(--apparel-parchment)" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <detail.icon className="mb-3 size-5" style={{ color: "var(--apparel-clay)" }} />
              <h3 className="text-sm font-semibold">{detail.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ opacity: 0.7 }}>
                {detail.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
