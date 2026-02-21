"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

export function CTA() {
  return (
    <section id="cta" className="px-6 py-24">
      <motion.div
        className="mx-auto max-w-[660px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Radial amber glow behind card */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(224,138,48,0.12)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(224,138,48,0.18)_0%,transparent_65%)]" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-10 py-14 text-center">
            {/* Floating particles */}
            <Particles
              className="pointer-events-none absolute inset-0"
              quantity={30}
              color="#e08a30"
              size={0.3}
              staticity={70}
              ease={60}
            />

            {/* Grain texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.12] tracking-tight font-[family-name:var(--font-display)]">
                What if you were actually{" "}
                <em className="text-accent">home for dinner</em> tonight?
              </h2>
              <p className="mx-auto mb-8 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
                You became a jewelry designer for the freedom to create — not to
                answer DMs from the dinner table while your family waits. Rebirth
                handles every message, text, and missed call so you can be
                present for the people and the work that actually matter.
              </p>
              <Button
                size="lg"
                asChild
              >
                <a href="#pricing">
                  Get your time back <span className="ml-1">→</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
