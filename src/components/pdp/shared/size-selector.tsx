"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  madeToOrderSizes?: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  sizeGuideSlot?: React.ReactNode;
}

export function SizeSelector({
  sizes,
  madeToOrderSizes = [],
  selectedSize,
  onSelect,
  sizeGuideSlot,
}: SizeSelectorProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Choose Size</p>
        {sizeGuideSlot}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isMTO = madeToOrderSizes.includes(size);
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={cn(
                "relative min-h-[44px] min-w-[44px] rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="sizeIndicator"
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center">
                {size}
                {isMTO && (
                  <span className="text-[9px] opacity-70 leading-none mt-0.5">
                    Made to Order
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
