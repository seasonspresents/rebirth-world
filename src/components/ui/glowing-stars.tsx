"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GlowingStarsProps {
  className?: string;
}

export function GlowingStarsBackgroundCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <div
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
      className={cn(
        "h-full max-h-[20rem] w-full max-w-md rounded-xl border border-border/50 bg-[linear-gradient(110deg,var(--rebirth-warm-black),45%,#1a3832,55%,var(--rebirth-warm-black))] p-4",
        className
      )}
    >
      <div className="flex items-center justify-center">
        <Illustration mouseEnter={mouseEnter} />
      </div>
      <div className="px-2 pb-4">{children}</div>
    </div>
  );
}

export function GlowingStarsDescription({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <p className={cn("max-w-[16rem] text-sm text-[var(--rebirth-film-cream)]/60", className)}>
      {children}
    </p>
  );
}

export function GlowingStarsTitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-2xl font-bold text-[var(--rebirth-film-cream)] font-[family-name:var(--font-display)]", className)}>
      {children}
    </h2>
  );
}

function Illustration({ mouseEnter }: { mouseEnter: boolean }) {
  const stars = 108;
  const columns = 18;

  const [glowingStars, setGlowingStars] = useState<number[]>([]);

  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars([...highlightedStars.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-48 w-full p-1"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1px",
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        const staticDelay = starIdx * 0.01;

        return (
          <div
            key={`matrix-col-${starIdx}`}
            className="relative flex items-center justify-center"
          >
            <Star
              isGlowing={mouseEnter ? true : isGlowing}
              delay={mouseEnter ? staticDelay : delay}
            />
            {mouseEnter && <Glow delay={staticDelay} />}
            <AnimatePresence mode="wait">
              {isGlowing && <Glow delay={delay} />}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Star({ isGlowing, delay }: { isGlowing: boolean; delay: number }) {
  return (
    <motion.div
      key={delay}
      initial={{ scale: 1 }}
      animate={{
        scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
        background: isGlowing ? "#2d8a7e" : "#555",
      }}
      transition={{ duration: 2, ease: "easeInOut", delay }}
      className={cn("relative z-20 h-[1px] w-[1px] rounded-full bg-[#555]")}
    />
  );
}

function Glow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut", delay }}
      exit={{ opacity: 0 }}
      className="absolute left-1/2 z-10 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[var(--rebirth-teal)] shadow-2xl shadow-[var(--rebirth-teal)]/50 blur-[1px]"
    />
  );
}
