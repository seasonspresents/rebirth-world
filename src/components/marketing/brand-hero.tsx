"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { Magnetic } from "@/components/ui/magnetic";
import { ParallaxLayer } from "@/components/ui/parallax-layer";

export function BrandHero() {
  return (
    <section className="section-warm bg-grain relative overflow-hidden px-6 py-32 md:py-48 lg:py-56">
      {/* Teal particles — subtle, fewer, larger — floats slower for depth */}
      <ParallaxLayer speed={-0.3} className="absolute inset-0">
        <Particles
          className="pointer-events-none absolute inset-0"
          quantity={20}
          color="#2a9d8f"
          size={0.6}
          staticity={60}
          ease={50}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={-0.1} className="relative z-10 mx-auto max-w-[1200px]">
        <motion.p
          className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary font-[family-name:var(--font-dm-mono)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Handcrafted from recycled skateboards
        </motion.p>

        <motion.h1
          className="text-mega max-w-[14ch]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Broken boards,{" "}
          <em className="not-italic text-primary">reborn</em>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-[48ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Local skaters donate their broken decks. Daniel shapes them by hand in
          his North Shore workshop — seven layers of maple, sanded, sealed, and
          turned into rings you&apos;ll never want to take off.
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Magnetic strength={0.25}>
            <Button asChild className="px-8 py-4 text-base">
              <Link href="/shop">
                Browse the collection <span className="ml-1">&rarr;</span>
              </Link>
            </Button>
          </Magnetic>
        </motion.div>
      </ParallaxLayer>
    </section>
  );
}
