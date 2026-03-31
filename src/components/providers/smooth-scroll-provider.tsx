"use client";

/**
 * Smooth scroll provider — Lenis DISABLED globally.
 *
 * Lenis was causing scroll freezing on PDP pages (especially mobile)
 * due to conflicts with heavy client components (variant selectors,
 * accordions, AnimatePresence). Native browser scroll is used instead.
 *
 * All GSAP ScrollTrigger, Framer Motion, and Aceternity animations
 * work perfectly with native scroll — Lenis was only for the inertia
 * "smooth" feel which isn't worth the scroll-blocking bugs.
 *
 * Can be re-enabled per-page in the future if needed.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
