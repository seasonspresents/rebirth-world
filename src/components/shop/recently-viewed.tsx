"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { formatPrice, type Product } from "@/lib/payments/constants";
import { resolveProductImage } from "@/lib/product-images";

const STORAGE_KEY = "rebirth-recently-viewed";
const MAX_STORED_ITEMS = 8;
const MAX_VISIBLE_ITEMS = 4;

interface RecentlyViewedItem {
  stripeProductId: string;
  stripePriceId: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  currency: string;
  collection: string | null;
  viewedAt: string;
}

interface RecentlyViewedProductsProps {
  product: Product;
  availableSlugs: string[];
}

function productToRecentlyViewed(product: Product): RecentlyViewedItem {
  return {
    stripeProductId: product.id,
    stripePriceId: product.priceId,
    name: product.name,
    slug: product.slug,
    image: resolveProductImage(product.images[0]),
    price: product.price,
    currency: product.currency,
    collection: product.metadata.collection ?? null,
    viewedAt: new Date().toISOString(),
  };
}

function isValidItem(
  item: Partial<RecentlyViewedItem>
): item is RecentlyViewedItem {
  return Boolean(
    item &&
      typeof item.stripeProductId === "string" &&
      typeof item.stripePriceId === "string" &&
      typeof item.name === "string" &&
      typeof item.slug === "string" &&
      typeof item.price === "number" &&
      Number.isFinite(item.price) &&
      typeof item.currency === "string"
  );
}

function readRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<RecentlyViewedItem>[];
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

function writeRecentlyViewed(items: RecentlyViewedItem[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_STORED_ITEMS))
    );
  } catch {
    // Storage quota or browser privacy settings should fail silently.
  }
}

export function RecentlyViewedProducts({
  product,
  availableSlugs,
}: RecentlyViewedProductsProps) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const availableSlugSet = useMemo(
    () => new Set(availableSlugs),
    [availableSlugs]
  );

  useEffect(() => {
    const stored = readRecentlyViewed().filter((item) =>
      availableSlugSet.has(item.slug)
    );
    const visibleItems = stored
      .filter((item) => item.slug !== product.slug)
      .slice(0, MAX_VISIBLE_ITEMS);

    const nextItems = [
      productToRecentlyViewed(product),
      ...stored.filter((item) => item.slug !== product.slug),
    ];
    writeRecentlyViewed(nextItems);

    const frame = window.requestAnimationFrame(() => {
      setItems(visibleItems);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [availableSlugSet, product]);

  if (dismissed || items.length === 0) return null;

  return (
    <aside
      aria-label="Recently viewed products"
      className="border-border bg-background/95 text-foreground fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-[980px] rounded-lg border p-3 shadow-[0_16px_48px_rgba(28,25,23,0.18)] backdrop-blur-md md:bottom-5 md:p-4"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="label-luxury text-muted-foreground">Recently viewed</p>
        <button
          type="button"
          aria-label="Dismiss recently viewed products"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            key={item.stripePriceId}
            href={`/shop/${item.slug}`}
            className="group hover:border-border hover:bg-muted/40 focus-visible:ring-ring flex min-w-[220px] items-center gap-3 rounded-md border border-transparent p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="bg-muted relative h-16 w-12 shrink-0 overflow-hidden rounded">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="bg-muted h-full w-full" />
              )}
            </div>
            <div className="min-w-0">
              {item.collection && (
                <p className="text-muted-foreground truncate text-[10px] tracking-wider uppercase">
                  {item.collection.replace(/-/g, " ")}
                </p>
              )}
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-muted-foreground font-[family-name:var(--font-dm-mono)] text-xs">
                {formatPrice(item.price, item.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
