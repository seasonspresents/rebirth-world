"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Hammer, Instagram, Recycle, Shield } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

const storyBeats = [
  {
    eyebrow: "Salzburg",
    title: "Old-world jewelry was the first language in the room.",
    body: "Daniel Malzl grew up around benches, torches, raw sheet metal, wire, and the quiet patience of fine jewelry. His father, Christoph Malzl, trained as an Austrian master jeweler at Koppenwallner's in Salzburg, a historic shop tied to jewels made for the Austrian emperor. That six-year apprenticeship taught fabrication by hand, not shortcuts.",
    image: "/images/people/malzl007910-r1-021-9.webp",
    alt: "Daniel Malzl working with jewelry materials",
  },
  {
    eyebrow: "Skate origin",
    title: "The other classroom was concrete.",
    body: "Daniel came at that lineage through skate culture. Broken decks stacked up after sessions because throwing them away never felt right. The seven dyed maple layers inside each board held color, impact, place, and memory.",
    image: "/images/rebirth-2026/rebirth-1-3.webp",
    alt: "Rebirth skateboard ring materials and color layers",
  },
  {
    eyebrow: "North Shore",
    title: "A snapped board became the first proof.",
    body: "After years in Utah's skate and jewelry circles, Daniel's path carried him to the North Shore of Oahu, where surf, skate, family, and handwork overlap naturally. One broken deck became an experiment at the bench. Then a ring. Then a philosophy.",
    image: "/images/people/daniel-workshop.webp",
    alt: "Daniel in the Rebirth workshop",
  },
];

const processSteps = [
  {
    icon: Recycle,
    title: "Collect the boards",
    body: "Local riders donate decks with real history: grip lines, pressure cracks, color, and scar tissue from the session.",
    image: "/images/rebirth-2026/rebirth-1-6.webp",
  },
  {
    icon: Hammer,
    title: "Cut into the color",
    body: "The board is opened up so the seven maple layers become visible. The palette is already inside the material.",
    image: "/images/products/atitlan-recycled-skateboard-ring/main.webp",
  },
  {
    icon: Shield,
    title: "Turn, shape, seal",
    body: "Each ring is shaped by hand, sanded smooth, and sealed for everyday wear without erasing the board's story.",
    image: "/images/wedding-bands/floral-bloom/upclose-.webp",
  },
  {
    icon: ArrowUpRight,
    title: "Send it into a new life",
    body: "What was headed for the trash becomes something personal enough to wear daily or meaningful enough for a wedding band.",
    image: "/images/people/men-wedding-ring.webp",
  },
];

const materials = [
  {
    name: "Recycled skateboard maple",
    detail:
      "Canadian maple, seven layers, donated by skaters after the board has lived its first life.",
    image: "/images/products/powerlines-recycled-skateboard-rings/main.webp",
  },
  {
    name: "Ancient bog oak",
    detail:
      "Dark, time-rich wood preserved in peat for thousands of years, used in select wedding band liners.",
    image: "/images/wedding-bands/the-ocean-breeze-mens-wedding-band/main.webp",
  },
  {
    name: "Hawaiian koa",
    detail:
      "Warm figured wood connected to the islands and the North Shore chapter of the brand.",
    image: "/images/wedding-bands/spalted-maple-burl/hand-lifestyle-shot-.webp",
  },
  {
    name: "Steel and gold-plated shells",
    detail:
      "Structure for the premium band line: durable outside, wood warmth against the finger.",
    image: "/images/wedding-bands/red-amboyna-burl/red-amboyna-main.webp",
  },
];

const impactNumbers = [
  { value: "1,000+", label: "customers wearing Rebirth pieces" },
  { value: "7", label: "maple layers reborn in each skateboard ring" },
  { value: "100%", label: "handmade by Daniel, one at a time" },
  { value: "1 yr", label: "craftsmanship warranty" },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export function OurStoryContent() {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : {
        ...fadeUp,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <>
      <section className="relative h-[82vh] min-h-[560px] overflow-hidden bg-[#171512] text-white">
        <h1 className="sr-only">Our Story</h1>
        <Image
          src="/images/people/daniel-workshop.webp"
          alt="Daniel Malzl working in the Rebirth workshop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/55" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8">
          <div className="mx-auto flex max-w-[1200px] items-end justify-between gap-6">
            <p className="max-w-[42ch] text-sm leading-relaxed text-white/82 md:text-base">
              Daniel at the bench. A broken board nearby. The whole brand lives
              somewhere between those two things.
            </p>
            <p className="hidden font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.18em] text-white/70 uppercase md:block">
              Rebirth World / Mapleton + North Shore
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background text-foreground px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <motion.div {...motionProps}>
            <p className="label-luxury text-muted-foreground">Origin</p>
            <h2 className="mt-3 max-w-[11ch] font-[family-name:var(--font-display)] text-5xl leading-[0.98] font-semibold md:text-7xl">
              Broken boards. Old-world hands.
            </h2>
          </motion.div>
          <motion.div
            {...motionProps}
            className="text-muted-foreground space-y-5 text-base leading-relaxed md:text-lg"
          >
            <p>
              Rebirth is not a recycling slogan. It is Daniel Malzl&apos;s way
              of seeing material, memory, and change. His father&apos;s Austrian
              jewelry lineage gave him respect for craft. Skateboarding gave him
              the broken decks. Life gave him the reason to put those worlds
              together.
            </p>
            <p>
              Every piece starts with the belief that something can be damaged
              without being done. A board snaps. The ride is over. Then the
              layers open up and a different story begins.
            </p>
            <p>
              That is the Rebirth philosophy in its simplest form: Embrace
              Change.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#1d2825] text-white">
        {storyBeats.map((beat, index) => (
          <div
            key={beat.title}
            className="grid min-h-[80vh] border-t border-white/10 md:grid-cols-2"
          >
            <div
              className={`relative min-h-[340px] overflow-hidden ${
                index % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              <Image
                src={beat.image}
                alt={beat.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center px-6 py-14 md:px-14 lg:px-20">
              <motion.div {...motionProps} className="max-w-[620px]">
                <p className="font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.22em] text-[#d69a59] uppercase">
                  {beat.eyebrow}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-[1.08] font-semibold md:text-5xl">
                  {beat.title}
                </h3>
                <p className="mt-6 text-base leading-relaxed text-white/76 md:text-lg">
                  {beat.body}
                </p>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-[#f5efe5] px-6 py-16 text-[#1c1a17] md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div {...motionProps} className="max-w-[760px]">
            <p className="label-luxury text-[#7c6d5a]">Process</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.02] font-semibold md:text-6xl">
              Not manufactured. Carried through the hands.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  {...motionProps}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 0.6,
                          delay: index * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }
                  }
                  className="overflow-hidden rounded-lg border border-[#d9cdbd] bg-white/58"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={step.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[#8b7b67]">
                        0{index + 1}
                      </span>
                      <Icon className="size-5 text-[#2d8a7e]" />
                    </div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#62594d]">
                      {step.body}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background text-foreground px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            {...motionProps}
            className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end"
          >
            <div>
              <p className="label-luxury text-muted-foreground">Materials</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.02] font-semibold md:text-6xl">
                Materials with a past.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-[56ch] text-base leading-relaxed md:text-lg">
              Rebirth pieces do not try to hide where they came from. The color
              layers, wood grain, scuffs, and source stories are the point.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((material) => (
              <motion.article
                key={material.name}
                {...motionProps}
                className="group bg-card text-card-foreground overflow-hidden rounded-lg border"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={material.image}
                    alt={material.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                    {material.name}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {material.detail}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111817] px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div {...motionProps} className="max-w-[720px]">
            <p className="font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.22em] text-[#d69a59] uppercase">
              Impact
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.02] font-semibold md:text-6xl">
              Small objects. Long memory.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactNumbers.map((item) => (
              <motion.div
                key={item.label}
                {...motionProps}
                className="border border-white/14 p-6"
              >
                <p className="font-[family-name:var(--font-caps)] text-5xl leading-none text-[#d69a59] md:text-6xl">
                  {item.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/72">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe5] px-6 py-16 text-[#1c1a17] md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <motion.div {...motionProps} className="relative aspect-[4/5]">
            <Image
              src="/images/people/fullsizerender.webp"
              alt="Daniel Malzl, founder of Rebirth World"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="rounded-lg object-cover"
            />
          </motion.div>
          <motion.div {...motionProps}>
            <p className="label-luxury text-[#7c6d5a]">Daniel Malzl</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.04] font-semibold md:text-6xl">
              One maker, a circle of riders, and pieces that still feel human.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[#62594d] md:text-lg">
              <p>
                Rebirth is Daniel&apos;s personal work: Austrian-American
                jewelry heritage, a skater&apos;s instinct to keep the good
                stuff from being wasted, and a philosophy shaped by faith,
                family, service, and the practice of starting again.
              </p>
              <p>
                The wider team is the community around the bench: skaters who
                donate broken boards, people who wear the pieces through their
                own chapters, and collaborators who keep the brand close to real
                life instead of corporate polish.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/shop">Shop the collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://instagram.com/rebirthrings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Instagram className="size-4" />
                  Follow along
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
