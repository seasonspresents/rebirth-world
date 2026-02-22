"use client";

import { useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap/register";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element pulls toward cursor (0-1, default 0.3) */
  strength?: number;
  /** Disable on touch devices (default true) */
  desktopOnly?: boolean;
}

/**
 * Magnetic wrapper that pulls its children toward the cursor on hover.
 * Uses GSAP for smooth spring-like animation.
 * Desktop only by default — touch devices get no effect.
 * Respects prefers-reduced-motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
  desktopOnly = true,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      if (desktopOnly && window.matchMedia("(pointer: coarse)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    [strength, desktopOnly]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
    >
      {children}
    </div>
  );
}
