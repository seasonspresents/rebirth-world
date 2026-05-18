"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { cartItemKey } from "@/lib/cart/types";
import { formatPrice } from "@/lib/payments/constants";
import { useState } from "react";
import { ShippingEstimator } from "@/components/cart/shipping-estimator";

export default function CartPage() {
  const {
    items,
    subtotal,
    selectedShippingRate,
    shippingAddress,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const searchParams = useSearchParams();
  const [checkingOut, setCheckingOut] = useState(false);
  const estimatedTotal = subtotal + (selectedShippingRate?.priceCents ?? 0);

  // Show toast when returning from canceled Stripe checkout
  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      toast.info("Checkout canceled", {
        description: "Your cart items are still saved.",
      });
      // Clean URL without reload
      window.history.replaceState({}, "", "/cart");
    }
  }, [searchParams]);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            stripePriceId: i.stripePriceId,
            quantity: i.quantity,
            variant: i.variant ?? null,
            name: i.name,
            price: i.price,
            collection: i.collection ?? null,
          })),
          shippingRate: selectedShippingRate,
          shippingAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Checkout failed");
        setCheckingOut(false);
        return;
      }

      // Redirect to Stripe
      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[800px] text-center">
          <ShoppingBag className="text-muted-foreground mx-auto mb-4 size-12" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            Nothing here yet
          </h1>
          <p className="text-muted-foreground mt-2">
            Every ring starts as a broken skateboard. Find the piece that
            carries your story.
          </p>
          <Button asChild className="mt-6">
            <Link href="/shop">Browse the collection</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] tracking-tight">
          Your Cart
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* Item list */}
          <div>
            <div className="divide-border divide-y">
              {items.map((item) => {
                const key = cartItemKey(item);
                return (
                  <div
                    key={key}
                    className="flex gap-4 py-6 first:pt-0 last:pb-0"
                  >
                    {/* Thumbnail */}
                    <div className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-lg sm:size-28">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-sm font-medium hover:underline sm:text-base"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {item.variant.includes("|")
                            ? `Size ${item.variant.split("|")[0]} · Engraving: "${item.variant.split("|")[1]}"`
                            : `Size ${item.variant}`}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-semibold">
                        {formatPrice(item.price, item.currency)}
                      </p>

                      {/* Quantity controls */}
                      <div className="mt-auto flex items-center gap-3 pt-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="border-border hover:bg-muted flex size-8 items-center justify-center rounded-md border transition-colors"
                            onClick={() =>
                              updateQuantity(key, item.quantity - 1)
                            }
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.name}`}
                            className="border-border hover:bg-muted flex size-8 items-center justify-center rounded-md border transition-colors"
                            onClick={() =>
                              updateQuantity(key, item.quantity + 1)
                            }
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-muted-foreground hover:text-destructive ml-auto text-sm transition-colors"
                          onClick={() => removeItem(key)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="text-muted-foreground mt-6 text-sm underline-offset-4 hover:underline"
              onClick={clearCart}
            >
              Clear cart
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24">
            <div className="border-border bg-card text-card-foreground rounded-xl border p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-right font-medium">
                    {selectedShippingRate
                      ? selectedShippingRate.priceCents === 0
                        ? "FREE"
                        : formatPrice(selectedShippingRate.priceCents)
                      : "Select a rate"}
                  </span>
                </div>
                <div className="border-border mt-1 border-t pt-3">
                  <ShippingEstimator />
                </div>
              </div>

              <div className="border-border mt-4 border-t pt-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Estimated total</span>
                  <span>{formatPrice(estimatedTotal)}</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut
                  ? "Redirecting..."
                  : selectedShippingRate
                    ? `Checkout with ${selectedShippingRate.service}`
                    : "Checkout with fallback shipping"}
              </Button>

              <p className="text-muted-foreground mt-3 text-center text-xs">
                {selectedShippingRate
                  ? "Selected shipping is saved. Taxes and final address are verified at checkout."
                  : "No rate selected. Checkout will use fallback shipping options."}
              </p>

              {/* Trust messaging */}
              <div className="border-border mt-5 space-y-2 border-t pt-4">
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className="text-primary">&#10003;</span> Handmade in the
                  North Shore workshop
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className="text-primary">&#10003;</span> 1-year warranty
                  on every piece
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className="text-primary">&#10003;</span> 30-day returns,
                  no questions asked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
