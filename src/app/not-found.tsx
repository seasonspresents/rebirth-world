"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function NotFound() {
  const { resolvedTheme } = useTheme();
  const color = useMemo(
    () => (resolvedTheme === "dark" ? "#ffffff" : "#000000"),
    [resolvedTheme]
  );

  return (
    <div className="flex flex-col">
      <Header />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Particles
          className="absolute inset-0 z-0"
          quantity={200}
          refresh
          color={color}
        />

        {/* Large 404 background text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-50">
          <div className="text-muted-foreground/30 mb-100 text-[12rem] leading-none font-bold select-none sm:mb-60 sm:text-[18rem] lg:mb-80 lg:text-[24rem]">
            404
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-4 text-center">
          <h2 className="text-foreground mb-6 text-4xl font-semibold sm:mb-8 sm:text-5xl lg:text-6xl">
            Page not found
          </h2>

          <p className="mx-auto mb-8 max-w-xs text-base sm:mb-12 sm:max-w-md sm:text-lg lg:text-lg">
            The page you are looking for either doesn&apos;t exist or currently
            not available.
          </p>

          <Button asChild variant="secondary" size="lg">
            <Link href="/" className="group flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Go back to homepage
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
