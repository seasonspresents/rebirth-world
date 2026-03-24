"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingNav({ children, className }: FloatingNavProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const prevScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = prevScrollY.current;
    const direction = current - prev;
    prevScrollY.current = current;

    setIsAtTop(current < 50);

    if (current < 50) {
      setVisible(true);
      return;
    }

    if (direction < 0) {
      setVisible(true);
    } else if (direction > 0 && current > 150) {
      setVisible(false);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 1, y: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border px-8 py-3 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
          isAtTop
            ? "border-transparent bg-transparent shadow-none"
            : "border-border/50 bg-background/80 backdrop-blur-lg",
          className
        )}
      >
        {children}
      </motion.nav>
    </AnimatePresence>
  );
}

interface NavItemProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function NavItem({ children, className, active }: NavItemProps) {
  return (
    <span
      className={cn(
        "relative text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
