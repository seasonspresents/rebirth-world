import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  label?: string;
  className?: string;
  starClassName?: string;
}

export function RatingStars({
  rating,
  label,
  className,
  starClassName,
}: RatingStarsProps) {
  const roundedRating = Math.round(rating);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            "h-4 w-4",
            value <= roundedRating
              ? "fill-amber-400 text-amber-500"
              : "text-muted-foreground/35",
            starClassName
          )}
          aria-hidden="true"
        />
      ))}
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
