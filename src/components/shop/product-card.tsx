"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/lib/payments/constants";
import { formatPrice } from "@/lib/payments/constants";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.metadata.collection && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.metadata.collection}
            </p>
          )}
          <h3 className="text-sm font-semibold leading-tight">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-primary">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
