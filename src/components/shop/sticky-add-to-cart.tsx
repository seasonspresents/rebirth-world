"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";

interface StickyAddToCartProps {
  product: Product;
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function StickyAddToCart({ product, targetRef }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, setCartOpen } = useCart();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    toast.success("Added to cart", { description: product.name });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1500);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 text-foreground px-4 py-3 backdrop-blur-md md:hidden"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-sm font-semibold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
            <Button
              size="lg"
              className="shrink-0"
              onClick={handleAdd}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="size-4" />
                    Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    <ShoppingBag className="size-4" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
