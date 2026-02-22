"use client";

import dynamic from "next/dynamic";

const ScrollRingScene = dynamic(
  () =>
    import("@/components/3d/scroll-ring-scene").then(
      (mod) => mod.ScrollRingScene
    ),
  { ssr: false }
);

export function ScrollRingSceneLazy() {
  return <ScrollRingScene />;
}
