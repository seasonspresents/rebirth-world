"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/payments/constants";
import { formatPrice } from "@/lib/payments/constants";

interface CollectionGridProps {
  product: Product;
}

const COLLECTIONS = [
  {
    season: "Spring 2026 \u00b7 Limited Drop",
    name: "A1\u2013B2: Bless What Is Breaking",
    theme:
      "Born from insights received over years of real people and real life experiences. Brought to life on a 90s inspired house record. Each piece is a track. Each track is a message. Wear it like you mean it.",
    status: "live" as const,
    statusText: "\u25cf Available Now",
    price: "$68",
    badge: "\u25cf Live Now",
    badgeBg: "#c4603a",
  },
  {
    season: "Fall 2025 \u00b7 Sold Out",
    name: "Rebirth Flower Tee",
    theme:
      "Born from the inner shifts I experienced while traveling Latin America. Each flower carries a dual meaning \u2014 a reflection of the rebirths we go through in life, and a celebration of the diverse cultures that remind us we are all connected. Different in expression, yet rooted in the same source.",
    status: "sold" as const,
    statusText: "\u2726 Sold Out \u2014 Join Waitlist",
    price: "$45",
    badge: "Sold Out",
    badgeBg: "#9a9186",
  },
  {
    season: "Summer 2026 \u00b7 Dropping Soon",
    name: "Untitled Summer Drop",
    theme:
      "Theme in progress \u2014 I\u2019m living it before I put it on a garment. That\u2019s how these always start. Join the list and you\u2019ll be the first to know when it\u2019s ready.",
    status: "coming" as const,
    statusText: "\u25ce Join the Waitlist",
    badge: "Coming Soon",
    badgeBg: "#1c1a17",
  },
];

export function CollectionGrid({ product }: CollectionGridProps) {
  return (
    <section
      className="py-[88px] md:py-[88px]"
      style={{
        backgroundColor: "#ede5d8",
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(196,96,58,0.04) 30px,rgba(196,96,58,0.04) 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(196,96,58,0.04) 30px,rgba(196,96,58,0.04) 31px)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <span
            className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-2.5"
            style={{ color: "#c4603a" }}
          >
            All Drops
          </span>
          <h2
            className="font-[family-name:var(--font-caps)] tracking-[2px] leading-[1.05] mb-2.5"
            style={{
              fontSize: "clamp(36px, 5.5vw, 72px)",
              color: "#1c1a17",
            }}
          >
            EVERY COLLECTION
            <br />
            TELLS A STORY
          </h2>
          <p
            className="text-[15px] mx-auto"
            style={{ color: "#9a9186", maxWidth: 560 }}
          >
            Each drop is a one-of-a-kind seasonal release tied to a theme
            I&apos;m living. Once it&apos;s gone, it&apos;s gone. These are
            chapters &mdash; not catalog items.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
          {COLLECTIONS.map((coll, i) => (
            <motion.div
              key={coll.name}
              className="overflow-hidden transition-all hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(28,26,23,0.1)]"
              style={{
                backgroundColor: "#f2ece0",
                border: "1px solid #e6ddd0",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Image */}
              <div className="relative" style={{ aspectRatio: "3/4" }}>
                <div
                  className="w-full h-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor:
                      coll.status === "coming" ? "#e6ddd0" : "#ede5d8",
                    color: "#9a9186",
                  }}
                >
                  {coll.status === "coming"
                    ? "Coming Soon"
                    : "Collection Shot"}
                </div>
                <div className="absolute top-3.5 left-3.5 z-[2]">
                  <span
                    className="text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-1 text-white"
                    style={{ backgroundColor: coll.badgeBg }}
                  >
                    {coll.badge}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-[22px]">
                <div
                  className="text-[10px] font-bold tracking-[2px] uppercase mb-1.5"
                  style={{ color: "#c4603a" }}
                >
                  {coll.season}
                </div>
                <div
                  className="font-[family-name:var(--font-editorial)] text-[22px] font-bold leading-[1.2] mb-2"
                  style={{ color: "#1c1a17" }}
                >
                  {coll.name}
                </div>
                <div
                  className="text-xs leading-[1.6] mb-3.5"
                  style={{ color: "#9a9186" }}
                >
                  {coll.theme}
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-[11px] font-bold tracking-[1.5px] uppercase"
                    style={{
                      color:
                        coll.status === "live"
                          ? "#5c6644"
                          : coll.status === "coming"
                          ? "#c4603a"
                          : "#9a9186",
                    }}
                  >
                    {coll.statusText}
                  </span>
                  {coll.price && (
                    <span
                      className="font-[family-name:var(--font-caps)] text-[22px]"
                      style={{
                        color:
                          coll.status === "sold" ? "#9a9186" : "#c4603a",
                      }}
                    >
                      {coll.price}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop?collection=apparel"
            className="inline-flex items-center justify-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 transition-all hover:-translate-y-px"
            style={{
              backgroundColor: "#1c1a17",
              color: "#f2ece0",
            }}
          >
            VIEW FULL ARCHIVE
          </Link>
        </div>
      </div>
    </section>
  );
}
