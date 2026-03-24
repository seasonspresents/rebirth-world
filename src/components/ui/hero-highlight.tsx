"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface HeroHighlightProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function HeroHighlight({
  children,
  className,
  containerClassName,
}: HeroHighlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      className={cn("group relative flex items-center justify-center", containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800" />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(45, 138, 126, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
}

interface HighlightProps {
  children: React.ReactNode;
  className?: string;
}

export function Highlight({ children, className }: HighlightProps) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 2, ease: "linear", delay: 0.5 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block rounded-lg bg-gradient-to-r from-rebirth-teal/20 to-rebirth-teal/10 px-1 pb-1",
        className
      )}
    >
      {children}
    </motion.span>
  );
}
