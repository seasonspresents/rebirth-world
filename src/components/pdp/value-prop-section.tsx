"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ValuePropSectionProps {
  heading: string;
  description: string;
  image?: string;
  imageAlt?: string;
  benefits?: string[];
  ctaText?: string;
  ctaHref?: string;
  reversed?: boolean;
}

export function ValuePropSection({
  heading,
  description,
  image,
  imageAlt = "Product benefit",
  benefits,
  ctaText = "Shop Now",
  ctaHref = "/shop",
  reversed = false,
}: ValuePropSectionProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div
          className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-20 ${
            reversed ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {image ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/30">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                Image or video
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-fluid-heading font-[family-name:var(--font-display)]">
              {heading}
            </h2>
            <p className="mt-4 max-w-[48ch] leading-relaxed text-muted-foreground">
              {description}
            </p>

            {benefits && benefits.length > 0 && (
              <ul className="mt-6 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <Button asChild size="lg" className="px-8">
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
