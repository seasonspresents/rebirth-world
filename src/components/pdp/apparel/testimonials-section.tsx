"use client";

import { motion } from "motion/react";

interface Testimonial {
  quote: string;
  name: string;
  meta: string;
  hasMedia?: boolean;
  mediaLabel?: string;
}

interface TestimonialsSectionProps {
  variant: "light" | "parchment";
  label: string;
  heading: string;
  subheading?: string;
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  variant,
  label,
  heading,
  subheading,
  testimonials,
}: TestimonialsSectionProps) {
  const bg = variant === "parchment" ? "#ede5d8" : "#f2ece0";

  return (
    <section style={{ backgroundColor: bg, padding: "80px 0" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
            style={{ color: "#c4603a" }}
          >
            {label}
          </span>
          <h2
            className="font-[family-name:var(--font-caps)] tracking-[2px] leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5.5vw, 72px)", color: "#1c1a17" }}
          >
            {heading.split(". ").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 ? "." : ""}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          {subheading && (
            <p className="mt-2" style={{ color: "#9a9186" }}>
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex flex-col gap-3.5 p-6"
              style={{
                border: "1px solid #e6ddd0",
                backgroundColor: "#f2ece0",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {t.hasMedia && (
                <div
                  className="flex items-center justify-center text-xs"
                  style={{
                    aspectRatio: "1",
                    backgroundColor: "#ede5d8",
                    border: "2px dashed #c4603a",
                    color: "#9a9186",
                  }}
                >
                  {t.mediaLabel}
                </div>
              )}
              <div
                style={{ color: "#c4603a", fontSize: 13, letterSpacing: 1.5 }}
              >
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p
                className="italic flex-1 font-[family-name:var(--font-editorial)] text-[15px] leading-[1.7]"
                style={{ color: "#555" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="font-bold text-[13px]">{t.name}</div>
              <div className="text-[11px]" style={{ color: "#9a9186" }}>
                {t.meta}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
