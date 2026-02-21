"use client";

import { useState, useRef } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/payments/constants";

interface AddToCartButtonProps {
  product: Product;
  availableSizes?: string[];
  engravingAvailable?: boolean;
  compact?: boolean;
}

export function AddToCartButton({
  product,
  availableSizes,
  engravingAvailable = false,
  compact = false,
}: AddToCartButtonProps) {
  const { addItem, setCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [engravingText, setEngravingText] = useState("");
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const hasSizes = availableSizes && availableSizes.length > 0;
  const needsSize = hasSizes && !selectedSize;

  function handleAdd() {
    // Build variant string from size + engraving
    let variant = selectedSize ?? null;
    if (engravingText.trim()) {
      variant = variant
        ? `${variant}|${engravingText.trim()}`
        : engravingText.trim();
    }

    addItem(product, 1, variant);
    setAdded(true);

    toast.success("Added to cart", {
      description: `${product.name}${selectedSize ? ` — Size ${selectedSize}` : ""}${engravingText ? ` — "${engravingText}"` : ""}`,
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1500);
  }

  return (
    <div className={cn(compact ? "mt-4" : "mt-8")}>
      {/* Size selector */}
      {hasSizes && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-h-[44px] min-w-[44px] rounded-md border px-3 py-1.5 text-sm transition-colors",
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Engraving input */}
      {engravingAvailable && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold">
            Add Engraving{" "}
            <span className="font-normal text-muted-foreground">
              (optional, max 10 characters)
            </span>
          </p>
          <Input
            type="text"
            maxLength={10}
            placeholder="e.g. Forever"
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
            className="max-w-[240px]"
          />
          {engravingText && (
            <p className="mt-1 text-xs text-muted-foreground">
              {engravingText.length}/10 characters
            </p>
          )}
        </div>
      )}

      {/* Add to cart button */}
      <Button
        size="lg"
        className={cn(
          "transition-colors duration-300",
          compact ? "w-full" : "w-full sm:w-auto",
          added && "bg-green-600 hover:bg-green-600"
        )}
        disabled={needsSize}
        onClick={handleAdd}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Check className="size-4" />
              Added!
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="size-4" />
              Add to Cart
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {needsSize && (
        <p className="mt-2 text-xs text-muted-foreground">
          Please select a size
        </p>
      )}
    </div>
  );
}
