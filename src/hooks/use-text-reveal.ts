"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap/register";

type SplitType = "chars" | "words" | "lines";

interface UseTextRevealOptions {
  type?: SplitType;
  stagger?: number;
  duration?: number;
  y?: number;
  start?: string;
  once?: boolean;
}

/**
 * GSAP SplitText scroll-triggered reveal hook.
 * Splits text into chars, words, or lines and animates them in with stagger.
 *
 * Returns a ref to attach to the text element (h1, h2, p, etc.).
 * Respects `prefers-reduced-motion`.
 * Auto-cleans up via `useGSAP` context (reverts SplitText on unmount).
 */
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: UseTextRevealOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    type = "words",
    stagger = 0.04,
    duration = 0.8,
    y = 30,
    start = "top 85%",
    once = true,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const split = SplitText.create(el, { type });
      const targets =
        type === "chars"
          ? split.chars
          : type === "lines"
            ? split.lines
            : split.words;

      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
        },
      });

      // SplitText revert is handled by useGSAP cleanup
      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [] }
  );

  return ref;
}
