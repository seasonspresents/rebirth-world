"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/register";

const STEPS = [
  {
    number: "01",
    title: "Collect",
    description:
      "Broken boards donated by local skaters on the North Shore. Every deck carries its own history — scratches, graphics, memories of sessions past.",
  },
  {
    number: "02",
    title: "Layer",
    description:
      "Seven plies of Canadian maple are carefully stacked and glued. Each layer reveals a different color from the original deck — teal, amber, natural, black.",
  },
  {
    number: "03",
    title: "Shape",
    description:
      "Turned by hand on a lathe in Daniel's workshop. Sanded through progressively finer grits until the layers emerge smooth and the ring finds its form.",
  },
  {
    number: "04",
    title: "Finish",
    description:
      "Coated with thin CA glue — not polyurethane — and hand-polished to a glass-like finish. Water-resistant, durable, and silky to the touch.",
  },
];

/**
 * Pinned "From Board to Ring" craft story section.
 * 4 steps crossfade as the user scrolls. Section is pinned for ~4x viewport height.
 */
export function CraftStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Show all steps stacked without animation
        stepsRef.current.forEach((step) => {
          if (step) {
            gsap.set(step, {
              position: "relative",
              autoAlpha: 1,
              y: 0,
            });
          }
        });
        return;
      }

      const steps = stepsRef.current.filter(Boolean) as HTMLDivElement[];
      if (steps.length === 0) return;

      // Initial state: first step visible, rest hidden
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      steps.slice(1).forEach((step) => {
        gsap.set(step, { autoAlpha: 0, y: 40 });
      });

      // Create a timeline that crossfades through all steps
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * 3.5}`,
          pin: true,
          scrub: 0.5,
        },
      });

      for (let i = 0; i < steps.length - 1; i++) {
        // Fade out current step
        tl.to(steps[i], {
          autoAlpha: 0,
          y: -30,
          duration: 0.4,
          ease: "power2.inOut",
        });
        // Fade in next step
        tl.fromTo(
          steps[i + 1],
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.inOut" },
          "<0.1"
        );
        // Update counter
        if (counterRef.current) {
          tl.to(
            counterRef.current,
            {
              textContent: STEPS[i + 1].number,
              snap: { textContent: 1 },
              duration: 0.1,
            },
            "<"
          );
        }
        // Pause between steps
        if (i < steps.length - 2) {
          tl.to({}, { duration: 0.3 });
        }
      }
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      data-section-theme="dark"
      className="section-dark bg-grain relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        {/* Section header */}
        <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-section-accent font-[family-name:var(--font-dm-mono)]">
          From board to ring
        </p>
        <h2 className="text-fluid-display max-w-[18ch]">
          Four steps. One ring. Entirely by hand.
        </h2>

        {/* Steps container */}
        <div className="relative mt-16 min-h-[280px] md:mt-20 md:min-h-[240px]">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => {
                stepsRef.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col justify-start md:flex-row md:items-start md:gap-16"
              style={{ visibility: i === 0 ? "visible" : "hidden" }}
            >
              {/* Step number */}
              <span className="text-mega text-section-accent shrink-0 opacity-30">
                {step.number}
              </span>

              <div className="mt-4 md:mt-4">
                <h3 className="text-fluid-heading">{step.title}</h3>
                <p className="mt-4 max-w-[50ch] text-lg leading-relaxed text-section-muted md:text-xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-12 flex items-center gap-3 md:mt-8">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="h-1 w-8 rounded-full bg-section-fg/20"
              data-step-dot={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
