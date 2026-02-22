"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/register";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a Lucide icon (or any SVG) and animates its stroke paths
 * on scroll reveal — drawing in from zero, with a subtle bounce.
 *
 * Usage:
 * ```tsx
 * <AnimatedIcon className="size-8">
 *   <Hammer />
 * </AnimatedIcon>
 * ```
 */
export function AnimatedIcon({ children, className }: AnimatedIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const paths = el.querySelectorAll("path, line, circle, polyline, rect");
      if (paths.length === 0) return;

      // Set up stroke dash for draw animation
      paths.forEach((path) => {
        const svgPath = path as SVGGeometryElement;
        if (svgPath.getTotalLength) {
          const length = svgPath.getTotalLength();
          gsap.set(svgPath, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }
      });

      // Also start with opacity 0
      gsap.set(el, { opacity: 0 });

      // Animate on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      tl.to(el, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "<0.1"
      );

      // Subtle bounce at end
      tl.fromTo(
        el,
        { scale: 1 },
        {
          scale: 1.1,
          duration: 0.15,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
        ">-0.2"
      );
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div ref={ref} className={cn("inline-flex", className)}>
      {children}
    </div>
  );
}
