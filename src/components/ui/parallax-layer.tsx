"use client";

import { useParallax } from "@/hooks/use-parallax";

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  /** Parallax speed: negative = slower/lag, positive = faster/lead */
  speed?: number;
}

/**
 * Wrapper that applies GSAP parallax scrolling to its children.
 * Different speed values create depth illusion.
 *
 * Example: speed={-0.15} makes content scroll 15% slower than the page.
 */
export function ParallaxLayer({
  children,
  className,
  speed = -0.2,
}: ParallaxLayerProps) {
  const ref = useParallax<HTMLDivElement>({ speed });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
