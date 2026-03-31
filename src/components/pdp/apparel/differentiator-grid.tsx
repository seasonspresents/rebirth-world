"use client";

import { motion } from "motion/react";
import Link from "next/link";

const DIFFS = [
  {
    icon: "🎨",
    title: "Collaborative by Nature",
    body: "I work with local, talented artists on every collection. The designs aren\u2019t produced in isolation \u2014 they\u2019re born from real relationships and real creative conversations.",
  },
  {
    icon: "\u2702\ufe0f",
    title: "One Season, One Story",
    body: "Each collection represents a theme I\u2019m currently resonating with. When the season ends, that drop ends. It doesn\u2019t come back. You\u2019re not buying inventory \u2014 you\u2019re buying a moment.",
  },
  {
    icon: "💬",
    title: "Messages Worth Wearing",
    body: "From mat\u00e9 gourds to clothing \u2014 every Rebirth piece carries a message that can be in service of whatever chapter the wearer is in. Not decoration. Intention.",
  },
  {
    icon: "🌿",
    title: "Eco-Conscious Construction",
    body: "I use locally produced clothing that\u2019s quality, comfortable, and thoughtful. Recycled polyester content. Cotton-facing. Materials selected with the same care I put into the rings.",
  },
  {
    icon: "🤝",
    title: "Community Is the Foundation",
    body: "From woven pieces made alongside the Mayan women of Lake Atitl\u00e1n, to local artist collaborations \u2014 service and community aren\u2019t marketing. They\u2019re how I operate.",
  },
  {
    icon: "🪷",
    title: "Part of a Bigger Philosophy",
    body: "Rebirth Apparel isn\u2019t separate from Rebirth Rings. It\u2019s the same philosophy \u2014 embracing change, honoring the journey, wearing your values \u2014 just in a different form.",
  },
];

export function DifferentiatorGrid() {
  return (
    <section style={{ backgroundColor: "#f2ece0", padding: "80px 0" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center mb-[52px]">
          <span
            className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-3"
            style={{ color: "#c4603a" }}
          >
            Why It&apos;s Different
          </span>
          <h2
            className="font-[family-name:var(--font-caps)] tracking-[2px] leading-[1.05]"
            style={{
              fontSize: "clamp(36px, 5.5vw, 72px)",
              color: "#1c1a17",
            }}
          >
            NOT ANOTHER
            <br />
            BRAND TEE
          </h2>
          <p className="mt-2.5" style={{ color: "#9a9186" }}>
            There&apos;s a difference between wearing a logo and wearing a message.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[22px] mb-10">
          {DIFFS.map((d, i) => (
            <motion.div
              key={d.title}
              className="p-[26px] transition-all hover:shadow-[0_4px_24px_rgba(196,96,58,0.08)]"
              style={{
                border: "1px solid #e6ddd0",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="text-[28px] mb-3">{d.icon}</div>
              <div className="font-bold text-sm mb-2">{d.title}</div>
              <div
                className="text-xs leading-[1.65]"
                style={{ color: "#9a9186" }}
              >
                {d.body}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-2">
          <Link
            href="#"
            className="inline-flex items-center justify-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 transition-all hover:-translate-y-px"
            style={{ backgroundColor: "#1c1a17", color: "#f2ece0" }}
          >
            SHOP CURRENT DROP
          </Link>
        </div>
      </div>
    </section>
  );
}
