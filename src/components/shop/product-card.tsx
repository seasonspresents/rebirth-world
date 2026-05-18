"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/lib/payments/constants";
import { formatPrice, getCollectionStyle } from "@/lib/payments/constants";
import type { ReviewSummary } from "@/lib/review-types";
import { resolveProductImage } from "@/lib/product-images";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight";
import { ProductQuickView } from "@/components/shop/product-quick-view";

interface ProductCardProps {
  product: Product;
  index?: number;
  reviewSummary?: ReviewSummary;
}

/* Luxury easing — smooth, expensive-feeling motion */
const luxuryEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ProductCard({
  product,
  index = 0,
  reviewSummary,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const isFeatured = product.metadata.featured === "true";
  const compareAt = product.metadata.compare_at_price
    ? parseInt(product.metadata.compare_at_price, 10)
    : null;
  const isOnSale = compareAt !== null && compareAt > product.price;
  const badgeText =
    product.metadata.badge_text ||
    (isOnSale ? "Sale" : isFeatured ? "Featured" : null);
  const primaryImage = resolveProductImage(product.images[0]);
  const alternateImage = resolveProductImage(product.images[1]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.8,
          delay: index * 0.1,
          ease: luxuryEase,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative"
        style={getCollectionStyle(product.metadata.collection)}
      >
        <SpotlightCard
          className="rounded-none"
          spotlightColor={
            isFeatured ? "rgba(204, 126, 58, 0.1)" : "rgba(45, 138, 126, 0.08)"
          }
        >
          <Link
            href={`/shop/${product.slug}`}
            className="group border-border bg-card text-card-foreground block overflow-hidden rounded-xl border transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Image — 3:4 portrait aspect ratio */}
            <div className="aspect-product bg-muted/30 relative overflow-hidden">
              {primaryImage ? (
                <>
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ viewTransitionName: `product-${product.slug}` }}
                  />
                  {/* Hover image crossfade */}
                  {alternateImage && (
                    <Image
                      src={alternateImage}
                      alt={`${product.name} alternate`}
                      fill
                      className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ opacity: hovered ? 1 : 0 }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </>
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  No image
                </div>
              )}

              {/* Badge */}
              {badgeText && (
                <Badge
                  variant={isOnSale ? "destructive" : "secondary"}
                  className="absolute top-3 left-3 z-10 rounded-none text-[10px] tracking-wider"
                >
                  {badgeText}
                </Badge>
              )}

              {/* Quick View */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
                transition={{ duration: 0.4, ease: luxuryEase }}
                className="bg-background/90 text-foreground hover:bg-background absolute inset-x-4 bottom-4 z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setQuickViewOpen(true);
                }}
              >
                <Eye className="size-4" />
                Quick View
              </motion.button>
            </div>

            {/* Product info — editorial */}
            <div className="mt-4 space-y-1 p-4">
              {product.metadata.collection && (
                <p className="label-luxury text-muted-foreground">
                  {product.metadata.collection.replace(/-/g, " ")}
                </p>
              )}
              <h3 className="font-[family-name:var(--font-display)] text-sm font-medium tracking-wide">
                {product.name}
              </h3>
              {product.metadata.subtitle && (
                <p className="text-muted-foreground line-clamp-1 text-xs">
                  {product.metadata.subtitle}
                </p>
              )}
              {reviewSummary && reviewSummary.reviewCount > 0 && (
                <div className="text-muted-foreground flex min-h-5 items-center gap-1.5 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>{reviewSummary.averageRating.toFixed(1)}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {reviewSummary.reviewCount}{" "}
                    {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground font-[family-name:var(--font-dm-mono)] text-sm">
                  {formatPrice(product.price, product.currency)}
                </p>
                {isOnSale && compareAt && (
                  <p className="text-muted-foreground/60 font-[family-name:var(--font-dm-mono)] text-xs line-through">
                    {formatPrice(compareAt, product.currency)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </SpotlightCard>
      </motion.div>

      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
