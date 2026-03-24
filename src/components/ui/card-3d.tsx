"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CardContainer({
  children,
  className,
  containerClassName,
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsMouseEntered(true);
    if (containerRef.current) {
      containerRef.current.style.transition = "none";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseEntered(false);
    if (containerRef.current) {
      containerRef.current.style.transition = "all 0.5s ease";
      containerRef.current.style.transform =
        "rotateY(0deg) rotateX(0deg)";
    }
  }, []);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardItemProps {
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}

export function CardItem({
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
}: CardItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(MouseEnterContext);
  const [isMouseEntered] = ctx ?? [false];

  const handleAnimations = useCallback(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform =
        "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
    }
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  // Trigger animation on hover state change
  if (typeof window !== "undefined") {
    handleAnimations();
  }

  return (
    <div
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
    >
      {children}
    </div>
  );
}

export function useMouseEnter() {
  const ctx = useContext(MouseEnterContext);
  if (!ctx) {
    throw new Error("useMouseEnter must be used within a CardContainer");
  }
  return ctx;
}
