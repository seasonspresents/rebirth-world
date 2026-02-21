"use client";

import { motion } from "motion/react";
import { Marquee } from "@/components/ui/marquee";

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

const firstRow = testimonials.slice(0, 3);
const secondRow = testimonials.slice(3);

function TestimonialCard({ quote, name, detail }: (typeof testimonials)[0]) {
  return (
    <div className="min-w-[350px] max-w-[450px] rounded-xl bg-card/50 p-8 md:min-w-[450px]">
      <p className="text-lg leading-relaxed md:text-xl">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6">
        <p className="font-medium">{name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground font-[family-name:var(--font-dm-mono)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-grain py-24 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.h2
          className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Worn with pride, made with purpose
        </motion.h2>
      </div>

      <div className="relative mt-12 md:mt-16">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <Marquee pauseOnHover className="[--duration:45s] [--gap:1.5rem]">
          {firstRow.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </Marquee>

        <Marquee
          reverse
          pauseOnHover
          className="mt-6 [--duration:45s] [--gap:1.5rem]"
        >
          {secondRow.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
