"use client";

import { useRef } from "react";
import { StickyAddToCart } from "@/components/shop/sticky-add-to-cart";
import type { Product } from "@/lib/payments/constants";

interface StickyAddToCartWrapperProps {
  product: Product;
  children: React.ReactNode;
}

export function StickyAddToCartWrapper({
  product,
  children,
}: StickyAddToCartWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref}>{children}</div>
      <StickyAddToCart product={product} targetRef={ref} />
    </>
  );
}
