"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface SparklesTextProps {
  text: string;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

export function SparklesText({
  text,
  className,
  sparklesCount = 10,
  colors = { first: "#2d8a7e", second: "#cc7e3a" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateStar = (): Sparkle => ({
      id: `${Date.now()}-${Math.random()}`,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 1 + 0.3,
      lifespan: Math.random() * 10 + 5,
    });

    const interval = setInterval(() => {
      setSparkles((current) => {
        const now = Date.now();
        const filtered = current.filter(
          (s) => now - parseFloat(s.id.split("-")[0]) < s.lifespan * 1000
        );
        return [...filtered, generateStar()].slice(-sparklesCount);
      });
    }, 500);

    // Initial sparkles
    setSparkles(Array.from({ length: sparklesCount }, generateStar));

    return () => clearInterval(interval);
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <span
      className={cn("relative inline-block", className)}
      style={{ lineHeight: "inherit" }}
    >
      <span className="relative z-10">{text}</span>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            className="pointer-events-none absolute z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, sparkle.scale, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: sparkle.delay,
            }}
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: 16,
              height: 16,
            }}
            viewBox="0 0 160 160"
            fill="none"
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill={sparkle.color}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
    </span>
  );
}
