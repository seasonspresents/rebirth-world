"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface PDPFinalCTAProps {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export function PDPFinalCTA({
  heading = "Find the ring that carries your story",
  description = "Each piece is handcrafted from recycled skateboards in our Mapleton, Utah workshop. No two are alike — yours is waiting.",
  ctaText = "Shop Now",
  ctaHref = "/shop",
  backgroundImage,
}: PDPFinalCTAProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      {/* Background image overlay */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
      )}

      {/* Fallback gradient if no image */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-[var(--rebirth-warm-black)]" />
      )}

      <div className="relative z-10 mx-auto max-w-[700px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-fluid-display text-[var(--rebirth-film-cream)] font-[family-name:var(--font-display)]">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-base leading-relaxed text-[var(--rebirth-film-cream)]/70">
            {description}
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-[var(--rebirth-film-cream)] px-10 text-[var(--rebirth-warm-black)] hover:bg-[var(--rebirth-film-cream)]/90"
            >
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
