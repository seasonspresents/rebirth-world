"use client";

import { useMemo, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type ShopFilterOption = {
  value: string;
  label: string;
  count?: number;
};

type ShopFiltersProps = {
  collections: ShopFilterOption[];
  materials: ShopFilterOption[];
  sizes: ShopFilterOption[];
};

const PRICE_OPTIONS: ShopFilterOption[] = [
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50-$100" },
  { value: "100-200", label: "$100-$200" },
  { value: "200-plus", label: "$200+" },
];

const FILTER_KEYS = ["collection", "material", "price", "size"] as const;

export function ShopFilters({
  collections,
  materials,
  sizes,
}: ShopFiltersProps) {
  const searchParams = useSearchParams();
  const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--rebirth-warm-black)] bg-[var(--rebirth-warm-black)] px-4 py-2.5 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-white"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              FILTERS
              {activeCount > 0 ? (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center bg-white px-1.5 text-[11px] leading-none text-[var(--rebirth-warm-black)]">
                  {activeCount}
                </span>
              ) : null}
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[86svh] gap-0 overflow-y-auto p-0 pb-8"
          >
            <SheetHeader className="border-b px-5 py-5 text-left">
              <SheetTitle className="font-[family-name:var(--font-serif)] text-2xl">
                Shop Filters
              </SheetTitle>
              <SheetDescription>
                Narrow by collection, material, price, and available ring size.
              </SheetDescription>
            </SheetHeader>
            <FilterContent
              collections={collections}
              materials={materials}
              sizes={sizes}
              className="p-5"
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 border border-[#dfd4c3] bg-[#f8f2e8] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2.3px] text-[var(--rebirth-teal)]">
                Refine
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-serif)] text-2xl font-bold">
                Shop Filters
              </h2>
            </div>
            {activeCount > 0 ? (
              <span className="bg-[var(--rebirth-teal)] px-2 py-1 text-xs font-semibold text-white">
                {activeCount}
              </span>
            ) : null}
          </div>
          <FilterContent
            collections={collections}
            materials={materials}
            sizes={sizes}
          />
        </div>
      </aside>
    </>
  );
}

function FilterContent({
  collections,
  materials,
  sizes,
  className,
}: ShopFiltersProps & { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = useMemo(
    () => ({
      collection: searchParams.get("collection"),
      material: searchParams.get("material"),
      price: searchParams.get("price"),
      size: searchParams.get("size"),
    }),
    [searchParams]
  );

  function setFilter(key: (typeof FILTER_KEYS)[number], value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  }

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  }

  return (
    <div className={cn("space-y-7", className)}>
      <FilterGroup title="Collection">
        <FilterButton
          label="All"
          active={!active.collection}
          count={collections.reduce((total, option) => total + (option.count ?? 0), 0)}
          onClick={() => setFilter("collection", null)}
        />
        {collections.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            count={option.count}
            active={active.collection === option.value}
            onClick={() => setFilter("collection", option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Material">
        <FilterButton
          label="All materials"
          active={!active.material}
          onClick={() => setFilter("material", null)}
        />
        {materials.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            count={option.count}
            active={active.material === option.value}
            onClick={() => setFilter("material", option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <FilterButton
          label="Any price"
          active={!active.price}
          onClick={() => setFilter("price", null)}
        />
        {PRICE_OPTIONS.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            active={active.price === option.value}
            onClick={() => setFilter("price", option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Ring size availability">
        <FilterButton
          label="Any size"
          active={!active.size}
          onClick={() => setFilter("size", null)}
        />
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              count={option.count}
              active={active.size === option.value}
              onClick={() => setFilter("size", option.value)}
              compact
            />
          ))}
        </div>
      </FilterGroup>

      <button
        type="button"
        onClick={resetFilters}
        className="min-h-11 w-full border border-[#d4c8b6] px-4 py-2.5 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-[var(--rebirth-warm-black)] transition-colors hover:border-[var(--rebirth-warm-black)]"
      >
        RESET FILTERS
      </button>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[2.2px] text-[#6f665a]">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  compact = false,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 w-full items-center justify-between border px-3 py-2 text-left text-sm transition-colors",
        active
          ? "border-[var(--rebirth-teal)] bg-[var(--rebirth-teal)] text-white"
          : "border-[#dfd4c3] bg-white/55 text-[#423c35] hover:border-[#8f8376]",
        compact && "justify-center text-center"
      )}
    >
      <span>{label}</span>
      {count !== undefined && !compact ? (
        <span className={active ? "text-white/75" : "text-[#8f8376]"}>
          {count}
        </span>
      ) : null}
    </button>
  );
}
