"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MakingOf() {
  return (
    <section className="py-16 md:py-24 lg:py-32" style={{ backgroundColor: "var(--apparel-parchment)", color: "var(--apparel-charcoal)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex aspect-[4/5] items-center justify-center rounded-2xl p-8 text-center text-xs" style={{ backgroundColor: "var(--apparel-linen)", opacity: 0.6 }}>
              Local artist collaboration process — design sketches, printing setup, finished garments on hangers
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] font-[family-name:var(--font-dm-mono)]" style={{ color: "var(--apparel-olive)" }}>
              The Making Of
            </p>
            <h2 className="text-fluid-heading font-[family-name:var(--font-editorial)] font-semibold">
              One artist. One theme. One run.
            </h2>
            <p className="mt-4 max-w-[48ch] leading-relaxed" style={{ opacity: 0.7 }}>
              Each apparel collection is designed with a local artist, tied to a current
              theme, and limited to a single production run. When it&apos;s gone, it&apos;s gone.
              No restocks, no reprints. That&apos;s the point.
            </p>
            <p className="mt-4 max-w-[48ch] leading-relaxed" style={{ opacity: 0.7 }}>
              I believe clothing should carry meaning — not just a logo. Every piece tells
              a story that connects to where I am right now in life.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" style={{ backgroundColor: "var(--apparel-clay)", color: "white" }}>
                <Link href="/shop?collection=apparel">Shop All Apparel</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
