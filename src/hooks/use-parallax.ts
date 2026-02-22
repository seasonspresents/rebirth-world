"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/register";

interface UseParallaxOptions {
  /** How much to move relative to scroll (negative = slower, positive = faster) */
  speed?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** ScrollTrigger end position */
  end?: string;
}

/**
 * GSAP ScrollTrigger parallax hook.
 * Moves the element at a different rate than the scroll.
 *
 * speed: -0.2 = moves 20% slower (lag), 0.3 = moves 30% faster (lead)
 * Respects prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {}
) {
  const ref = useRef<T>(null);

  const { speed = -0.2, start = "top bottom", end = "bottom top" } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(el, {
        y: () => speed * 200,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: 0.5,
        },
      });
    },
    { scope: ref, dependencies: [] }
  );

  return ref;
}
