"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/payments/constants";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  showLabel?: boolean;
}

export function WishlistButton({
  product,
  className,
  showLabel = false,
}: WishlistButtonProps) {
  const { isSaved, toggleItem } = useWishlist();
  const saved = isSaved(product.priceId);

  function handleToggle() {
    const nextSaved = toggleItem(product);
    toast.success(nextSaved ? "Saved for later" : "Removed from saved items", {
      description: product.name,
    });
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleToggle();
      }}
      className={cn(
        "border-border bg-background/90 text-foreground hover:bg-background focus-visible:ring-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        saved &&
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        !showLabel && "min-w-11 px-0",
        className
      )}
    >
      <Heart
        className={cn("size-4", saved && "fill-current")}
        aria-hidden="true"
      />
      {showLabel && <span>{saved ? "Saved" : "Save for later"}</span>}
    </button>
  );
}
