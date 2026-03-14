"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const collections = [
  {
    title: "Skateboard Rings",
    tagline: "Seven layers of maple. One-of-a-kind.",
    href: "/shop?collection=skateboard-rings",
    gradient: "linear-gradient(135deg, #cc7e3a 0%, #876f4c 100%)",
  },
  {
    title: "Wedding Bands",
    tagline: "Rings as unique as your story.",
    href: "/shop?collection=wedding-bands",
    gradient: "linear-gradient(135deg, #1a3832 0%, #2d8a7e 100%)",
  },
] as const;

export function CollectionsGateway() {
  return (
    <section data-section-theme="dark" className="section-dark">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.title}
            className="group relative flex min-h-[300px] items-end overflow-hidden md:min-h-[400px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: "easeOut",
            }}
          >
            {/* Gradient overlay background */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: collection.gradient,
                opacity: 0.2,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Solid background behind the gradient */}
            <div className="absolute inset-0" style={{ zIndex: -1, backgroundColor: "var(--section-bg)" }} />

            {/* Content */}
            <div className="relative z-10 flex w-full flex-col gap-4 p-8 md:p-12">
              <h2 className="text-fluid-heading font-[family-name:var(--font-display)] font-bold tracking-tight">
                {collection.title}
              </h2>
              <p className="text-base text-muted-foreground">
                {collection.tagline}
              </p>
              <div>
                <Button asChild variant="link" className="h-auto p-0" style={{ color: "var(--section-fg)" }}>
                  <Link href={collection.href}>
                    Explore <span aria-hidden="true">&rarr;</span>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
