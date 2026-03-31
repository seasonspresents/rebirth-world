"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/payments/constants";

interface BestsellersProps {
  products: Product[];
}

const TABS = [
  { key: "wedding-bands", label: "Wedding Bands" },
  { key: "skateboard-rings", label: "Skateboard Rings" },
  { key: "apparel", label: "Apparel" },
] as const;

export function Bestsellers({ products }: BestsellersProps) {
  const [activeTab, setActiveTab] = useState<string>("wedding-bands");

  const filtered = products.filter(
    (p) => p.metadata.collection === activeTab
  );

  // If no products match the tab, show all products as fallback
  const displayProducts = filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);

  return (
    <section className="bg-[var(--rebirth-film-cream)] py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3.5px] text-[var(--rebirth-teal)]">
            Bestselling Products
          </span>
          <h2 className="font-[family-name:var(--font-caps)] text-[clamp(30px,4.5vw,58px)] leading-[1.05] tracking-[2px]">
            SHOP THE COLLECTION
          </h2>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex justify-center overflow-x-auto border-b border-[#e0dbd2] md:justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-6 py-3 font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[1.5px] transition-all ${
                activeTab === tab.key
                  ? "border-[var(--rebirth-teal)] text-[var(--rebirth-teal)]"
                  : "border-transparent text-[#8a8578] hover:text-[var(--rebirth-teal)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-5 min-[400px]:grid-cols-2 lg:grid-cols-4"
        >
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
