"use client";

import Image from "next/image";
import { motion } from "motion/react";

const SPECS = [
  {
    label: "AS Colour Relax Crew",
    detail: "relaxed fit, drop shoulder, crew neck, sleeve cuff ribbing",
  },
  {
    label: "9.4 oz Mid-Weight Fleece",
    detail: "substantial, not flimsy. The right weight for real wear",
  },
  {
    label: "80% Cotton / 20% Recycled Polyester",
    detail: "cotton-facing on fleece for softness",
  },
  {
    label: "Tear-Out Label",
    detail: "clean finish, no scratchy tags against your skin",
  },
  {
    label: "Locally Produced",
    detail: "quality sourcing you can trace",
  },
];

export function SustainabilitySection() {
  return (
    <section style={{ backgroundColor: "#5c6644", padding: "88px 0" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-[72px] items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Conscious Construction
            </span>
            <h2
              className="font-[family-name:var(--font-editorial)] font-bold leading-[1.1] mb-5"
              style={{
                fontSize: "clamp(30px, 4.5vw, 56px)",
                color: "#fff",
              }}
            >
              Clothing That Carries
              <br />
              Its Values Too
            </h2>
            <p
              className="text-[15px] leading-[1.8] mb-7"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              I&apos;m intentional about what I put Rebirth on. The garments I choose
              aren&apos;t picked for margin &mdash; they&apos;re picked because they
              reflect the same values I put into the rings. Quality that lasts.
              Materials that matter. A footprint worth being proud of.
            </p>

            <ul className="mb-7" style={{ listStyle: "none" }}>
              {SPECS.map((spec) => (
                <li
                  key={spec.label}
                  className="flex gap-3 py-3 text-[13px]"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <span
                    className="text-base flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    &#10003;
                  </span>
                  <div>
                    <strong style={{ color: "#fff" }}>{spec.label}</strong>{" "}
                    &mdash; {spec.detail}
                  </div>
                </li>
              ))}
            </ul>

            {/* Highlight stat */}
            <div
              className="flex gap-3.5 items-center p-5"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <div
                className="font-[family-name:var(--font-caps)] text-white leading-none flex-shrink-0"
                style={{ fontSize: 52, letterSpacing: 1 }}
              >
                ~7
              </div>
              <div
                className="text-[13px] leading-[1.5]"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                <strong className="block text-white text-sm mb-[3px]">
                  Plastic Bottles Saved Per Garment
                </strong>
                The recycled polyester content of each crewneck keeps approximately 7
                &times; 500ml plastic bottles out of landfill. Small number. Meaningful
                intention.
              </div>
            </div>
          </motion.div>

          {/* Fabric texture image */}
          <motion.div
            className="hidden md:block relative overflow-hidden"
            style={{ aspectRatio: "3/4" }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src="/images/apparel/c8089c71-b87e-4707-8057-5c02d6277417.webp" alt="Close-up of Rebirth crewneck fabric texture" fill className="object-cover" sizes="50vw" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
