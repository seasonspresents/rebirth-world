"use client";

import { useState, useRef } from "react";
import { Star, Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";
import { cn } from "@/lib/utils";

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];

interface ApparelHeroProps {
  product: Product;
}

export function ApparelHero({ product }: ApparelHeroProps) {
  const { addItem, setCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const needsSize = !selectedSize;

  function handleAddToCart() {
    addItem(product, 1, selectedSize);
    setAdded(true);
    toast.success("Added to cart", {
      description: `${product.name}${selectedSize ? ` — Size ${selectedSize}` : ""}`,
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1500);
  }

  return (
    <section
      className="px-6 pt-6 pb-12 md:pt-10 md:pb-16"
      style={{ backgroundColor: "var(--apparel-linen)", color: "var(--apparel-charcoal)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12 lg:gap-16">

          {/* LEFT: Product Images */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            slug={product.slug}
          />

          {/* RIGHT: Product Info — sticky */}
          <div className="flex flex-col md:sticky md:top-20 md:self-start">

            {/* Collection label */}
            {product.metadata.collection && (
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] font-[family-name:var(--font-dm-mono)]" style={{ color: "var(--apparel-olive)" }}>
                {product.metadata.subtitle || "Limited Drop"}
              </p>
            )}

            {/* Theme/concept name */}
            {product.metadata.story && (
              <p className="mb-3 text-lg italic font-[family-name:var(--font-editorial)]" style={{ color: "var(--apparel-clay)" }}>
                {product.metadata.story}
              </p>
            )}

            {/* Product name — Cormorant Garamond for apparel */}
            <h1 className="text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-5xl font-[family-name:var(--font-editorial)] font-semibold">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mt-4 text-2xl font-medium font-[family-name:var(--font-dm-mono)]">
              {formatPrice(product.price, product.currency)}
            </p>

            {/* Description */}
            {product.description && (
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed" style={{ color: "var(--apparel-charcoal)", opacity: 0.7 }}>
                {product.description}
              </p>
            )}

            {/* Size selector */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Choose Size</p>
                <button type="button" className="text-xs underline underline-offset-2" style={{ color: "var(--apparel-clay)" }}>
                  View Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {APPAREL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-h-[44px] min-w-[44px] rounded-md border px-4 py-2 text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-[var(--apparel-clay)] text-white"
                        : "border-[var(--apparel-parchment)] hover:border-[var(--apparel-clay)]/50"
                    )}
                    style={selectedSize === size ? { backgroundColor: "var(--apparel-clay)" } : undefined}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ADD TO CART */}
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full py-4 text-base font-semibold"
                style={{ backgroundColor: "var(--apparel-clay)", color: "white" }}
                disabled={needsSize}
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                      <Check className="size-4" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                      <ShoppingBag className="size-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              {needsSize && (
                <p className="mt-2 text-center text-xs" style={{ color: "var(--apparel-charcoal)", opacity: 0.5 }}>
                  Please select a size
                </p>
              )}
            </div>

            {/* Garment details */}
            <details className="mt-6 border-t pt-4" style={{ borderColor: "var(--apparel-parchment)" }}>
              <summary className="cursor-pointer text-sm font-semibold">Garment Details</summary>
              <ul className="mt-3 space-y-1.5 text-sm" style={{ color: "var(--apparel-charcoal)", opacity: 0.7 }}>
                {product.metadata.material && <li>• {product.metadata.material}</li>}
                <li>• Drop shoulder, relaxed fit</li>
                <li>• Tear-out label for comfort</li>
                <li>• Recycled polyester content saves ~7 × 500ml plastic bottles</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
