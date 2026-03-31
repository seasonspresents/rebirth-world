"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  type?: "pill" | "swatch";
}

export function VariantSelector({
  label,
  options,
  selected,
  onSelect,
  type = "pill",
}: VariantSelectorProps) {
  if (options.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                "relative min-h-[40px] rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId={`variant-${label}`}
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Parse variant_* metadata fields from a product and return
 * an array of { label, options } for rendering.
 */
export function parseVariantMetadata(
  metadata: Record<string, string | undefined>
): { label: string; options: string[] }[] {
  const variants: { label: string; options: string[] }[] = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (!key.startsWith("variant_") || !value) continue;

    const label = key
      .replace("variant_", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const options = value
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    if (options.length > 0) {
      variants.push({ label, options });
    }
  }

  return variants;
}
