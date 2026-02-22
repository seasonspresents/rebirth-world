"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";

type SplitType = "chars" | "words" | "lines";

interface TextRevealProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  type?: SplitType;
  stagger?: number;
  duration?: number;
  y?: number;
  start?: string;
}

/**
 * Declarative wrapper for GSAP SplitText scroll-triggered reveals.
 *
 * Usage:
 * ```tsx
 * <TextReveal as="h2" className="text-fluid-display" type="words">
 *   Broken boards, reborn
 * </TextReveal>
 * ```
 *
 * Coexistence rule: Do NOT wrap content that already has Framer Motion
 * whileInView animations. Use one or the other per element.
 */
export function TextReveal({
  children,
  as: Tag = "div",
  className,
  type = "words",
  stagger = 0.04,
  duration = 0.8,
  y = 30,
  start = "top 85%",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

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
          toggleActions: "play none none none",
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [] }
  );

  // Use a plain div with ref and render the semantic tag inside
  // to avoid TypeScript ref-type conflicts with dynamic elements
  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {children}
    </Tag>
  );
}
