"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

/* ── Timing choreography (seconds) ── */
const T = {
  pill: 0,
  headline: 0.2,
  italic: 0.4,
  tattoo: 0.55,
  tattooDur: 0.9,
  sub: 1.3,
  cta: 1.45,
  micro: 1.55,
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/* ── Tattoo needle SVG ── */
function NeedleIcon() {
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      className="text-muted-foreground/60"
    >
      {/* Machine body */}
      <line
        x1="5"
        y1="18"
        x2="5"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Needle tip */}
      <line
        x1="5"
        y1="5"
        x2="5"
        y2="0"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Tattoo draw reveal — outline first, then fill ── */
function TattooReveal({
  children,
  delay,
  duration,
}: {
  children: string;
  delay: number;
  duration: number;
}) {
  const DASH = 2000; // Large enough to cover any text outline path

  return (
    <span className="relative inline-block">
      {/* Invisible HTML text for layout sizing */}
      <span className="invisible" aria-hidden="true">
        {children}
      </span>

      {/* SVG text overlay — stroke draws on, then fill fades in */}
      <span className="absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full overflow-visible">
          <motion.text
            x="0"
            y="0"
            dominantBaseline="hanging"
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              fontStyle: "italic",
              letterSpacing: "inherit",
              stroke: "currentColor",
              strokeWidth: 0.8,
              strokeDasharray: DASH,
            }}
            initial={{
              strokeDashoffset: DASH,
              fill: "currentColor",
              fillOpacity: 0,
            }}
            animate={{
              strokeDashoffset: 0,
              fillOpacity: 1,
            }}
            transition={{
              strokeDashoffset: {
                duration: duration,
                delay: delay,
                ease: [0.4, 0, 0.2, 1],
              },
              fillOpacity: {
                duration: duration * 0.35,
                delay: delay + duration * 0.55,
              },
            }}
          >
            {children}
          </motion.text>
        </svg>
      </span>

      {/* Screen reader text */}
      <span className="sr-only">{children}</span>

      {/* Needle tracer — follows the writing direction */}
      <motion.span
        className="pointer-events-none absolute -top-4"
        style={{ rotate: "18deg" }}
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
        transition={{
          left: { duration, delay, ease: [0.4, 0, 0.2, 1] },
          opacity: {
            duration: duration + 0.15,
            delay: delay - 0.05,
            times: [0, 0.06, 0.88, 1],
          },
        }}
      >
        <span className="buzz block">
          <NeedleIcon />
        </span>
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center overflow-hidden px-6 pt-10 pb-14 text-center sm:pt-24 sm:pb-18"
    >
      {/* Needle vibration keyframes */}
      <style>{`
        .buzz {
          animation: buzz 0.06s linear infinite;
        }
        @keyframes buzz {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.5px); }
        }
      `}</style>

      {/* Stipple texture overlay */}
      <div className="bg-stipple pointer-events-none absolute inset-0 opacity-[0.025]" />

      {/* Ambient particle field */}
      <Particles
        className="pointer-events-none absolute inset-0"
        quantity={45}
        color="#e08a30"
        size={0.3}
        staticity={80}
        ease={80}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] space-y-5 sm:space-y-7">
        {/* ── Badge Pill — stencil press ── */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: T.pill,
            ease: [0.2, 0, 0.2, 1],
          }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.8rem] font-semibold tracking-wide text-foreground/80"
            initial={{
              backgroundColor: "rgba(147, 120, 200, 0.12)",
              borderColor: "rgba(147, 120, 200, 0.3)",
            }}
            animate={{
              backgroundColor: "rgba(224, 138, 48, 0.05)",
              borderColor: "rgba(224, 138, 48, 0.3)",
            }}
            transition={{ duration: 0.6, delay: T.pill + 0.15 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            For tattoo artists, not receptionists
          </motion.div>
        </motion.div>

        {/* ── Headline — staggered with tattoo draw ── */}
        <h1 className="mx-auto max-w-[780px] text-[clamp(2.5rem,5.8vw,4rem)] leading-[1.08] tracking-tight font-[family-name:var(--font-display)]">
          <motion.span
            className="inline"
            {...fadeInUp}
            transition={{ duration: 0.5, delay: T.headline }}
          >
            You&apos;re doing two full-time jobs.
          </motion.span>{" "}
          <span className="italic text-muted-foreground">
            <motion.span
              className="inline"
              {...fadeInUp}
              transition={{ duration: 0.5, delay: T.italic }}
            >
              One of them isn&apos;t{" "}
            </motion.span>
            <TattooReveal delay={T.tattoo} duration={T.tattooDur}>
              tattooing.
            </TattooReveal>
          </span>
        </h1>

        {/* ── Subheadline ── */}
        <motion.p
          className="mx-auto max-w-[54ch] text-[clamp(1.1rem,1.8vw,1.18rem)] leading-relaxed text-muted-foreground"
          {...fadeInUp}
          transition={{ duration: 0.5, delay: T.sub }}
        >
          Right now, a client is sitting in your DMs waiting. You&apos;re
          mid-session, your phone is face-down, and by the time you reply
          tonight — they&apos;ve already booked someone else.
        </motion.p>

        {/* ── CTA Button ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
          {...fadeInUp}
          transition={{ duration: 0.5, delay: T.cta }}
        >
          <Button size="lg" asChild>
            <a href="#get-started">
              See your assistant in action <span className="ml-1">→</span>
            </a>
          </Button>
        </motion.div>

        {/* ── Microcopy ── */}
        <motion.p
          className="text-xs tracking-wide text-muted-foreground/70"
          {...fadeInUp}
          transition={{ duration: 0.5, delay: T.micro }}
        >
          Setup takes less than 24 hours · No contracts · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
