"use client";

import { useState } from "react";
import { RingViewer } from "./ring-viewer";
import { cn } from "@/lib/utils";

const WOOD_PRESETS = [
  {
    id: "classic-maple",
    name: "Classic Maple",
    description: "Natural 7-ply with teal accents",
    layers: [
      "#c4a067",
      "#2d8a7e",
      "#7a3f13",
      "#cc7e3a",
      "#c4a067",
      "#1c1917",
      "#d0a36a",
    ],
  },
  {
    id: "ocean-fade",
    name: "Ocean Fade",
    description: "Deep teal to warm amber",
    layers: [
      "#1a3832",
      "#2d8a7e",
      "#3a9f91",
      "#c4a067",
      "#cc7e3a",
      "#c4a067",
      "#2d8a7e",
    ],
  },
  {
    id: "sunset-deck",
    name: "Sunset Deck",
    description: "Amber, coral, and warm maple",
    layers: [
      "#cc7e3a",
      "#d0a36a",
      "#b87272",
      "#c4a067",
      "#cc7e3a",
      "#7a3f13",
      "#d0a36a",
    ],
  },
  {
    id: "dark-stealth",
    name: "Dark Stealth",
    description: "Charcoal and natural grain",
    layers: [
      "#1c1917",
      "#4a4a4a",
      "#7a3f13",
      "#1c1917",
      "#c4a067",
      "#1c1917",
      "#4a4a4a",
    ],
  },
  {
    id: "moss-earth",
    name: "Moss Earth",
    description: "Forest green and warm wood",
    layers: [
      "#4d7a4e",
      "#c4a067",
      "#536b45",
      "#876f4c",
      "#4d7a4e",
      "#d0a36a",
      "#536b45",
    ],
  },
];

interface RingCustomizerProps {
  className?: string;
}

/**
 * Interactive ring customizer with wood type picker and live 3D preview.
 * Users can select a wood preset and preview how the ring looks.
 */
export function RingCustomizer({ className }: RingCustomizerProps) {
  const [selectedPreset, setSelectedPreset] = useState(WOOD_PRESETS[0]);
  const [engravingText, setEngravingText] = useState("");

  return (
    <div className={cn("grid grid-cols-1 gap-8 md:grid-cols-2", className)}>
      {/* 3D Preview */}
      <div className="relative rounded-2xl bg-muted/30">
        <RingViewer
          layers={selectedPreset.layers}
          interactive
          autoRotate
          className="h-[350px] md:h-[450px]"
          engravingText={engravingText}
        />
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground font-[family-name:var(--font-dm-mono)]">
          Drag to rotate
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
            Choose your wood
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Every board has a unique color story. Pick the palette that speaks to
            you.
          </p>
        </div>

        {/* Wood presets */}
        <div className="flex flex-col gap-3">
          {WOOD_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={cn(
                "flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all",
                selectedPreset.id === preset.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              {/* Color swatch */}
              <div className="flex h-8 w-14 shrink-0 overflow-hidden rounded-md">
                {preset.layers.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {preset.description}
                </p>
              </div>

              {selectedPreset.id === preset.id && (
                <div className="ml-auto size-2 shrink-0 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Engraving */}
        <div>
          <label
            htmlFor="engraving-preview"
            className="block text-sm font-medium"
          >
            Engraving preview
          </label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Up to 10 characters — see how it looks before you order
          </p>
          <input
            id="engraving-preview"
            type="text"
            maxLength={10}
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
            placeholder="Your text here"
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Colors shown are representative — each ring is one of a kind due to
          the unique skateboard it&apos;s made from.
        </p>
      </div>
    </div>
  );
}
