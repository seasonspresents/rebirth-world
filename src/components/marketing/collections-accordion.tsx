"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/payments/constants";

interface CollectionData {
  slug: string;
  number: string;
  total: string;
  title: string;
  description: string;
  products: Product[];
}

interface CollectionsAccordionProps {
  collections: CollectionData[];
}

export function CollectionsAccordion({ collections }: CollectionsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      data-section-theme="dark"
      className="section-dark bg-grain py-24 md:py-32 lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-section-accent font-[family-name:var(--font-dm-mono)]">
          Collections
        </p>
        <h2 className="text-fluid-display mb-12 md:mb-16">
          Explore the work
        </h2>

        <div className="divide-y divide-white/10">
          {collections.map((collection, i) => (
            <div key={collection.slug}>
              {/* Accordion header */}
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="group flex w-full items-center justify-between py-6 text-left md:py-8"
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="text-lg font-medium text-section-accent font-[family-name:var(--font-dm-mono)] md:text-xl">
                    {collection.number}/{collection.total}
                  </span>
                  <h3 className="text-xl font-semibold md:text-3xl font-[family-name:var(--font-display)]">
                    {collection.title}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20"
                >
                  <Plus className="size-5 text-section-fg" />
                </motion.div>
              </button>

              {/* Accordion content */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { type: "spring", stiffness: 400, damping: 35 },
                      opacity: { duration: 0.3 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 md:pb-12">
                      {/* Collection description */}
                      <p className="mb-8 max-w-[52ch] text-base leading-relaxed text-section-muted">
                        {collection.description}
                      </p>

                      {/* Product cards — horizontal scroll */}
                      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {collection.products.slice(0, 6).map((product, idx) => (
                          <div key={product.id} className="w-[280px] shrink-0 md:w-[320px]">
                            <ProductCard product={product} index={idx} />
                          </div>
                        ))}
                      </div>

                      {/* View collection CTA */}
                      <div className="mt-6">
                        <Button asChild variant="secondary" className="px-6">
                          <Link href={`/shop?collection=${collection.slug}`}>
                            View Collection &rarr;
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
