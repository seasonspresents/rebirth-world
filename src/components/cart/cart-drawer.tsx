"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { cartItemKey, type CartItemData } from "@/lib/cart/types";
import { formatPrice } from "@/lib/payments/constants";
import { useLenisPause } from "@/hooks/use-lenis-pause";

const FREE_SHIPPING_THRESHOLD = 7500;

const UPSELLS = {
  accessories: {
    eyebrow: "Complete the kit",
    title: "Add a small Rebirth object",
    body: "Patches, tools, and everyday pieces that travel well with a ring.",
    href: "/shop?collection=accessories",
    image: "/images/products/rebirth-carabiners/main.webp",
    cta: "Shop Accessories",
  },
  apparel: {
    eyebrow: "Wear the message",
    title: "Layer in a Rebirth drop",
    body: "Small-batch apparel for the chapter you are carrying right now.",
    href: "/shop?collection=apparel",
    image: "/images/products/everything-you-need-is-already-here-hoodie/main.webp",
    cta: "Shop Apparel",
  },
  rings: {
    eyebrow: "One more story",
    title: "Find a ring with a different chapter",
    body: "Recycled skateboard rings and wood-lined bands shaped one at a time.",
    href: "/shop?collection=skateboard-rings",
    image: "/images/rebirth-2026/rebirth-1-3.webp",
    cta: "Shop Rings",
  },
} as const;

function getComplementaryUpsell(items: CartItemData[]) {
  const collections = new Set(items.map((item) => item.collection));

  if (collections.has("apparel")) return UPSELLS.rings;
  if (collections.has("accessories")) return UPSELLS.rings;
  if (collections.has("skateboard-rings") || collections.has("wedding-bands")) {
    return UPSELLS.accessories;
  }

  return UPSELLS.apparel;
}

function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium">
          {remaining > 0
            ? `${formatPrice(remaining)} away from free US shipping`
            : "Free US shipping unlocked"}
        </span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-[var(--rebirth-teal)] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ComplementaryUpsell({
  items,
  onNavigate,
}: {
  items: CartItemData[];
  onNavigate: () => void;
}) {
  const upsell = getComplementaryUpsell(items);

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={upsell.image}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[1.6px] text-[var(--rebirth-teal)]">
            {upsell.eyebrow}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight">
            {upsell.title}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {upsell.body}
          </p>
          <Link
            href={upsell.href}
            onClick={onNavigate}
            className="mt-2 inline-flex text-xs font-semibold text-[var(--rebirth-teal)] underline-offset-4 hover:underline"
          >
            {upsell.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
  } = useCart();

  useLenisPause(isCartOpen);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col sm:max-w-md"
      >
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
          <SheetDescription className="sr-only">
            Items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" asChild onClick={() => setCartOpen(false)}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable item list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <motion.ul
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {items.map((item) => {
                  const key = cartItemKey(item);
                  return (
                    <motion.li
                      key={key}
                      className="flex gap-4"
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Thumbnail */}
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-medium leading-tight">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.variant.includes("|")
                              ? `Size ${item.variant.split("|")[0]} · "${item.variant.split("|")[1]}"`
                              : `Size ${item.variant}`}
                          </p>
                        )}
                        <p className="mt-1 text-sm font-semibold">
                          {formatPrice(item.price, item.currency)}
                        </p>

                        {/* Quantity stepper + remove */}
                        <div className="mt-auto flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                            onClick={() =>
                              updateQuantity(key, item.quantity - 1)
                            }
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.name}`}
                            className="flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                            onClick={() =>
                              updateQuantity(key, item.quantity + 1)
                            }
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name} from cart`}
                            className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive"
                            onClick={() => removeItem(key)}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>

            {/* Footer */}
            <div className="space-y-4 border-t px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4">
              <FreeShippingProgress subtotal={subtotal} />
              <ComplementaryUpsell
                items={items}
                onNavigate={() => setCartOpen(false)}
              />
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-base font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild onClick={() => setCartOpen(false)}>
                  <Link href="/cart">View Cart & Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  onClick={() => setCartOpen(false)}
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
