"use client";

import Image from "next/image";
import { motion } from "motion/react";

const ITEMS = [
  {
    icon: "🪡",
    title: "Shoulder Bags",
    desc: "Handwoven with traditional Mayan patterns and natural dyes from the region",
  },
  {
    icon: "🧣",
    title: "Table Runners",
    desc: "Backstrap-loom woven textiles \u2014 each one carrying the weaver\u2019s individual touch",
  },
  {
    icon: "👗",
    title: "Huipiles & Fabrics",
    desc: "Traditional woven garments from the Tz\u2019utujil tradition of Lake Atitl\u00e1n",
  },
];

export function TejidosSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2e2a24", padding: "96px 0" }}
    >
      {/* Cross-hatch pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(196,96,58,0.05) 40px,rgba(196,96,58,0.05) 41px),repeating-linear-gradient(-45deg,transparent,transparent 40px,rgba(92,102,68,0.05) 40px,rgba(92,102,68,0.05) 41px)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-[72px] items-center">
          {/* Images */}
          <motion.div
            className="grid grid-cols-2 gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="col-span-2 relative overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              <Image src="/images/tejidos/daniel-with-women.webp" alt="Daniel standing with the Mayan women of San Lucas Tolimán, Guatemala" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "1" }}
            >
              <Image src="/images/tejidos/weaving-closeup.webp" alt="Mayan woman weaving on backstrap loom — close-up of hands and textile" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "1" }}
            >
              <Image src="/images/tejidos/weaving-backstrap-loom.webp" alt="Mayan woman weaving traditional textile on backstrap loom by Lake Atitlán" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
              style={{ color: "#c4603a" }}
            >
              Collaboration
            </span>
            <h2
              className="font-[family-name:var(--font-editorial)] italic font-semibold leading-[1.15] mb-5"
              style={{
                fontSize: "clamp(28px, 4vw, 50px)",
                color: "#f2ece0",
              }}
            >
              Rebirth &times;{" "}
              <em className="not-italic" style={{ color: "#c4603a" }}>
                Tejidos de Santiagitos
              </em>
            </h2>
            <p className="text-sm leading-[1.85] mb-5" style={{ color: "#999" }}>
              During my service mission in Guatemala, I found myself beside Lake
              Atitl&aacute;n &mdash; one of the most beautiful places on earth. In San
              Lucas Tolim&aacute;n, I connected with an extraordinary group of Mayan
              women whose hands weave stories into fabric the way I shape stories into
              rings. This collaboration was born out of that connection.
            </p>
            <p className="text-sm leading-[1.85] mb-5" style={{ color: "#999" }}>
              This was a non-profit collection. Every piece was handwoven by these
              incredible women. The proceeds went directly back to support them and
              their community. It wasn&apos;t about product &mdash; it was about
              showing up for people who show up for each other.
            </p>

            <ul className="mb-7" style={{ listStyle: "none" }}>
              {ITEMS.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-3 py-3 text-[13px]"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    color: "#aaa",
                  }}
                >
                  <span
                    className="text-base flex-shrink-0 mt-px"
                    style={{ color: "#c4603a" }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <strong
                      className="block mb-[3px]"
                      style={{ color: "#f2ece0" }}
                    >
                      {item.title}
                    </strong>
                    <span>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div
              className="text-[13px] italic leading-[1.6] p-3.5 pl-4"
              style={{
                backgroundColor: "rgba(196,96,58,0.12)",
                borderLeft: "3px solid #c4603a",
                color: "#bbb",
              }}
            >
              &ldquo;It was part art, part service, part love &mdash; for the people
              and the place. These women don&apos;t just weave fabric. They weave
              culture, community, and meaning into everything they make. Working
              alongside them was one of the great honors of my life.&rdquo;
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
