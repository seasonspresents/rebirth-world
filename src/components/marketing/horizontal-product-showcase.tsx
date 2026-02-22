"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/register";
import type { Product } from "@/lib/payments/constants";
import { ProductCard } from "@/components/shop/product-card";

interface HorizontalProductShowcaseProps {
  products: Product[];
}

/**
 * Horizontal scroll product showcase.
 * Desktop: pins the section and translates product cards horizontally as user scrolls.
 * Mobile: falls back to vertical grid layout.
 */
export function HorizontalProductShowcase({
  products,
}: HorizontalProductShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useGSAP(
    () => {
      if (isMobile) return;

      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      // Calculate how far the track needs to move
      const getScrollDistance = () => {
        return track.scrollWidth - section.offsetWidth;
      };

      const scrollDist = getScrollDistance();
      if (scrollDist <= 0) return;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Individual card opacity/scale effect
      const cards = track.querySelectorAll("[data-product-card]");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.95, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById("horizontal-scroll") || undefined,
              start: "left 80%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  // Mobile: standard vertical grid
  if (isMobile) {
    return (
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    );
  }

  // Desktop: horizontal scroll
  return (
    <div ref={sectionRef} className="relative min-h-screen flex items-center">
      <div
        ref={trackRef}
        className="flex gap-8 pl-6 pr-[30vw]"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            data-product-card
            className="w-[380px] shrink-0"
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
