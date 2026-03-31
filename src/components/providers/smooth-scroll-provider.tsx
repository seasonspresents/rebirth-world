"use client";

import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "@/lib/gsap/register";

function ScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

/**
 * Lenis smooth scroll provider — enabled on homepage and marketing pages,
 * DISABLED on PDP pages to prevent scroll freezing from heavy client components.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Disable smooth scroll on product detail pages and shop pages
  // These have heavy client components (variant selectors, accordions, etc.)
  // that conflict with Lenis's scroll hijacking
  const isProductPage = pathname?.startsWith("/shop/") && pathname !== "/shop";
  const isCartPage = pathname === "/cart";
  const disableSmooth = isProductPage || isCartPage;

  if (disableSmooth) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5,
        syncTouch: false,
        autoRaf: true,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
