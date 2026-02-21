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
        "flex items-center",
        "transition-all duration-300",
        className
      )}
    >
      <span
        className={cn(
          "text-xl font-normal font-[family-name:var(--font-display)] italic",
          textClassName
        )}
      >
        Rebirth
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
