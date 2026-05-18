"use client";

import { useEffect, useId, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ShopSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);
  const inputId = useId();

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  function submitSearch(nextQuery = query) {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedQuery = nextQuery.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    const next = params.toString();
    router.push(next ? `/shop?${next}#products` : "/shop#products");
  }

  function clearSearch() {
    setQuery("");
    submitSearch("");
  }

  return (
    <form
      role="search"
      aria-label="Search products"
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch();
      }}
      className="border border-[#dfd4c3] bg-[#f8f2e8] p-3"
    >
      <label htmlFor={inputId} className="sr-only">
        Search by product, material, or collection
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={inputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                clearSearch();
              }
            }}
            placeholder="Search rings, wedding bands, koa, apparel..."
            className="min-h-11 w-full border border-[#d4c8b6] bg-white py-2 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--rebirth-teal)] focus:ring-2 focus:ring-[var(--rebirth-teal)]/20"
          />
          {query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-1.5 top-1/2 inline-flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center bg-[var(--rebirth-warm-black)] px-5 py-2.5 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-white transition-all hover:-translate-y-0.5"
        >
          Search
        </button>
      </div>
    </form>
  );
}
