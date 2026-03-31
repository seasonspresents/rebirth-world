"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function PhilosophySection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#1c1a17", padding: "96px 0" }}
    >
      {/* Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap font-[family-name:var(--font-editorial)] font-bold"
        style={{
          fontSize: "clamp(60px, 12vw, 180px)",
          color: "rgba(255,255,255,0.03)",
          letterSpacing: 8,
        }}
      >
        EMBRACE CHANGE
      </div>

      <div className="relative z-[1] mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left: Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="font-[family-name:var(--font-editorial)] italic font-normal leading-[1.25]"
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                color: "#f2ece0",
              }}
            >
              &ldquo;These messages are to be worn as a{" "}
              <em className="not-italic" style={{ color: "#c4603a" }}>
                reminder
              </em>{" "}
              &mdash; for the person wearing, and for everyone who sees it.&rdquo;
            </p>
            <p
              className="font-[family-name:var(--font-editorial)] text-sm italic mt-5"
              style={{ color: "#c4603a" }}
            >
              &mdash; Daniel Malzl, Founder &middot; Rebirth World
            </p>
          </motion.div>

          {/* Right: Why I Make Apparel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Why I Make Apparel
            </span>
            <p className="text-[15px] leading-[1.85] mb-6" style={{ color: "#888" }}>
              Rebirth Apparel carries the deeper message of what Rebirth is about. I
              collaborate with local, talented artists to bring each collection to life
              &mdash; from mat&eacute; gourds to clothing. Every collection represents
              a different theme I&apos;m currently resonating with. A message I&apos;m
              living. Something I want to pass on.
            </p>
            <p className="text-[15px] leading-[1.85] mb-6" style={{ color: "#888" }}>
              These aren&apos;t basics. They&apos;re not trend pieces. Each collection
              is one of a kind &mdash; released once, for that season, for that
              chapter. When it sells out, it doesn&apos;t come back. The design, the
              story, and the moment belong to that drop.
            </p>
            <p className="text-[15px] leading-[1.85] mb-6" style={{ color: "#888" }}>
              My goal is simple: put something on your body that reminds you &mdash;
              and everyone around you &mdash; to embrace the change, enjoy the ride,
              and keep stepping into who you&apos;re becoming.
            </p>
            <Link
              href="/shop?collection=apparel"
              className="inline-flex items-center justify-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 mt-2 transition-all hover:bg-white/[0.08]"
              style={{
                border: "2px solid rgba(255,255,255,0.35)",
                color: "#fff",
              }}
            >
              SEE THE COLLECTIONS
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
