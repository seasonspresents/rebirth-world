"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DirectionAwareHoverProps {
  imageUrl: string;
  children: React.ReactNode;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}

export function DirectionAwareHover({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: DirectionAwareHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right"
  >("left");
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (!ref.current) return;
    const dir = getDirection(event, ref.current);
    switch (dir) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
    }
    setIsHovered(true);
  }

  function handleMouseLeave(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    setIsHovered(false);
  }

  function getDirection(
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  }

  const variants = {
    initial: {
      x:
        direction === "left"
          ? "-100%"
          : direction === "right"
            ? "100%"
            : 0,
      y:
        direction === "top"
          ? "-100%"
          : direction === "bottom"
            ? "100%"
            : 0,
      opacity: 0,
    },
    hover: { x: 0, y: 0, opacity: 1 },
    exit: {
      x:
        direction === "left"
          ? "-100%"
          : direction === "right"
            ? "100%"
            : 0,
      y:
        direction === "top"
          ? "-100%"
          : direction === "bottom"
            ? "100%"
            : 0,
      opacity: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group/card relative h-60 w-60 cursor-pointer overflow-hidden rounded-lg bg-transparent",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div className="absolute inset-0 z-10 hidden group-hover/card:block">
            <motion.div
              variants={variants}
              className={cn(
                "absolute inset-0 bg-black/40",
                childrenClassName
              )}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </motion.div>
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
            className={cn("h-full w-full", imageClassName)}
          >
            <Image
              alt="image"
              className="h-full w-full object-cover"
              fill
              src={imageUrl}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
