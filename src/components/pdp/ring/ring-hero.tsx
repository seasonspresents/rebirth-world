"use client";

import { useState, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/payments/constants";
import { parseVariantMetadata } from "@/components/pdp/shared/variant-selector";
import type { Product } from "@/lib/payments/constants";
import { cn } from "@/lib/utils";

/* ── Metal finish swatches ── */
const METAL_FINISHES = [
  { id: "gold", label: "Gold", gradient: "linear-gradient(135deg, #c9a84c, #f0cc6e)" },
  { id: "steel", label: "Steel", gradient: "linear-gradient(135deg, #888, #ccc)" },
  { id: "black", label: "Black", gradient: "linear-gradient(135deg, #222, #555)" },
];

/* ── Bundle options ── */
const BUNDLE_OPTIONS = [
  { id: "single", name: "Single Ring", desc: "One handmade wedding band", priceMultiplier: 1 },
  { id: "matching", name: "Matching Set", desc: "His + hers — save $40 when bundled", priceMultiplier: 1.73, popular: true },
  { id: "engraving", name: "Ring + Engraving", desc: "Add a personal message inside — $9 add-on", priceAdd: 900 },
];

/* ── Trust badges ── */
const TRUST_BADGES = [
  { icon: "\u{1F504}", title: "30-Day Returns", sub: "No questions asked" },
  { icon: "\u{1F69A}", title: "Free US Shipping", sub: "Orders over $75" },
  { icon: "\u{1F6E1}\uFE0F", title: "1-Year Warranty", sub: "Craftsmanship backed" },
];

/* ── Product pills ── */
const PILLS = [
  { icon: "\u270B", text: "Handmade in Utah" },
  { icon: "\u{1F33F}", text: "Sustainably Sourced Wood" },
  { icon: "\u{1F48E}", text: "Gold-Plated Shell" },
  { icon: "\u{1F6E1}\uFE0F", text: "1-Year Warranty" },
  { icon: "\u{1F30D}", text: "Gives Back" },
];

/* ── Hero accordion data (static, trusted content) ── */
const ACCORDION_ITEMS = [
  {
    title: "Product Details",
    lines: [
      "Materials: Gold-plated stainless steel shell. Stabilized wood liner (Irish Bog Oak, Hawaiian Koa, Maple Burl, or Ebony). CA glue interior finish.",
      "Width: 8mm standard. Liner: 0.8mm — slim profile.",
      "Made in: Mapleton, Utah, USA.",
      "Sizing note: True to US ring sizing. Free resize within 30 days.",
    ],
  },
  {
    title: "How It's Made",
    lines: [
      "I hand-select each wood blank, cut it to a precise 0.8mm liner, and fit it inside the metal shell by hand using CA glue and accelerator. The interior gets a final CA coat for water resistance and durability. I inspect every ring before it leaves the workshop. No two are identical — that's the point.",
    ],
  },
  {
    title: "FAQ",
    lines: [
      "Is it waterproof? CA-finished interior is water-resistant for daily wear — surfing, showering, washing.",
      "Can I engrave it? Yes — add engraving at checkout for $9. Up to 10 characters inside the band.",
      "How long to make? Handmade to order — allow 5-10 business days before shipping.",
    ],
  },
  {
    title: "Shipping & Returns",
    lines: [
      "Free standard shipping on US orders over $75. 30-day hassle-free returns on non-engraved rings. One free resize within 30 days. International shipping available — we've shipped to 25+ countries.",
    ],
  },
];

interface RingHeroProps {
  product: Product;
}

export function RingHero({ product }: RingHeroProps) {
  const { addItem, setCartOpen } = useCart();

  /* ── Derived data from product ── */
  const ringSizes =
    product.metadata.ring_sizes
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const compareAt = product.metadata.compare_at_price
    ? parseInt(product.metadata.compare_at_price, 10)
    : null;
  const isOnSale = compareAt !== null && compareAt > product.price;
  const savings = isOnSale && compareAt ? compareAt - product.price : 0;
  const savingsPercent =
    isOnSale && compareAt ? Math.round((savings / compareAt) * 100) : 0;

  const productTag =
    product.metadata.badge_text ||
    (product.metadata.featured === "true" ? "Best Seller" : null);

  // Detect product type
  const isSkateRing = product.metadata.collection === "skateboard-rings";
  const isWeddingBand = product.metadata.collection === "wedding-bands";

  // Parse variant_* metadata for wood liner options (wedding bands only)
  const productVariants = parseVariantMetadata(
    product.metadata as Record<string, string | undefined>
  );

  // Wood liner options from variant metadata or fallback (wedding bands only)
  const woodOptions = isWeddingBand
    ? (productVariants.find(
        (v) =>
          v.label.toLowerCase().includes("design") ||
          v.label.toLowerCase().includes("wood") ||
          v.label.toLowerCase().includes("liner")
      )?.options ?? ["Irish Bog Oak", "Hawaiian Koa", "Maple Burl", "Ebony"])
    : [];

  // Width options for skateboard rings
  const widthOptions = isSkateRing ? ["5mm (Narrow)", "8mm (Standard)"] : [];

  /* ── State ── */
  const [selectedMetal, setSelectedMetal] = useState("gold");
  const [selectedWood, setSelectedWood] = useState(woodOptions[0] ?? null);
  const [selectedWidth, setSelectedWidth] = useState(widthOptions[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState(isSkateRing ? "single" : "matching");
  const [openAcc, setOpenAcc] = useState(0);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const needsSize = ringSizes.length > 0 && !selectedSize;

  /* ── Bundle price calculation ── */
  const currentBundle = BUNDLE_OPTIONS.find((b) => b.id === selectedBundle)!;
  const bundlePrice = currentBundle.priceAdd
    ? product.price + currentBundle.priceAdd
    : Math.round(product.price * (currentBundle.priceMultiplier ?? 1));

  /* ── Add to cart ── */
  function handleAddToCart() {
    const parts: string[] = [];
    if (isWeddingBand && selectedMetal) parts.push(selectedMetal);
    if (isWeddingBand && selectedWood) parts.push(selectedWood);
    if (isSkateRing && selectedWidth) parts.push(selectedWidth);
    if (selectedSize) parts.push(selectedSize);
    if (!isSkateRing) parts.push(selectedBundle);
    const variant = parts.join("|");

    addItem(product, selectedBundle === "matching" ? 2 : 1, variant);
    setAdded(true);

    const descParts: string[] = [];
    if (isWeddingBand) descParts.push(selectedMetal ?? "Gold");
    if (isWeddingBand && selectedWood) descParts.push(selectedWood);
    if (isSkateRing && selectedWidth) descParts.push(selectedWidth);
    if (selectedSize) descParts.push(`Size ${selectedSize}`);
    toast.success("Added to cart", {
      description: `${product.name}${descParts.length ? ` — ${descParts.join(", ")}` : ""}`,
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1500);
  }

  return (
    <section className="px-6 pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14 items-start">
          {/* ── LEFT: Gallery (sticky on desktop) ── */}
          <div className="md:sticky md:top-20">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              slug={product.slug}
            />
          </div>

          {/* ── RIGHT: Product info ── */}
          <div className="flex flex-col">
            {/* Tag */}
            {productTag && (
              <span className="mb-3 w-fit bg-[var(--amber)]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[2px] text-[var(--amber)]">
                {"\u2605"} {productTag}
              </span>
            )}

            {/* Stars */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className="text-base tracking-wide text-[var(--amber)]">
                {"\u2605\u2605\u2605\u2605\u2605"}
              </span>
              <span className="text-xs text-[var(--gray)]">
                Rated 4.9/5 by 200+ customers
              </span>
            </div>

            {/* Product name — Playfair Display */}
            <h1 className="text-2xl font-bold leading-[1.15] md:text-[clamp(24px,3.5vw,38px)] font-[family-name:var(--font-serif)]">
              {product.name}
              {product.metadata.subtitle && (
                <>
                  {" — "}
                  <em className="italic text-[var(--teal)]">
                    {product.metadata.subtitle}
                  </em>
                </>
              )}
            </h1>

            {/* Prices */}
            <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
              <span className="font-[family-name:var(--font-caps)] text-[38px] leading-none tracking-wide text-[var(--teal)]">
                {formatPrice(product.price, product.currency)}
              </span>
              {isOnSale && compareAt && (
                <span className="text-lg text-[var(--mid-gray)] line-through">
                  {formatPrice(compareAt, product.currency)}
                </span>
              )}
              {isOnSale && savings > 0 && (
                <span className="bg-[var(--amber)] px-2 py-0.5 text-[11px] font-bold text-white">
                  SAVE {formatPrice(savings, product.currency)} ({savingsPercent}%)
                </span>
              )}
            </div>

            {/* Philosophy quote */}
            <p className="mt-4 border-l-[3px] border-[var(--teal)] pl-3.5 text-sm italic text-[var(--teal)] font-[family-name:var(--font-serif)]">
              &ldquo;We are all going through miniature spiritual rebirths — this ring is a reminder to embrace yours.&rdquo;
            </p>

            {/* Description */}
            {product.description && (
              <p className="mt-4 border-b border-[var(--light-gray)] pb-5 text-sm leading-[1.75] text-[#555]">
                {product.description}
              </p>
            )}

            {/* Pills */}
            <div className="mt-5 flex flex-wrap gap-[7px]">
              {PILLS.map((p) => (
                <span
                  key={p.text}
                  className="inline-flex items-center gap-1.5 bg-[var(--black)] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-[var(--warm-white)]"
                >
                  {p.icon} {p.text}
                </span>
              ))}
            </div>

            {/* ── 1. Metal Finish (wedding bands only) ── */}
            {isWeddingBand && (
              <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[2px]">
                  <span>
                    1. Choose Metal Finish{" "}
                    <span className="font-normal text-[var(--gray)] tracking-normal">
                      (3 options)
                    </span>
                  </span>
                </div>
                <div className="flex gap-4 pb-1.5">
                  {METAL_FINISHES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMetal(m.id)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "size-[34px] rounded-full border-[2.5px] transition-colors",
                          selectedMetal === m.id
                            ? "border-[var(--black)]"
                            : "border-transparent"
                        )}
                        style={{ background: m.gradient }}
                      />
                      <span className="text-[10px] text-[var(--gray)] tracking-wide">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── 2. Wood Liner (wedding bands only) ── */}
            {isWeddingBand && woodOptions.length > 0 && (
              <div className="mt-5">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2px]">
                  2. Choose Wood Liner{" "}
                  <span className="font-normal text-[var(--gray)] tracking-normal">
                    ({woodOptions.length} options)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {woodOptions.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWood(w)}
                      className={cn(
                        "h-[42px] min-w-[42px] border-[1.5px] px-3 text-[13px] transition-all cursor-pointer",
                        selectedWood === w
                          ? "border-[var(--black)] bg-[var(--black)] text-[var(--warm-white)]"
                          : "border-[var(--mid-gray)] bg-transparent text-[var(--black)] hover:border-[var(--teal)] hover:text-[var(--teal)]"
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── 1. Choose Width (skateboard rings only) ── */}
            {isSkateRing && widthOptions.length > 0 && (
              <div className="mt-6">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2px]">
                  1. Choose Width
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {widthOptions.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWidth(w)}
                      className={cn(
                        "h-[42px] min-w-[42px] border-[1.5px] px-3 text-[13px] transition-all cursor-pointer",
                        selectedWidth === w
                          ? "border-[var(--black)] bg-[var(--black)] text-[var(--warm-white)]"
                          : "border-[var(--mid-gray)] bg-transparent text-[var(--black)] hover:border-[var(--teal)] hover:text-[var(--teal)]"
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Ring Size ── */}
            {ringSizes.length > 0 && (
              <div className="mt-5">
                <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[2px]">
                  <span>
                    {isSkateRing ? "2" : "3"}. Ring Size{" "}
                    <span className="font-normal text-[var(--gray)] tracking-normal">
                      ({ringSizes[0]}&ndash;{ringSizes[ringSizes.length - 1]})
                    </span>
                  </span>
                  <a
                    href="/size-guide"
                    className="text-[11px] font-normal text-[var(--teal)] underline tracking-normal normal-case"
                  >
                    Size Guide
                  </a>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ringSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        "h-[42px] min-w-[42px] border-[1.5px] px-3 text-[13px] transition-all cursor-pointer",
                        selectedSize === s
                          ? "border-[var(--black)] bg-[var(--black)] text-[var(--warm-white)]"
                          : "border-[var(--mid-gray)] bg-transparent text-[var(--black)] hover:border-[var(--teal)] hover:text-[var(--teal)]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. Bundle Offers (wedding bands only) ── */}
            {isWeddingBand && <div className="mt-5">
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2px]">
                4. Choose Your Package
              </div>
              <div className="flex flex-col gap-2">
                {BUNDLE_OPTIONS.map((b) => {
                  const bPrice = b.priceAdd
                    ? product.price + b.priceAdd
                    : Math.round(product.price * (b.priceMultiplier ?? 1));
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBundle(b.id)}
                      className={cn(
                        "relative flex items-center justify-between border-[1.5px] px-4 py-3.5 text-left transition-all cursor-pointer gap-3",
                        selectedBundle === b.id
                          ? "border-[var(--teal)] bg-[var(--teal)]/[0.04]"
                          : "border-[var(--light-gray)] hover:border-[var(--mid-gray)]"
                      )}
                    >
                      {b.popular && (
                        <span className="absolute -top-2.5 left-3 bg-[var(--teal)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[2px] text-white">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <div className="text-[13px] font-semibold">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-[var(--gray)] mt-0.5">
                          {b.desc}
                        </div>
                      </div>
                      <span className="shrink-0 font-[family-name:var(--font-caps)] text-[22px] text-[var(--teal)]">
                        {formatPrice(bPrice, product.currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>}

            {/* ── Total + CTA ── */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-y border-[var(--light-gray)] py-4">
              <span className="text-xs font-bold uppercase tracking-[2px]">
                Total:
              </span>
              <div className="flex flex-wrap items-baseline gap-2.5">
                {isOnSale && compareAt && (
                  <span className="text-base text-[var(--mid-gray)] line-through">
                    {formatPrice(compareAt, product.currency)}
                  </span>
                )}
                <span className="font-[family-name:var(--font-caps)] text-[30px] leading-none text-[var(--teal)]">
                  {formatPrice(isSkateRing ? product.price : bundlePrice, product.currency)}
                </span>
                {isOnSale && savings > 0 && (
                  <span className="bg-[var(--amber)] px-2 py-0.5 text-[11px] font-bold text-white">
                    SAVE {formatPrice(savings, product.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              disabled={needsSize}
              onClick={handleAddToCart}
              className={cn(
                "mt-4 w-full font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] py-5 transition-all",
                needsSize
                  ? "bg-[var(--mid-gray)] text-white cursor-not-allowed"
                  : "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark,#1e7a6e)] hover:-translate-y-px cursor-pointer"
              )}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="size-5" /> ADDED!
                  </motion.span>
                ) : (
                  <motion.span
                    key="cta"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2"
                  >
                    ADD TO CART &mdash; {formatPrice(bundlePrice, product.currency)}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {needsSize && (
              <p className="mt-2 text-center text-xs text-[var(--gray)]">
                Please select a size
              </p>
            )}

            {/* Trust Badges — 3 col */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 border border-[var(--light-gray)]">
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.title}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3.5 px-2 text-center",
                    "sm:border-r sm:border-[var(--light-gray)] sm:last:border-r-0",
                    "border-b border-[var(--light-gray)] sm:border-b-0 last:border-b-0"
                  )}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[11px] font-semibold">{b.title}</span>
                  <span className="text-[10px] text-[var(--gray)]">{b.sub}</span>
                </div>
              ))}
            </div>

            {/* ── Accordion ── */}
            <div className="mt-5 border-t border-[var(--light-gray)]">
              {ACCORDION_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="border-b border-[var(--light-gray)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenAcc(openAcc === i ? -1 : i)}
                    className="flex w-full items-center justify-between py-4 text-left text-[13px] font-semibold cursor-pointer"
                  >
                    {item.title}
                    <ChevronDown
                      className={cn(
                        "size-[18px] text-[var(--gray)] transition-transform duration-200",
                        openAcc === i && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openAcc === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.25 },
                          opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-[13px] leading-[1.75] text-[var(--gray)] space-y-2">
                          {item.lines.map((line, li) => (
                            <p key={li}>{line}</p>
                          ))}
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
