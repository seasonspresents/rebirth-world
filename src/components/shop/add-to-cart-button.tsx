"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/payments/constants";

interface AddToCartButtonProps {
  product: Product;
  availableSizes?: string[];
}

export function AddToCartButton({
  product,
  availableSizes,
}: AddToCartButtonProps) {
  const { addItem, setCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const hasSizes = availableSizes && availableSizes.length > 0;
  const needsSize = hasSizes && !selectedSize;

  function handleAdd() {
    addItem(product, 1, selectedSize);
    toast.success("Added to cart", {
      description: `${product.name}${selectedSize ? ` — Size ${selectedSize}` : ""}`,
    });
    setCartOpen(true);
  }

  return (
    <div className="mt-8">
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
                  "rounded-md border px-3 py-1 text-sm transition-colors",
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
      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={needsSize}
        onClick={handleAdd}
      >
        <ShoppingBag className="mr-2 size-4" />
        Add to Cart
      </Button>
      {needsSize && (
        <p className="mt-2 text-xs text-muted-foreground">
          Please select a size
        </p>
      )}
    </div>
  );
}
