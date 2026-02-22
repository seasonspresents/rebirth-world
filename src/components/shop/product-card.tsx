"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/lib/payments/constants";
import { formatPrice, getCollectionStyle } from "@/lib/payments/constants";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { ProductQuickView } from "@/components/shop/product-quick-view";
import { useTilt } from "@/hooks/use-tilt";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const cardEase: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { ref: tiltRef, tiltHandlers } = useTilt({ maxTilt: 5, glare: 0.12 });

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: cardEase,
        }}
        whileHover={{ y: -4 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative"
        style={getCollectionStyle(product.metadata.collection)}
      >
        <div
          ref={tiltRef}
          {...tiltHandlers}
          className="tilt-glare relative rounded-xl"
        >
        <Link
          href={`/shop/${product.slug}`}
          className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg"
        >
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.images[0] ? (
              <>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ viewTransitionName: `product-${product.slug}` }}
                />
                {/* Hover image swap */}
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt={`${product.name} alternate`}
                    fill
                    className="object-cover transition-opacity duration-500"
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
                className="absolute left-3 top-3 z-10"
              >
                {badgeText}
              </Badge>
            )}

            {/* Quick View overlay button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2 rounded-lg bg-background/90 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
            >
              <Eye className="size-4" />
              Quick View
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-4">
            {product.metadata.collection && (
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.metadata.collection.replace(/-/g, " ")}
              </p>
            )}
            <h3 className="text-sm font-semibold leading-tight font-[family-name:var(--font-display)]">
              {product.name}
            </h3>
            {product.metadata.subtitle && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {product.metadata.subtitle}
              </p>
            )}
            <div className="mt-1.5 flex items-center gap-2">
              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--collection-primary, var(--primary))",
                }}
              >
                {formatPrice(product.price, product.currency)}
              </p>
              {isOnSale && compareAt && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(compareAt, product.currency)}
                </p>
              )}
            </div>
          </div>
        </Link>
        </div>

        {/* BorderBeam for featured */}
        {isFeatured && (
          <BorderBeam
            colorFrom="#2a9d8f"
            colorTo="#e07a3a"
            duration={8}
            size={80}
          />
        )}
      </motion.div>

      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
