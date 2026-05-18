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
import { WishlistButton } from "@/components/shop/wishlist-button";
import { formatPrice } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";
import { resolveProductImage } from "@/lib/product-images";

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
  const primaryImage = resolveProductImage(product.images[0]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-foreground max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Quick view of {product.name}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-muted relative aspect-square">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6">
            {product.metadata.collection && (
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                {product.metadata.collection.replace(/-/g, " ")}
              </p>
            )}
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              {product.name}
            </h2>
            {product.metadata.subtitle && (
              <p className="text-muted-foreground mt-0.5 text-sm">
                {product.metadata.subtitle}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <p className="text-primary text-lg font-semibold">
                {formatPrice(product.price, product.currency)}
              </p>
              {isOnSale && compareAt && (
                <p className="text-muted-foreground text-sm line-through">
                  {formatPrice(compareAt, product.currency)}
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
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
              <WishlistButton
                product={product}
                showLabel
                className="mt-3 w-full rounded-lg"
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
