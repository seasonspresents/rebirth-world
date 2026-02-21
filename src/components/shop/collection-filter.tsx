"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { COLLECTIONS } from "@/lib/payments/constants";

export function CollectionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("collection");

  function handleFilter(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("collection", slug);
    } else {
      params.delete("collection");
    }
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          !active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </button>
      {COLLECTIONS.map((collection) => (
        <button
          key={collection.slug}
          onClick={() => handleFilter(collection.slug)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            active === collection.slug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {collection.label}
        </button>
      ))}
    </div>
  );
}
