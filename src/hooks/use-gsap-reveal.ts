"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

interface UseGsapRevealOptions {
  from?: gsap.TweenVars;
  scrollTrigger?: Partial<ScrollTrigger.Vars>;
  stagger?: number;
}

/**
 * Reusable GSAP ScrollTrigger reveal hook.
 * Returns a ref to attach to the container element.
 *
 * - If `stagger` is set, animates direct children with stagger delay.
 * - Respects `prefers-reduced-motion` — skips animation entirely.
 * - Auto-cleans up via `useGSAP` context.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseGsapRevealOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    from = { opacity: 0, y: 40 },
    scrollTrigger = {},
    stagger,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Respect reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Make elements visible immediately without animation
        const targets = stagger != null ? el.children : el;
        gsap.set(targets, { opacity: 1, y: 0, x: 0 });
        return;
      }

      const triggerConfig: ScrollTrigger.Vars = {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        ...scrollTrigger,
      };

      if (stagger != null) {
        gsap.from(el.children, {
          ...from,
          stagger,
          scrollTrigger: triggerConfig,
        });
      } else {
        gsap.from(el, {
          ...from,
          scrollTrigger: triggerConfig,
        });
      }
    },
    { scope: ref, dependencies: [] }
  );

  return ref;
}
