"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function OurStoryContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-grain relative px-6 py-32 md:py-48">
        <div className="relative z-10 mx-auto max-w-[1000px]">
          <motion.p
            className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary font-[family-name:var(--font-dm-mono)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Story
          </motion.p>
          <motion.h1
            className="max-w-[14ch] text-5xl leading-[1.05] tracking-[-0.03em] md:text-7xl lg:text-8xl font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Broken boards.{" "}
            <span className="text-primary">Second chances.</span>
          </motion.h1>
          <motion.p
            className="mt-8 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Rebirth World started with a simple question: what happens to a
            skateboard after it breaks?
          </motion.p>
        </div>
      </section>

      {/* Austrian Heritage */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 font-[family-name:var(--font-dm-mono)]">
              The Beginning
            </p>
            <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
              A jeweler&apos;s son, a skater&apos;s heart
            </h2>
          </motion.div>

          <motion.div
            className="mx-auto mt-8 max-w-[720px] space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              I grew up in two worlds. My father, Christoph Malzl, is a master
              jeweler trained at Koppenwallner&apos;s in Salzburg, Austria — one of
              the most respected workshops in the country. I spent my childhood
              watching him turn raw metal into something people would wear for a
              lifetime.
            </p>
            <p>
              But I was also a skater. While my dad was at his bench, I was at
              the park, learning tricks, breaking boards, and building a
              relationship with a community that would shape everything I do
              today.
            </p>
            <p>
              Those two worlds didn&apos;t collide until I moved from Provo, Utah to
              the North Shore of Oahu. Surrounded by surf, skate, and a creative
              energy I&apos;d never felt before, I started experimenting — and the
              first skateboard ring was born.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Broken Board Moment */}
      <section className="bg-card text-card-foreground px-6 py-20 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 font-[family-name:var(--font-dm-mono)]">
              The Moment
            </p>
            <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
              Seven layers of potential
            </h2>
          </motion.div>

          <motion.div
            className="mx-auto mt-8 max-w-[720px] space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              A skateboard deck is made from seven thin layers of Canadian maple,
              pressed and glued under extreme pressure. Each layer can be dyed a
              different color. When the board breaks, those layers are exposed —
              stripes of color that curve and flow in patterns no machine could
              replicate.
            </p>
            <p>
              I looked at a snapped deck one day and saw something most people
              would throw away. I saw a ring. I took it to my bench, shaped it
              on a lathe, sealed it with CA glue, and slid it on my finger. It
              fit. It looked incredible. And it carried the entire history of
              that board in its grain.
            </p>
            <p>
              That was the moment Rebirth World was born.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 font-[family-name:var(--font-dm-mono)]">
              Community
            </p>
            <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
              Donated by riders. Shaped by hand.
            </h2>
          </motion.div>

          <motion.div
            className="mx-auto mt-8 max-w-[720px] space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              I don&apos;t buy skateboards. Every board in my workshop was donated
              by local skaters on the North Shore. Riders bring me their broken
              decks — boards that carried them through kickflips, grinds, and
              slams — and I give those boards a second life as something they can
              wear every day.
            </p>
            <p>
              There&apos;s a real exchange in that. The board&apos;s story doesn&apos;t end
              when it snaps. It transforms. And the rider who donated it knows
              their board is out there, on someone&apos;s finger, living a new life.
            </p>
            <p>
              This is what Rebirth means to me. Nothing is wasted. Everything has
              the potential to become something more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wedding Bands */}
      <section className="bg-card text-card-foreground px-6 py-20 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 font-[family-name:var(--font-dm-mono)]">
              The Next Chapter
            </p>
            <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
              Wood-lined wedding bands
            </h2>
          </motion.div>

          <motion.div
            className="mx-auto mt-8 max-w-[720px] space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              What started with skateboard rings has grown into something bigger.
              Our premium wedding band line features gold-plated steel shells
              lined with stabilized ancient wood — materials like bog oak
              (wood preserved for thousands of years in peat bogs) and Hawaiian
              koa.
            </p>
            <p>
              These bands are built for everyday wear. The steel shell provides
              strength and structure. The wood liner provides warmth, texture,
              and a connection to the natural world. Together, they create
              something that feels as meaningful as the commitment they
              represent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-grain relative px-6 py-20 md:py-32">
        <div className="relative z-10 mx-auto max-w-[1000px]">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 font-[family-name:var(--font-dm-mono)]">
              Philosophy
            </p>
            <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
              Embrace Change
            </h2>
          </motion.div>

          <motion.div
            className="mx-auto mt-8 max-w-[720px] space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              The lotus grows from mud. A broken board becomes a ring. Change
              isn&apos;t something to resist — it&apos;s the force that creates
              something new.
            </p>
            <p>
              Every piece I make is a reminder of that. When you wear a Rebirth
              ring, you&apos;re wearing a story of transformation. Something
              discarded that became something beautiful. Something broken that
              found a new purpose.
            </p>
            <p>
              That&apos;s what this brand is about. Not just jewelry — a way of
              seeing the world.
            </p>
          </motion.div>

          {/* Sign-off */}
          <motion.div
            className="mx-auto mt-12 max-w-[720px] border-t border-border pt-8"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-base font-medium">
              — Daniel Malzl
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Founder, Rebirth World
              <br />
              North Shore, Oahu, Hawaii
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="mx-auto mt-10 flex max-w-[720px] flex-col items-start gap-4 sm:flex-row"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" asChild>
              <Link href="/shop">
                Browse the collection <span className="ml-1">&rarr;</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://instagram.com/rebirthrings"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="size-4" />
                Follow along
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
