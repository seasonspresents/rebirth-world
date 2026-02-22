"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/register";

/**
 * Custom branded cursor for desktop.
 * Renders a small dot (follows cursor exactly) and an outer ring (follows with lerp).
 * Ring expands when hovering over interactive elements (links, buttons).
 * Only renders on non-touch devices. Respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only show on fine pointer (mouse) devices
    const mql = window.matchMedia("(pointer: fine)");
    if (!mql.matches) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsDesktop(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows exactly
      gsap.set(dot, { x: mouseX, y: mouseY });

      // Ring follows with spring
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(ring, {
        scale: 2,
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15 });
      gsap.to(dot, { scale: 1.5, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Observe interactive elements
    const interactiveSelector =
      "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";

    const observer = new MutationObserver(() => {
      bindInteractives();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function bindInteractives() {
      const elements = document.querySelectorAll(interactiveSelector);
      elements.forEach((el) => {
        el.removeEventListener(
          "mouseenter",
          onMouseEnterInteractive as EventListener
        );
        el.removeEventListener(
          "mouseleave",
          onMouseLeaveInteractive as EventListener
        );
        el.addEventListener(
          "mouseenter",
          onMouseEnterInteractive as EventListener
        );
        el.addEventListener(
          "mouseleave",
          onMouseLeaveInteractive as EventListener
        );
      });
    }
    bindInteractives();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Dot — follows cursor exactly */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--rebirth-teal, #2a9d8f)",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
        }}
      />
      {/* Ring — follows with spring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid var(--rebirth-teal, #2a9d8f)",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          opacity: 0.6,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
