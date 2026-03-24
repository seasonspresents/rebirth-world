"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { formatPrice } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  const ringSizes = product.metadata.ring_sizes
    ?.split(",")
    .map((s) => s.trim());
  const compareAt = product.metadata.compare_at_price
    ? parseInt(product.metadata.compare_at_price, 10)
    : null;
  const isOnSale = compareAt !== null && compareAt > product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden text-foreground">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Quick view of {product.name}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6">
            {product.metadata.collection && (
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.metadata.collection.replace(/-/g, " ")}
              </p>
            )}
            <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">
              {product.name}
            </h2>
            {product.metadata.subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {product.metadata.subtitle}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <p className="text-lg font-semibold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
              {isOnSale && compareAt && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(compareAt, product.currency)}
                </p>
              )}
            </div>

            {product.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="mt-auto pt-4">
              <AddToCartButton
                product={product}
                availableSizes={ringSizes}
                engravingAvailable={
                  product.metadata.engraving_available === "true"
                }
                compact
              />
            </div>

            <Button
              variant="link"
              className="mt-3 h-auto p-0 text-sm"
              asChild
              onClick={() => onOpenChange(false)}
            >
              <Link href={`/shop/${product.slug}`}>View full details →</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
