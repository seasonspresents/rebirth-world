import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
  clickable?: boolean;
}

export function Logo({
  className,
  textClassName,
  clickable = true,
}: LogoProps) {
  const logoContent = (
    <div
      className={cn(
        "flex items-baseline gap-1.5",
        "transition-all duration-300",
        className
      )}
    >
      <span
        className={cn(
          "text-xl font-semibold tracking-tight font-[family-name:var(--font-display)]",
          textClassName
        )}
      >
        Rebirth
      </span>
      <span className="text-xs font-medium tracking-widest uppercase font-[family-name:var(--font-dm-mono)] text-muted-foreground">
        World
      </span>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
