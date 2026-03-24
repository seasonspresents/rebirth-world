"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/lib/payments/constants";
import { formatPrice, getCollectionStyle } from "@/lib/payments/constants";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight";
import { ProductQuickView } from "@/components/shop/product-quick-view";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/* Luxury easing — smooth, expensive-feeling motion */
const luxuryEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ProductCard({ product, index = 0 }: ProductCardProps) {
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
            isFeatured
              ? "rgba(204, 126, 58, 0.1)"
              : "rgba(45, 138, 126, 0.08)"
          }
        >
          <Link
            href={`/shop/${product.slug}`}
            className="group block overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Image — 3:4 portrait aspect ratio */}
            <div className="relative aspect-product overflow-hidden bg-muted/30">
              {product.images[0] ? (
                <>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ viewTransitionName: `product-${product.slug}` }}
                  />
                  {/* Hover image crossfade */}
                  {product.images[1] && (
                    <Image
                      src={product.images[1]}
                      alt={`${product.name} alternate`}
                      fill
                      className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ opacity: hovered ? 1 : 0 }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}

              {/* Badge */}
              {badgeText && (
                <Badge
                  variant={isOnSale ? "destructive" : "secondary"}
                  className="absolute left-3 top-3 z-10 rounded-none text-[10px] tracking-wider"
                >
                  {badgeText}
                </Badge>
              )}

              {/* Quick View */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
                transition={{ duration: 0.4, ease: luxuryEase }}
                className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-center gap-2 rounded-lg bg-background/90 px-4 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background"
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
              <h3 className="text-sm font-medium tracking-wide font-[family-name:var(--font-display)]">
                {product.name}
              </h3>
              {product.metadata.subtitle && (
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {product.metadata.subtitle}
                </p>
              )}
              <div className="flex items-center gap-2">
                <p className="text-sm font-[family-name:var(--font-dm-mono)] text-muted-foreground">
                  {formatPrice(product.price, product.currency)}
                </p>
                {isOnSale && compareAt && (
                  <p className="text-xs text-muted-foreground/60 line-through font-[family-name:var(--font-dm-mono)]">
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
