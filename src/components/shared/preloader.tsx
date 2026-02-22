"use client";

import { useState, useEffect } from "react";

/**
 * Branded preloader that plays once on initial page load.
 * Shows the Rebirth brand name with a subtle animation, then fades out.
 * Uses sessionStorage so it only plays once per browser session.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Skip preloader if already shown this session
    if (sessionStorage.getItem("rebirth-preloader-shown")) {
      setVisible(false);
      return;
    }

    // Animate out after a short display
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 1400);

    // Remove from DOM after fade animation completes
    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("rebirth-preloader-shown", "1");
    }, 2100);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="preloader"
      style={{
        opacity: animateOut ? 0 : 1,
        transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      aria-hidden="true"
    >
      <div className="preloader-content">
        <span className="preloader-text">REBIRTH</span>
        <span className="preloader-sub">Embrace Change</span>
      </div>
    </div>
  );
}
