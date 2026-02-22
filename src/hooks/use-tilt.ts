"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap/register";

interface UseTiltOptions {
  /** Maximum tilt angle in degrees (default: 6) */
  maxTilt?: number;
  /** Glare highlight strength (0-1, default: 0.15) */
  glare?: number;
}

/**
 * Lightweight 3D perspective tilt on hover.
 * Desktop only, respects prefers-reduced-motion.
 *
 * Returns a ref + event handlers to spread onto the target element.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(
  options: UseTiltOptions = {}
) {
  const ref = useRef<T>(null);
  const [enabled, setEnabled] = useState(false);

  const { maxTilt = 6, glare = 0.15 } = options;

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * maxTilt * 2;
      const rotateY = (x - 0.5) * maxTilt * 2;

      gsap.to(el, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });

      // Update glare highlight via CSS variable
      el.style.setProperty("--tilt-glare-x", `${x * 100}%`);
      el.style.setProperty("--tilt-glare-y", `${y * 100}%`);
      el.style.setProperty("--tilt-glare-opacity", String(glare));
    },
    [enabled, maxTilt, glare]
  );

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    el.style.setProperty("--tilt-glare-opacity", "0");
  }, [enabled]);

  return {
    ref,
    tiltHandlers: enabled
      ? {
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
        }
      : {},
  };
}
