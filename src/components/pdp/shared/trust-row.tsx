"use client";

import { useState } from "react";
import { Shield, Truck, RotateCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  {
    icon: Truck,
    label: "Shipping",
    detail: "Free standard shipping on US orders $100+. Express and international available at checkout. Ships from Mapleton, Utah with tracking.",
  },
  {
    icon: RotateCcw,
    label: "30-Day Returns",
    detail: "Not in love with your ring? Return unworn items within 30 days for a full refund. Engraved pieces are final sale.",
  },
  {
    icon: Shield,
    label: "1-Year Guarantee",
    detail: "Every ring is backed by our 1-year craftsmanship warranty. If something goes wrong, we'll repair or replace it — no questions asked.",
  },
];

export function TrustRow() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-6 border-t border-border/50 pt-4">
      <div className="flex items-center gap-4">
        {TRUST_ITEMS.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={cn(
              "flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground",
              openIndex === i && "text-foreground"
            )}
          >
            <item.icon className="size-3.5" />
            <span>{item.label}</span>
            <ChevronDown
              className={cn(
                "size-3 transition-transform duration-200",
                openIndex === i && "rotate-180"
              )}
            />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
              {TRUST_ITEMS[openIndex].detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
