"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

const THEME_COLORS: Record<string, { bg: string; fg: string }> = {
  warm: { bg: "#f3ece1", fg: "#1c1917" },
  dark: { bg: "#1c1917", fg: "#f3ece1" },
  ocean: { bg: "#1a3832", fg: "#c2dad1" },
  earth: { bg: "#f0eade", fg: "#28201a" },
};

const DARK_THEME_COLORS: Record<string, { bg: string; fg: string }> = {
  warm: { bg: "#1e1c19", fg: "#f3ece1" },
  dark: { bg: "#0f0d0b", fg: "#f3ece1" },
  ocean: { bg: "#0f2320", fg: "#c2dad1" },
  earth: { bg: "#1a1710", fg: "#e9e2d3" },
};

function getThemeColors(isDark: boolean) {
  return isDark ? DARK_THEME_COLORS : THEME_COLORS;
}

/**
 * Section Color Blender — only runs on homepage and shop listing.
 * DISABLED on individual product pages (PDP) to prevent GSAP ScrollTrigger
 * from interfering with native scroll behavior.
 */
export function SectionColorBlender() {
  const hasSetup = useRef(false);
  const pathname = usePathname();

  // Only enable on homepage and shop listing — NOT on individual product pages
  const isProductPage = pathname?.startsWith("/shop/") && pathname !== "/shop";
  const shouldRun = !isProductPage;

  useGSAP(() => {
    if (!shouldRun) return;
    if (hasSetup.current) return;
    hasSetup.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

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

    requestAnimationFrame(() => {
      requestAnimationFrame(setupBlending);
    });

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
  }, [shouldRun]);

  return null;
}
