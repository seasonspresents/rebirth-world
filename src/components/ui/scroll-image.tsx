"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/register";
import { cn } from "@/lib/utils";

interface ScrollImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  /** Initial scale of the image before reveal (default: 1.15) */
  scaleFrom?: number;
  /** Border radius of the container (default: "1rem") */
  radius?: string;
  /** Style passed to the Image element (e.g. for viewTransitionName) */
  style?: React.CSSProperties;
}

/**
 * Image reveal with overflow clip.
 * Image starts scaled up inside a clipped container and scales down to 1.0
 * as it scrolls into view, creating a cinematic reveal-through-frame effect.
 */
export function ScrollImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  containerClassName,
  priority,
  scaleFrom = 1.15,
  radius = "1rem",
  style,
}: ScrollImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const image = imageRef.current;
      if (!container || !image) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        image,
        { scale: scaleFrom },
        {
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            end: "bottom 20%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", containerClassName)}
      style={{ borderRadius: radius }}
    >
      <div ref={imageRef} className="h-full w-full will-change-transform">
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className={cn("h-full w-full object-cover", className)}
          style={style}
        />
      </div>
    </div>
  );
}
