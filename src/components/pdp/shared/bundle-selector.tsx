"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/payments/constants";

interface BundleOption {
  id: string;
  label: string;
  description: string;
  price: number;
  popular?: boolean;
}

interface BundleSelectorProps {
  options: BundleOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currency?: string;
}

export function BundleSelector({
  options,
  selectedId,
  onSelect,
  currency = "usd",
}: BundleSelectorProps) {
  if (options.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="mb-3 text-sm font-semibold">Bundle & Save</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
              selectedId === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selectedId === option.id
                  ? "border-primary"
                  : "border-muted-foreground/30"
              )}
            >
              {selectedId === option.id && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{option.label}</span>
                {option.popular && (
                  <span className="rounded-sm bg-[var(--rebirth-amber)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>

            <span className="shrink-0 text-sm font-medium font-[family-name:var(--font-dm-mono)]">
              {formatPrice(option.price, currency)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
