"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Pause/resume Lenis smooth scroll when a modal or overlay is open.
 * Prevents background scrolling while cart drawer, mobile nav, etc. are visible.
 */
export function useLenisPause(isOpen: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, isOpen]);
}
