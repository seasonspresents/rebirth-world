"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface HoverBorderGradientProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  onClick?: () => void;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  duration = 1,
  clockwise = true,
  onClick,
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<string>("TOP");

  const rotateDirection = (currentDirection: string) => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<string, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, var(--rebirth-teal) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, var(--rebirth-teal) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, var(--rebirth-teal) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.199999999999996% at 100% 50%, var(--rebirth-teal) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, var(--rebirth-teal) 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        "relative flex h-min w-fit cursor-pointer flex-col flex-nowrap content-center items-center justify-center gap-10 overflow-visible rounded-full p-px decoration-clone transition duration-500 hover:bg-black/20",
        containerClassName
      )}
    >
      <div
        className={cn(
          "z-10 w-auto rounded-[inherit] bg-background px-4 py-2",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-0 flex-none overflow-hidden rounded-[inherit]"
        style={{ filter: "blur(2px)", position: "absolute", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="absolute inset-[2px] z-[1] flex-none rounded-[100px] bg-background" />
    </button>
  );
}
