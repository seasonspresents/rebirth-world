"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { Button } from "@/components/ui/button";
import { formatPrice, type Product } from "@/lib/payments/constants";
import type { WishlistItemData } from "@/lib/wishlist/types";

function itemToProduct(item: WishlistItemData): Product {
  return {
    id: item.stripeProductId,
    name: item.name,
    description: null,
    images: item.image ? [item.image] : [],
    metadata: item.collection ? { collection: item.collection } : {},
    marketingFeatures: [],
    slug: item.slug,
    price: item.price,
    priceId: item.stripePriceId,
    currency: item.currency,
    active: true,
  };
}

export function WishlistPageClient() {
  const { items, isLoading, removeItem } = useWishlist();
  const { addItem, setCartOpen } = useCart();

  function handleAddToCart(item: WishlistItemData) {
    addItem(itemToProduct(item));
    toast.success("Added to cart", { description: item.name });
    setCartOpen(true);
  }

  return (
    <div className="min-h-[70vh] px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-luxury text-muted-foreground">Saved Items</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold md:text-5xl">
              Wishlist
            </h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted/40 h-[420px] animate-pulse rounded-lg border"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed px-6 text-center">
            <Heart className="text-muted-foreground mb-4 size-8" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              No saved items yet
            </h2>
            <p className="text-muted-foreground mt-2 max-w-[36ch] text-sm leading-relaxed">
              Save rings, apparel, and accessories while you browse. They will
              be waiting here when you are ready.
            </p>
            <Button asChild className="mt-6">
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.stripePriceId}
                className="bg-card text-card-foreground overflow-hidden rounded-lg border"
              >
                <Link
                  href={`/shop/${item.slug}`}
                  className="group block"
                  aria-label={`View ${item.name}`}
                >
                  <div className="aspect-product bg-muted relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full items-center justify-center">
                        No image
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-4 p-4">
                  <div>
                    {item.collection && (
                      <p className="label-luxury text-muted-foreground">
                        {item.collection.replace(/-/g, " ")}
                      </p>
                    )}
                    <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-medium">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mt-1 font-[family-name:var(--font-dm-mono)] text-sm">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="flex-1 gap-2"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag className="size-4" />
                      Add to cart
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Remove ${item.name} from wishlist`}
                      onClick={() => removeItem(item.stripePriceId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
