"use client";

import { motion } from "motion/react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-[92vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[var(--rebirth-warm-black)]">
      {/* Radial gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(42,157,143,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 90% 20%, rgba(224,122,58,0.09) 0%, transparent 55%)",
        }}
      />

      {/* Left: Content */}
      <div className="relative z-10 flex flex-col justify-center px-5 py-12 md:py-20 md:pl-6 md:pr-14 md:ml-auto md:max-w-[640px]">
        {/* Social Proof #1 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-7 flex flex-wrap items-center gap-2.5"
        >
          <span className="text-[var(--rebirth-amber)] text-sm tracking-wider">
            ★★★★★
          </span>
          <span className="text-xs text-white/50">
            4.9/5 · 1,000+ customers worldwide
          </span>
          <span className="h-3.5 w-px bg-white/15" />
          <span className="rounded-none border border-[rgba(42,157,143,0.3)] bg-[rgba(42,157,143,0.15)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--rebirth-teal)]">
            Eco-Conscious
          </span>
          <span className="rounded-none border border-[rgba(42,157,143,0.3)] bg-[rgba(42,157,143,0.15)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--rebirth-teal)]">
            Handmade in Utah
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-4 font-[family-name:var(--font-serif)] text-[clamp(40px,6vw,80px)] font-bold italic leading-[1.05] text-[var(--rebirth-film-cream)]"
        >
          Stop Wearing
          <br />
          <em className="not-italic text-[var(--rebirth-teal)]">
            Someone Else&apos;s
          </em>
          <br />
          Story.
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-7 max-w-[480px] text-base leading-[1.75] text-white/65"
        >
          I make handmade rings from broken skateboards donated by the local
          community — and limited apparel drops that carry deeper messages. Every
          piece is one of a kind. Every piece means something.{" "}
          <strong className="text-white/85">Embrace Change.</strong>
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <Link
            href="/shop?collection=wedding-bands"
            className="inline-flex items-center justify-center gap-2 bg-[var(--rebirth-teal)] px-12 py-5 font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e]"
          >
            SHOP RINGS
          </Link>
          <Link
            href="/shop?collection=apparel"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 bg-transparent px-9 py-4 font-[family-name:var(--font-caps)] text-[17px] tracking-[2.5px] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/[0.08]"
          >
            SHOP APPAREL
          </Link>
        </motion.div>

        {/* FUD reducers */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-6 md:gap-5"
        >
          {[
            { icon: "🚚", text: "Free US Shipping $75+" },
            { icon: "🔁", text: "30-Day Returns" },
            { icon: "🛡️", text: "1-Year Warranty" },
            { icon: "✍️", text: "Free Engraving" },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 text-xs text-white/40"
            >
              <span className="text-sm">{item.icon}</span> {item.text}
            </span>
          ))}
        </motion.div>

        {/* Social Proof #2 — Stat bar */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-7 flex flex-wrap items-center gap-4 border border-white/[0.08] bg-white/[0.04] p-4 md:px-5"
        >
          <div>
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-wider text-[var(--rebirth-teal)]">
              1,000+
            </div>
            <div className="max-w-[180px] text-xs leading-snug text-white/45">
              rings &amp; pieces shipped to customers worldwide
            </div>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div>
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-wider text-[var(--rebirth-teal)]">
              14
            </div>
            <div className="max-w-[180px] text-xs leading-snug text-white/45">
              years of craft — started making rings at age 14
            </div>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div>
            <div className="font-[family-name:var(--font-caps)] text-4xl leading-none tracking-wider text-[var(--rebirth-teal)]">
              100%
            </div>
            <div className="max-w-[180px] text-xs leading-snug text-white/45">
              handmade — no factories, no shortcuts
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Hero Media */}
      <div className="relative z-10 flex items-stretch min-h-[260px] md:min-h-[500px]">
        <div className="relative w-full bg-[#111] flex items-center justify-center flex-col text-center">
          <div className="text-6xl mb-2">💍</div>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--rebirth-film-cream)]">
            Hero Visual
          </div>
          <p className="mt-2 max-w-[260px] px-3 text-[11px] leading-snug text-[#8a8578]">
            Autoplay looping video — Daniel&apos;s hands making a ring, or a
            ring in an evocative setting. This is the single most important
            visual asset on the site.
          </p>

          {/* Buying dimensions overlay */}
          <div className="absolute bottom-8 left-5 right-5 z-[3] hidden border border-white/[0.08] bg-[rgba(26,26,26,0.88)] p-4 backdrop-blur-sm md:block">
            <div className="mb-2.5 text-[9px] font-bold uppercase tracking-[2.5px] text-[var(--rebirth-teal)]">
              Why people buy Rebirth
            </div>
            <div className="flex gap-4">
              {[
                {
                  label: "Functional",
                  text: "A ring that's built to last and unlike anything else in the market",
                },
                {
                  label: "Emotional",
                  text: "A reminder to embrace change and step into the next chapter",
                },
                {
                  label: "Social",
                  text: "A conversation starter that reflects your values, story, and culture",
                },
              ].map((dim) => (
                <div key={dim.label} className="flex-1">
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    {dim.label}
                  </div>
                  <div className="text-[11px] leading-snug text-white/75">
                    {dim.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
