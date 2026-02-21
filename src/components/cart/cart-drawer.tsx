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
import { cartItemKey } from "@/lib/cart/types";
import { formatPrice } from "@/lib/payments/constants";

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

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
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
                            className="flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                            onClick={() =>
                              updateQuantity(key, item.quantity + 1)
                            }
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            type="button"
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
            <div className="border-t px-6 py-4">
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
