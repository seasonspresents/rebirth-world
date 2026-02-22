"use client";

import { useGsapReveal } from "@/hooks/use-gsap-reveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType<React.ComponentPropsWithRef<"div">>;
  from?: gsap.TweenVars;
  stagger?: number;
  start?: string;
}

/**
 * Declarative wrapper for GSAP scroll-triggered reveals.
 *
 * Usage:
 * ```tsx
 * <ScrollReveal stagger={0.1}>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </ScrollReveal>
 * ```
 *
 * Coexistence rule: Never apply both <motion.div> and ScrollReveal
 * to the same DOM element. Use GSAP for new/enhanced sections;
 * leave existing Framer Motion animations untouched.
 */
export function ScrollReveal({
  children,
  className,
  as: Component = "div",
  from,
  stagger,
  start,
}: ScrollRevealProps) {
  const ref = useGsapReveal<HTMLDivElement>({
    from,
    stagger,
    scrollTrigger: start ? { start } : undefined,
  });

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
