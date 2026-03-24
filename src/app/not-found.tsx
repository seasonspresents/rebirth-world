"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Meteors } from "@/components/ui/meteors";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Aceternity Meteors — ambient animated streaks */}
        <Meteors number={15} />

        {/* Large 404 background text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-50">
          <div className="text-muted-foreground/30 mb-100 text-[12rem] leading-none font-bold select-none sm:mb-60 sm:text-[18rem] lg:mb-80 lg:text-[24rem]">
            404
          </div>
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2 className="text-foreground mb-6 text-4xl font-semibold font-[family-name:var(--font-display)] sm:mb-8 sm:text-5xl lg:text-6xl">
            This page got recycled
          </h2>

          <p className="mx-auto mb-8 max-w-xs text-base text-muted-foreground sm:mb-12 sm:max-w-md sm:text-lg lg:text-lg">
            Looks like this page took a different path. But there&apos;s
            plenty more to discover.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Browse the shop</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/" className="group flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
