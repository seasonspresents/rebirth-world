"use client";

import { motion } from "motion/react";

const testimonials = [
  {
    quote:
      "I told my wife the ring on my finger used to be a skateboard and she didn't believe me until she saw the layers. The colors in the wood are unreal.",
    name: "Marcus T.",
    detail: "Skateboard ring, size 10",
  },
  {
    quote:
      "Got this as a gift for my husband — he's skated for 20 years and teared up when he realized it was made from an actual deck. He hasn't taken it off.",
    name: "Sarah K.",
    detail: "Gift purchase",
  },
  {
    quote:
      "We wanted wedding bands that actually meant something. The bog oak and steel bands are stunning and people always ask about them. Worth every penny.",
    name: "Lena & James R.",
    detail: "Wedding band pair",
  },
  {
    quote:
      "The engraving was perfect and the ring fits like a glove. You can see the seven layers of maple — each one a different color. Truly one of a kind.",
    name: "Chris W.",
    detail: "Engraved skateboard ring",
  },
  {
    quote:
      "I've bought from a lot of 'sustainable' brands but Rebirth is the real deal. You can tell Daniel actually makes these by hand. The quality is next level.",
    name: "Priya S.",
    detail: "Repeat customer",
  },
  {
    quote:
      "Sized up like the guide suggested and it's perfect. The wood grain pattern is completely unique — no two are alike. Already planning my next order.",
    name: "Jake D.",
    detail: "Skateboard ring, size 12",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          className="mx-auto mb-14 max-w-[480px] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            From our community
          </p>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] leading-[1.15] tracking-tight font-[family-name:var(--font-display)]">
            Worn with pride, made with purpose
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
            >
              <p className="flex-1 text-sm leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
