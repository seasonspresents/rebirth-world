"use client";

import { useState, useRef } from "react";
import { Star, Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { SizeSelector } from "@/components/pdp/shared/size-selector";
import { EngravingInput } from "@/components/pdp/shared/engraving-input";
import { BundleSelector } from "@/components/pdp/shared/bundle-selector";
import { TrustRow } from "@/components/pdp/shared/trust-row";
import { VariantSelector, parseVariantMetadata } from "@/components/pdp/shared/variant-selector";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";

interface RingHeroProps {
  product: Product;
}

export function RingHero({ product }: RingHeroProps) {
  const { addItem, setCartOpen } = useCart();

  const ringSizes = product.metadata.ring_sizes?.split(",").map((s) => s.trim()) ?? [];
  const madeToOrderSizes = product.metadata.mto_sizes?.split(",").map((s) => s.trim()) ?? [];
  const allSizes = [...ringSizes, ...madeToOrderSizes];

  const compareAt = product.metadata.compare_at_price
    ? parseInt(product.metadata.compare_at_price, 10)
    : null;
  const isOnSale = compareAt !== null && compareAt > product.price;
  const savings = isOnSale && compareAt ? compareAt - product.price : 0;
  const savingsPercent = isOnSale && compareAt ? Math.round((savings / compareAt) * 100) : 0;

  const productTag = product.metadata.badge_text
    || (product.metadata.featured === "true" ? "Best Seller" : null);

  // Parse all variant_* metadata fields
  const productVariants = parseVariantMetadata(product.metadata as Record<string, string | undefined>);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [engravingText, setEngravingText] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<string | null>("ring-only");
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const needsSize = allSizes.length > 0 && !selectedSize;

  // Bundle options (configurable via metadata)
  const bundleOptions = [
    { id: "ring-only", label: "Ring Only", description: product.name, price: product.price },
    ...(product.metadata.engraving_available === "true"
      ? [{ id: "ring-engraving", label: "Ring + Custom Engraving", description: "Free laser engraving up to 20 characters", price: product.price, popular: true }]
      : []),
    ...(product.metadata.care_kit_price
      ? [{ id: "ring-care", label: "Ring + Care Kit", description: "Includes polishing cloth and storage pouch", price: product.price + parseInt(product.metadata.care_kit_price, 10) }]
      : []),
  ];

  function handleAddToCart() {
    // Build variant string: Size | Design | Style | Engraving
    const parts: string[] = [];
    if (selectedSize) parts.push(selectedSize);
    for (const [label, val] of Object.entries(selectedVariants)) {
      if (val) parts.push(val);
    }
    if (engravingText.trim()) parts.push(engravingText.trim());
    const variant = parts.length > 0 ? parts.join("|") : null;

    addItem(product, 1, variant);
    setAdded(true);

    const descParts = [];
    if (selectedSize) descParts.push(`Size ${selectedSize}`);
    for (const [label, val] of Object.entries(selectedVariants)) {
      if (val) descParts.push(val);
    }
    if (engravingText) descParts.push(`"${engravingText}"`);
    toast.success("Added to cart", {
      description: `${product.name}${descParts.length ? ` — ${descParts.join(" · ")}` : ""}`,
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1500);
  }

  return (
    <section className="bg-grain px-6 pt-6 pb-12 md:pt-10 md:pb-16">
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12 lg:gap-16">

          {/* LEFT: Product Image Gallery */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            slug={product.slug}
          />

          {/* RIGHT: Product Info — sticky on desktop */}
          <div className="flex flex-col md:sticky md:top-20 md:self-start">

            {/* Product tag */}
            {productTag && (
              <span className="mb-3 w-fit rounded-sm bg-[var(--rebirth-amber)]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--rebirth-amber)] font-[family-name:var(--font-dm-mono)]">
                {productTag}
              </span>
            )}

            {/* Star rating */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-[var(--rebirth-amber)] text-[var(--rebirth-amber)]" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-[family-name:var(--font-dm-mono)]">
                Rated 4.9/5 by 150+ customers
              </span>
            </div>

            {/* Product headline: Benefit hook — Product Name */}
            <h1 className="text-2xl leading-[1.1] tracking-tight md:text-3xl lg:text-4xl font-[family-name:var(--font-display)]">
              {product.metadata.subtitle && (
                <span className="text-primary">{product.metadata.subtitle}</span>
              )}
              {product.metadata.subtitle && " — "}
              {product.name}
            </h1>

            {/* Price with savings */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              {isOnSale && compareAt && (
                <p className="text-lg text-muted-foreground line-through font-[family-name:var(--font-dm-mono)]">
                  {formatPrice(compareAt, product.currency)}
                </p>
              )}
              <p className="text-2xl font-semibold font-[family-name:var(--font-dm-mono)]">
                {formatPrice(product.price, product.currency)}
              </p>
              {isOnSale && savings > 0 && (
                <span className="rounded-sm bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  You Save {formatPrice(savings, product.currency)} ({savingsPercent}%)
                </span>
              )}
            </div>

            {/* Product description — hook → specs → emotional close */}
            {product.description && (
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Unique benefits row */}
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                "Handmade to order",
                "Free custom engraving",
                "1-year warranty",
                "Eco-friendly materials",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-2.5 text-primary" />
                  </div>
                  {b}
                </div>
              ))}
            </div>

            {/* Size selector */}
            {allSizes.length > 0 && (
              <div className="mt-6">
                <SizeSelector
                  sizes={allSizes}
                  madeToOrderSizes={madeToOrderSizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                  sizeGuideSlot={
                    <button type="button" className="text-xs text-primary underline underline-offset-2">
                      View Size Guide
                    </button>
                  }
                />
              </div>
            )}

            {/* Other variants (Design, Style, Color, Inner/Outer Core, etc.) */}
            {productVariants.length > 0 && (
              <div className="mt-6 space-y-4">
                {productVariants.map((v) => (
                  <VariantSelector
                    key={v.label}
                    label={v.label}
                    options={v.options}
                    selected={selectedVariants[v.label] ?? null}
                    onSelect={(val) =>
                      setSelectedVariants((prev) => ({ ...prev, [v.label]: val }))
                    }
                  />
                ))}
              </div>
            )}

            {/* Engraving */}
            {product.metadata.engraving_available === "true" && (
              <div className="mt-6">
                <EngravingInput
                  value={engravingText}
                  onChange={setEngravingText}
                  maxLength={20}
                />
              </div>
            )}

            {/* Bundle offers */}
            {bundleOptions.length > 1 && (
              <BundleSelector
                options={bundleOptions}
                selectedId={selectedBundle}
                onSelect={setSelectedBundle}
                currency={product.currency}
              />
            )}

            {/* ADD TO CART */}
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full bg-primary py-4 text-base font-semibold transition-all duration-300 hover:bg-primary/90"
                disabled={needsSize}
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="size-4" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="size-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              {needsSize && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Please select a size
                </p>
              )}
            </div>

            {/* Trust row — expandable shipping/returns/guarantee */}
            <TrustRow />
          </div>
        </div>
      </div>
    </section>
  );
}
