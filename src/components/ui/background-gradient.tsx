"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export function BackgroundGradient({
  children,
  className,
  containerClassName,
  animate = true,
}: BackgroundGradientProps) {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("group relative p-[4px]", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-[1] rounded-3xl opacity-60 blur-xl transition duration-500 will-change-transform group-hover:opacity-100",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,var(--rebirth-teal),transparent),radial-gradient(circle_farthest-side_at_100%_0,var(--rebirth-amber),transparent),radial-gradient(circle_farthest-side_at_100%_100%,var(--rebirth-moss),transparent),radial-gradient(circle_farthest-side_at_0_0,var(--rebirth-rose),transparent)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-[1] rounded-3xl will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,var(--rebirth-teal),transparent),radial-gradient(circle_farthest-side_at_100%_0,var(--rebirth-amber),transparent),radial-gradient(circle_farthest-side_at_100%_100%,var(--rebirth-moss),transparent),radial-gradient(circle_farthest-side_at_0_0,var(--rebirth-rose),transparent)]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
