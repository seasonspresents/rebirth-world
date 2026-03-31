"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RingGuaranteeProps {
  ctaHref?: string;
}

export function RingGuarantee({ ctaHref = "/shop" }: RingGuaranteeProps) {
  return (
    <section className="py-16 md:py-24">
      <motion.div
        className="mx-auto max-w-[700px] px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="size-8 text-primary" />
          </div>
        </div>
        <h2 className="text-fluid-heading font-[family-name:var(--font-display)]">
          100% Satisfaction Guarantee
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] leading-relaxed text-muted-foreground">
          If you&apos;re not completely in love with your ring, we&apos;ll make it right.
          No questions asked. Every ring is backed by our 1-year craftsmanship
          warranty — if anything goes wrong, we repair or replace it.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="px-8">
            <Link href={ctaHref}>Shop Now</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
