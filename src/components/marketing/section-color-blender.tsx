"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

/**
 * Section Color Blender
 *
 * Layout-level component that smoothly blends background and text colors
 * between adjacent `[data-section-theme]` sections using GSAP ScrollTrigger.
 *
 * Instead of hard-cutting between section-warm → section-dark → section-ocean,
 * colors tween over a ~200px overlap zone as sections scroll into view.
 *
 * Place this once in the marketing layout. It targets a wrapper element
 * containing all themed sections.
 */

const THEME_COLORS: Record<string, { bg: string; fg: string }> = {
  warm: { bg: "#f5f0e8", fg: "#1a1a1a" },
  dark: { bg: "#1a1a1a", fg: "#f5f0e8" },
  ocean: { bg: "#1a3a36", fg: "#c8e6e3" },
  earth: { bg: "#f2ede5", fg: "#2a2118" },
};

const DARK_THEME_COLORS: Record<string, { bg: string; fg: string }> = {
  warm: { bg: "#1e1e1c", fg: "#f5f0e8" },
  dark: { bg: "#0d0d0d", fg: "#f5f0e8" },
  ocean: { bg: "#0f2422", fg: "#c8e6e3" },
  earth: { bg: "#1a1710", fg: "#ebe5d8" },
};

function getThemeColors(isDark: boolean) {
  return isDark ? DARK_THEME_COLORS : THEME_COLORS;
}

export function SectionColorBlender() {
  const hasSetup = useRef(false);

  useGSAP(() => {
    if (hasSetup.current) return;
    hasSetup.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Small delay to ensure sections are rendered
    const setupBlending = () => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-section-theme]"
      );
      if (sections.length < 2) return;

      const isDark = document.documentElement.classList.contains("dark");
      const colors = getThemeColors(isDark);

      for (let i = 1; i < sections.length; i++) {
        const prevTheme = sections[i - 1].dataset.sectionTheme;
        const nextTheme = sections[i].dataset.sectionTheme;

        if (!prevTheme || !nextTheme || prevTheme === nextTheme) continue;

        const prevColors = colors[prevTheme];
        const nextColors = colors[nextTheme];
        if (!prevColors || !nextColors) continue;

        // Tween the section's own background as it enters
        gsap.fromTo(
          sections[i],
          {
            backgroundColor: prevColors.bg,
            color: prevColors.fg,
          },
          {
            backgroundColor: nextColors.bg,
            color: nextColors.fg,
            ease: "none",
            scrollTrigger: {
              trigger: sections[i],
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      }
    };

    // Wait one frame for DOM to be ready
    requestAnimationFrame(() => {
      requestAnimationFrame(setupBlending);
    });

    // Re-setup on theme change
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          ScrollTrigger.getAll().forEach((st) => {
            const trigger = st.vars.trigger;
            if (
              trigger instanceof HTMLElement &&
              trigger.hasAttribute("data-section-theme")
            ) {
              st.kill();
            }
          });
          hasSetup.current = false;
          setupBlending();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
