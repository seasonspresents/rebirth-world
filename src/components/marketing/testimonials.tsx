"use client";

import { motion } from "motion/react";

const testimonials = [
  {
    quote:
      "The ring is stunning. My partner cried when I told him it was made from recycled ocean metal. The story behind it made the proposal even more meaningful.",
    name: "Sarah M.",
    detail: "Purchased the Tidepool Ring",
  },
  {
    quote:
      "I've never gotten so many compliments on a piece of jewelry. The craftsmanship is incredible — you can feel the weight and care in every detail.",
    name: "James K.",
    detail: "Purchased the Driftwood Band",
  },
  {
    quote:
      "I wanted something unique for our anniversary. The engraving option made it personal, and knowing it's handmade from reclaimed materials makes it truly one-of-a-kind.",
    name: "Lena R.",
    detail: "Purchased the Ember Necklace",
  },
  {
    quote:
      "Fast shipping, beautiful packaging, and the ring itself exceeded my expectations. It's become my everyday wear — I never take it off.",
    name: "Marcus T.",
    detail: "Purchased the Carbon Ring",
  },
  {
    quote:
      "I've bought from a lot of sustainable brands, but Rebirth is different. You can tell these are made by someone who genuinely cares about their craft.",
    name: "Priya S.",
    detail: "Repeat customer",
  },
  {
    quote:
      "My size 12 ring fits perfectly. I was nervous ordering online but the sizing guide was spot on. Will definitely be back for more pieces.",
    name: "Daniel W.",
    detail: "Purchased the Ironwood Band",
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
