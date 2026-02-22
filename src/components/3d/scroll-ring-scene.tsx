"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";
import { RingModel } from "./ring-model";
import { TextReveal } from "@/components/ui/text-reveal";
import * as THREE from "three";

/** Ring that reads scroll progress from a shared ref */
function ScrollRing({
  progressRef,
}: {
  progressRef: React.RefObject<{ value: number }>;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!meshRef.current || !progressRef.current) return;
    const p = progressRef.current.value;

    // Rotate ring based on scroll progress
    meshRef.current.rotation.y = p * Math.PI * 4;
    meshRef.current.rotation.x = Math.PI / 6 + Math.sin(p * Math.PI) * 0.3;

    // Scale up from 0.6 to 1.0 during first half of scroll
    const scale = THREE.MathUtils.lerp(0.7, 1.0, Math.min(p * 2, 1));
    meshRef.current.scale.setScalar(scale);

    // Float up and down
    meshRef.current.position.y = Math.sin(p * Math.PI * 2) * 0.15;
  });

  return (
    <group ref={meshRef}>
      <RingModel autoRotate={false} />
    </group>
  );
}

/**
 * Full-bleed homepage section with a 3D ring that responds to scroll.
 * Ring rotates, scales, and floats as the user scrolls through the section.
 */
export function ScrollRingScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current.value = self.progress;
        },
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      data-section-theme="dark"
      className="section-dark relative overflow-hidden px-6 py-32 md:py-48"
    >
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
          {/* Text side */}
          <div>
            <TextReveal as="h2" className="text-fluid-display" type="words">
              Seven layers. One ring.
            </TextReveal>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-section-muted">
              Every skateboard deck is built from seven layers of Canadian maple
              — pressed, shaped, and ridden until it breaks. We take those
              broken boards and turn them into something you&apos;ll wear forever.
            </p>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-section-muted">
              The colors you see aren&apos;t painted on. They&apos;re the
              original dye from the deck&apos;s graphic, revealed when the wood
              is cut cross-grain. No two rings are alike.
            </p>
          </div>

          {/* 3D ring */}
          <div className="relative h-[350px] md:h-[450px]">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="size-8 animate-spin rounded-full border-2 border-section-accent border-t-transparent" />
                </div>
              }
            >
              <Canvas
                camera={{ position: [0, 0.5, 3], fov: 35 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
              >
                <ambientLight intensity={0.3} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.8}
                />
                <directionalLight
                  position={[-3, 2, -2]}
                  intensity={0.3}
                  color="#e07a3a"
                />
                <Environment preset="studio" environmentIntensity={0.2} />

                <ScrollRing progressRef={progressRef} />

                <ContactShadows
                  position={[0, -0.6, 0]}
                  opacity={0.2}
                  scale={4}
                  blur={2.5}
                />
              </Canvas>
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
