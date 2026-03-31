"use client";

import { useState, useRef } from "react";
import { Star, Check, ShoppingBag, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";
import { cn } from "@/lib/utils";

/* ── colour map for swatches ─────────────────────────── */
const COLOR_MAP: Record<string, string> = {
  Charcoal: "#2e2a24",
  Sand: "#c4b49a",
  Olive: "#5c6644",
};

/* ── accordion data ──────────────────────────────────── */
const ACCORDION_ITEMS = [
  {
    title: "Fabric Details",
    content:
      "AS Colour Relax Crew\nWeight: 9.4 oz mid-weight fleece \u00b7 Construction: 80% cotton, 20% recycled polyester CVC \u00b7 Cotton facing on fleece \u00b7 Relaxed fit, drop shoulder, crew neck \u00b7 Sleeve cuff ribbing \u00b7 Tear-out label for a clean finish\n\nWhy this fabric: Locally produced, quality and comfortable. The recycled poly content saves approximately 7 \u00d7 500ml plastic bottles from landfill per garment \u2014 without sacrificing the feel.",
  },
  {
    title: "The Collection Story",
    content:
      "This collection is born from insights I\u2019ve received from real people and real life experiences over the years. I named each piece A1\u2013B2 like tracks on a vinyl record \u2014 because these messages deserve to be played, felt, carried. The overarching message: in order to step into your next chapter, you must bless the places that are breaking and embrace what is blooming within you. Embrace the Rebirth.",
  },
  {
    title: "Sizing & Fit",
    content:
      "Relaxed fit with drop shoulder construction \u2014 runs true to size or slightly oversized depending on your preference. Unisex sizing. If you want a more fitted look, size down. View the size guide for chest and body measurements. All pieces are pre-washed to minimize shrinkage.",
  },
  {
    title: "Shipping & Returns",
    content:
      "Free standard shipping on US orders over $75. 30-day returns on unworn items with tags attached. Exchanges available for size. Final sale on last-of-season pieces. We ship worldwide \u2014 rates at checkout.",
  },
];

interface ApparelHeroProps {
  product: Product;
}

export function ApparelHero({ product }: ApparelHeroProps) {
  const { addItem, setCartOpen } = useCart();

  const APPAREL_SIZES =
    product.metadata.ring_sizes
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? ["XS", "S", "M", "L", "XL", "2XL"];

  const colors = Object.keys(COLOR_MAP);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const priceStr = formatPrice(product.price, product.currency);

  function handleAddToCart() {
    const parts: string[] = [];
    if (selectedColor) parts.push(selectedColor);
    if (selectedSize) parts.push(selectedSize);
    const variant = parts.length > 0 ? parts.join("|") : undefined;

    addItem(product, 1, variant);
    setAdded(true);
    const desc = parts.length > 0 ? ` \u2014 ${parts.join(" \u00b7 ")}` : "";
    toast.success("Added to cart", {
      description: `${product.name}${desc}`,
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1500);
  }

  return (
    <section
      className="px-4 pt-8 pb-12 md:px-6 md:pt-12 md:pb-16"
      style={{ backgroundColor: "#f2ece0", color: "#1c1a17" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-[60px] items-start">
          {/* ── LEFT: Gallery (sticky) ───────────────── */}
          <div className="md:sticky md:top-20">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              slug={product.slug}
            />
          </div>

          {/* ── RIGHT: Product Info ───────────────────── */}
          <div>
            {/* Current Drop tag */}
            <div className="mb-4">
              <span
                className="inline-block text-[9px] font-bold tracking-[2px] uppercase px-[10px] py-1"
                style={{ backgroundColor: "#c4603a", color: "#fff" }}
              >
                Current Drop
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-3.5 flex-wrap">
              <span style={{ color: "#c4603a", fontSize: 16, letterSpacing: 1 }}>
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </span>
              <span className="text-xs" style={{ color: "#9a9186" }}>
                Rated 4.9/5 &middot; Limited stock remaining
              </span>
            </div>

            {/* Product name */}
            <h1
              className="font-[family-name:var(--font-editorial)] font-bold leading-[1.1] mb-1.5"
              style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
            >
              {product.name}
            </h1>

            {/* Subtitle */}
            <p
              className="font-[family-name:var(--font-editorial)] text-base italic mb-4"
              style={{ color: "#9a9186" }}
            >
              {product.metadata.subtitle ||
                'Spring 2026 Drop \u2014 "A1\u2013B2: Bless What Is Breaking"'}
            </p>

            {/* Price */}
            <div className="flex items-baseline flex-wrap gap-2.5 mb-1.5">
              <span
                className="font-[family-name:var(--font-caps)] leading-none"
                style={{ fontSize: 40, letterSpacing: 1, color: "#c4603a" }}
              >
                {priceStr}
              </span>
              {product.metadata.compare_at_price && (
                <>
                  <span className="text-lg line-through" style={{ color: "#c4bdb4" }}>
                    {formatPrice(
                      parseInt(product.metadata.compare_at_price, 10),
                      product.currency
                    )}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-[3px]"
                    style={{ backgroundColor: "#c4603a", color: "#fff" }}
                  >
                    Save{" "}
                    {formatPrice(
                      parseInt(product.metadata.compare_at_price, 10) - product.price,
                      product.currency
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Philosophy quote */}
            <p
              className="font-[family-name:var(--font-editorial)] text-[17px] italic leading-[1.5] py-3.5 pl-4 mb-[18px]"
              style={{ color: "#c4603a", borderLeft: "3px solid #c4603a" }}
            >
              &ldquo;In order to obtain that next chapter in life, you must bless the
              places in you that are breaking &mdash; and embrace the rebirth of what
              is blooming within you.&rdquo;
            </p>

            {/* Description */}
            <p
              className="text-sm leading-[1.8] mb-5 pb-5"
              style={{
                color: "#555",
                borderBottom: "1px solid #e6ddd0",
              }}
            >
              {product.description ||
                "This collection is born from insights I\u2019ve received over the years from real people and real life experiences \u2014 brought to life on a 90s inspired house record. A1\u2013B2 are deep messages and insights that have been guiding me into my current projects. Each message is meant to be worn. Not just read."}
            </p>

            {/* Product pills */}
            <div className="flex flex-wrap gap-[7px] mb-6">
              {[
                { label: "80% Cotton 20% Recycled Poly", olive: true },
                { label: "Collab with Local Artists", olive: false },
                { label: "Saves ~7 Plastic Bottles", olive: false },
                { label: "Tear-Out Label", olive: false },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-[5px] text-[10px] font-semibold tracking-[0.5px] px-3 py-1.5"
                  style={{
                    backgroundColor: pill.olive ? "#5c6644" : "#1c1a17",
                    color: pill.olive ? "#fff" : "#f2ece0",
                  }}
                >
                  {pill.label}
                </span>
              ))}
            </div>

            {/* 1. Choose Color */}
            <div className="mb-[22px]">
              <div className="text-[11px] font-bold tracking-[2px] uppercase mb-2.5">
                1. Choose Color
              </div>
              <div className="flex gap-3.5 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div
                      className="w-9 h-9 rounded-full transition-all"
                      style={{
                        backgroundColor: COLOR_MAP[color],
                        border:
                          selectedColor === color
                            ? "2.5px solid #1c1a17"
                            : "2.5px solid transparent",
                      }}
                    />
                    <span className="text-[10px]" style={{ color: "#9a9186" }}>
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Choose Size */}
            <div className="mb-[22px]">
              <div className="text-[11px] font-bold tracking-[2px] uppercase flex justify-between items-center mb-2.5">
                <span>2. Choose Size</span>
                <a
                  href="#"
                  className="text-[11px] font-normal tracking-normal underline"
                  style={{ color: "#c4603a" }}
                >
                  Size Guide
                </a>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {APPAREL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-[42px] min-w-[42px] px-3.5 text-[13px] font-[family-name:var(--font-body)] cursor-pointer transition-all",
                      selectedSize === size
                        ? "text-[#f2ece0]"
                        : "text-[#1c1a17] hover:border-[#c4603a] hover:text-[#c4603a]"
                    )}
                    style={{
                      border: `1.5px solid ${selectedSize === size ? "#1c1a17" : "#c4bdb4"}`,
                      backgroundColor: selectedSize === size ? "#1c1a17" : "transparent",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Eco callout bar */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 mb-[18px]"
              style={{ backgroundColor: "#5c6644" }}
            >
              <span className="text-[22px] flex-shrink-0">&#9851;</span>
              <div className="text-xs leading-[1.5]" style={{ color: "rgba(255,255,255,0.9)" }}>
                <strong className="block text-white mb-px">
                  AS Colour Relax Crew &mdash; 9.4 oz Mid-Weight Fleece
                </strong>
                80% cotton, 20% recycled polyester &middot; Each garment saves approx.
                7 &times; 500ml plastic bottles from landfill
              </div>
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center py-4 mb-4 flex-wrap gap-2"
              style={{
                borderTop: "1px solid #e6ddd0",
                borderBottom: "1px solid #e6ddd0",
              }}
            >
              <span className="text-xs font-bold tracking-[2px] uppercase">Total:</span>
              <span
                className="font-[family-name:var(--font-caps)] leading-none"
                style={{ fontSize: 30, color: "#c4603a", letterSpacing: 1 }}
              >
                {priceStr}
              </span>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full font-[family-name:var(--font-caps)] text-[20px] tracking-[2.5px] py-5 px-12 cursor-pointer transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#c4603a", color: "#fff", border: "2px solid transparent" }}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check className="size-5" /> ADDED!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center gap-2"
                  >
                    ADD TO CART &mdash; {priceStr}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {!selectedSize && (
              <p className="mt-2 text-center text-xs" style={{ color: "#9a9186" }}>
                Please select a size
              </p>
            )}

            {/* Trust badges */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 mt-4"
              style={{ border: "1px solid #e6ddd0" }}
            >
              {[
                { icon: "🔄", title: "30-Day Returns", sub: "Unworn, tags on" },
                { icon: "🚚", title: "Free US Shipping", sub: "Orders over $75" },
                { icon: "🎨", title: "Artist Collab", sub: "Limited edition" },
              ].map((b, i) => (
                <div
                  key={b.title}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 p-3.5 text-center sm:text-left"
                  style={{
                    borderRight: i < 2 ? "1px solid #e6ddd0" : "none",
                    borderBottom: "1px solid #e6ddd0",
                  }}
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <div className="text-[11px] font-semibold">{b.title}</div>
                    <div className="text-[10px]" style={{ color: "#9a9186" }}>
                      {b.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="mt-5" style={{ borderTop: "1px solid #e6ddd0" }}>
              {ACCORDION_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  style={{ borderBottom: "1px solid #e6ddd0" }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(openAccordion === i ? -1 : i)
                    }
                    className="w-full flex justify-between items-center py-[15px] cursor-pointer text-left gap-3"
                    style={{ background: "none", border: "none" }}
                  >
                    <span className="text-[13px] font-semibold font-[family-name:var(--font-body)]">
                      {item.title}
                    </span>
                    <ChevronDown
                      className="size-[18px] flex-shrink-0 transition-transform"
                      style={{
                        color: "#9a9186",
                        transform:
                          openAccordion === i ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openAccordion === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="pb-4 text-[13px] leading-[1.75] whitespace-pre-line"
                          style={{ color: "#9a9186" }}
                        >
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
