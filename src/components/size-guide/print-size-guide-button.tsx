"use client";

import { Printer } from "lucide-react";

export function PrintSizeGuideButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-12 items-center justify-center gap-2 border border-[var(--rebirth-warm-black)]/20 bg-white px-6 py-3 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-[var(--rebirth-warm-black)] transition-all hover:-translate-y-0.5 hover:border-[var(--rebirth-warm-black)] print:hidden"
    >
      <Printer className="size-4" />
      Print Guide
    </button>
  );
}
