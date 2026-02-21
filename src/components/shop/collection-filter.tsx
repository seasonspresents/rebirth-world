"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { COLLECTIONS } from "@/lib/payments/constants";

interface CollectionFilterProps {
  counts?: Record<string, number>;
  totalCount?: number;
}

export function CollectionFilter({
  counts = {},
  totalCount,
}: CollectionFilterProps) {
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
    // Preserve sort param
    router.push(`/shop?${params.toString()}`);
  }

  const options: { slug: string | null; label: string; count?: number }[] = [
    { slug: null, label: "All", count: totalCount },
    ...COLLECTIONS.map((c) => ({
      slug: c.slug,
      label: c.label,
      count: counts[c.slug],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive =
          option.slug === null ? !active : active === option.slug;
        return (
          <button
            key={option.slug ?? "all"}
            onClick={() => handleFilter(option.slug)}
            className={cn(
              "relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeFilter"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 opacity-70">({option.count})</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
