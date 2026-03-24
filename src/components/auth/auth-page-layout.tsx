"use client";

import { Logo } from "@/components/shared/logo";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "motion/react";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

function AuthFormSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-6 rounded-lg border p-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="relative">
          <Skeleton className="h-px w-full" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="text-center">
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    </div>
  );
}

export function AuthPageLayout({ children, title }: AuthPageLayoutProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      {/* Aceternity BackgroundBeams — subtle animated beam lines */}
      <BackgroundBeams className="absolute inset-0" />

      <motion.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Logo />
        <p className="text-xs font-[family-name:var(--font-dm-mono)] tracking-wide text-muted-foreground/60">
          Embrace Change
        </p>
        <p className="pb-2 text-2xl font-semibold font-[family-name:var(--font-display)]">
          {title}
        </p>
        <Suspense fallback={<AuthFormSkeleton />}>{children}</Suspense>
      </motion.div>
    </div>
  );
}
