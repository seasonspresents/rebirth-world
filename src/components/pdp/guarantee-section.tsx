"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface PDPGuaranteeSectionProps {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function PDPGuaranteeSection({
  heading = "Our Craftsmanship Guarantee",
  description = "Every Rebirth ring is backed by a 1-year craftsmanship warranty. If something goes wrong — a crack, a loose layer, any defect — we'll repair or replace it, no questions asked. We stand behind every piece that leaves our workshop.",
  ctaText = "Shop Now",
  ctaHref = "/shop",
}: PDPGuaranteeSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[700px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <BackgroundGradient className="rounded-2xl bg-card p-8 text-center md:p-12" animate={false}>
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="text-fluid-heading font-[family-name:var(--font-display)]">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="px-8">
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
            </div>
          </BackgroundGradient>
        </motion.div>
      </div>
    </section>
  );
}
