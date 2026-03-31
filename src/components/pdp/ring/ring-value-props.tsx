"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ValuePropBlockProps {
  theme?: string;
  eyebrow?: string;
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
  benefits?: string[];
  reversed?: boolean;
  ctaHref?: string;
}

export function ValuePropBlock({
  theme = "section-warm",
  eyebrow,
  heading,
  body,
  image,
  imageAlt = "",
  benefits,
  reversed = false,
  ctaHref = "/shop",
}: ValuePropBlockProps) {
  return (
    <section /* no data-section-theme to avoid SectionColorBlender ScrollTrigger conflict */ className={`${theme} bg-grain py-16 md:py-24 lg:py-32`}>
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
          >
            {image ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/30">
                <Image src={image} alt={imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-muted/30 text-sm text-muted-foreground">
                {imageAlt || "Photography placeholder"}
              </div>
            )}
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: LUXURY_EASE }}
          >
            {eyebrow && (
              <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-section-accent font-[family-name:var(--font-dm-mono)]">
                {eyebrow}
              </p>
            )}
            <h2 className="text-fluid-heading font-[family-name:var(--font-display)]">
              {heading}
            </h2>
            <p className="mt-4 max-w-[48ch] leading-relaxed text-section-muted">
              {body}
            </p>

            {benefits && benefits.length > 0 && (
              <ul className="mt-6 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-section-accent/10">
                      <Check className="size-3 text-section-accent" />
                    </div>
                    <span className="text-sm leading-relaxed text-section-muted">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <Button asChild size="lg" className="px-8">
                <Link href={ctaHref}>Shop Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
