"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

export function BrandHero() {
  return (
    <section className="bg-grain relative overflow-hidden px-6 py-28 md:py-36">
      {/* Teal particles */}
      <Particles
        className="pointer-events-none absolute inset-0"
        quantity={40}
        color="#2a9d8f"
        size={0.4}
        staticity={60}
        ease={50}
      />

      <div className="relative z-10 mx-auto max-w-[800px] text-center">
        <motion.p
          className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-primary font-[family-name:var(--font-dm-mono)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Handcrafted from recycled skateboards
        </motion.p>

        <motion.h1
          className="text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] tracking-tight font-[family-name:var(--font-display)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Broken boards,{" "}
          <em className="not-italic text-primary">reborn</em>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Local skaters donate their broken decks. Daniel shapes them by hand in
          his North Shore workshop — seven layers of maple, sanded, sealed, and
          turned into rings you&apos;ll never want to take off.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button size="lg" asChild>
            <Link href="/shop">
              Browse the collection <span className="ml-1">&rarr;</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/our-story">Our story</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
