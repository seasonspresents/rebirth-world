"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const RingViewer = dynamic(
  () => import("@/components/3d/ring-viewer").then((mod) => mod.RingViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

interface Product3DToggleProps {
  /** The image gallery to show in "photos" mode */
  imageGallery: React.ReactNode;
  /** Whether this product supports 3D view (rings only) */
  show3D?: boolean;
}

/**
 * Wraps the product image gallery and adds a 3D view toggle for ring products.
 * Renders a tab bar to switch between "Photos" and "3D View".
 */
export function Product3DToggle({
  imageGallery,
  show3D = false,
}: Product3DToggleProps) {
  const [mode, setMode] = useState<"photos" | "3d">("photos");

  if (!show3D) {
    return <>{imageGallery}</>;
  }

  return (
    <div>
      {/* Tab toggle */}
      <div className="mb-3 flex gap-1 rounded-lg bg-muted/50 p-1">
        <button
          onClick={() => setMode("photos")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            mode === "photos"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ImageIcon className="size-3.5" />
          Photos
        </button>
        <button
          onClick={() => setMode("3d")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            mode === "3d"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Box className="size-3.5" />
          3D View
        </button>
      </div>

      {/* Content */}
      {mode === "photos" ? (
        imageGallery
      ) : (
        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted/30">
          <RingViewer interactive autoRotate className="h-full" />
        </div>
      )}
    </div>
  );
}
