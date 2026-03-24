"use client";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-[var(--rebirth-warm-black)] text-[var(--rebirth-film-cream)] transition-bg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert-0 filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--rebirth-teal)_10%,var(--rebirth-amber)_15%,var(--rebirth-moss)_20%,var(--rebirth-rose)_25%,var(--rebirth-teal)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--rebirth-warm-black)_0%,var(--rebirth-warm-black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--rebirth-warm-black)_16%)] [background-image:var(--dark-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute after:inset-0 after:animate-aurora after:mix-blend-difference after:content-[""] after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%]`,
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]"
          )}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
