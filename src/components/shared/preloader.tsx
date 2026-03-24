"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap/register";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!brandRef.current || !visible) return;

      const split = SplitText.create(brandRef.current, { type: "chars" });

      const tl = gsap.timeline();

      // Char-by-char reveal with stagger
      tl.fromTo(
        split.chars,
        { opacity: 0, y: 20, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
        }
      );

      // Subtitle fade
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      return () => {
        split.revert();
      };
    },
    { scope: containerRef, dependencies: [visible] }
  );

  useEffect(() => {
    if (sessionStorage.getItem("rebirth-preloader-shown")) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 1600);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("rebirth-preloader-shown", "1");
    }, 2300);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!animateOut && (
        <motion.div
          ref={containerRef}
          className="preloader"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[300px] w-[300px] rounded-full bg-[var(--rebirth-teal)] opacity-[0.08] blur-[100px]" />
          </div>

          <div className="preloader-content relative">
            <span
              ref={brandRef}
              className="preloader-text"
              style={{ perspective: "600px" }}
            >
              REBIRTH
            </span>
            <span ref={subRef} className="preloader-sub">
              Embrace Change
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
