"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { RingModel } from "./ring-model";

interface RingViewerProps {
  /** Custom wood layer colors */
  layers?: string[];
  /** Enable orbit controls for interactive rotation */
  interactive?: boolean;
  /** Auto-rotate the ring */
  autoRotate?: boolean;
  /** Container className */
  className?: string;
  /** Engraving text */
  engravingText?: string;
}

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-[family-name:var(--font-dm-mono)]">
          Loading 3D view
        </p>
      </div>
    </div>
  );
}

/**
 * Self-contained 3D ring viewer with Canvas, lighting, and controls.
 * Renders a procedural skateboard ring with layered wood material.
 *
 * Usage:
 * ```tsx
 * <RingViewer className="h-[400px]" interactive />
 * ```
 */
export function RingViewer({
  layers,
  interactive = true,
  autoRotate = true,
  className = "h-[400px]",
  engravingText,
}: RingViewerProps) {
  return (
    <div className={className}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0.5, 3], fov: 35 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow={false}
          />
          <directionalLight
            position={[-3, 2, -2]}
            intensity={0.3}
            color="#cc7e3a"
          />

          {/* Environment for reflections */}
          <Environment preset="studio" environmentIntensity={0.3} />

          {/* Ring */}
          <RingModel
            layers={layers}
            autoRotate={autoRotate}
            engravingText={engravingText}
          />

          {/* Shadow */}
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.25}
            scale={4}
            blur={2.5}
          />

          {/* Controls */}
          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
}
