import { Logo } from "@/components/shared/logo";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

function AuthFormSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Form skeleton */}
      <div className="space-y-6 rounded-lg border p-6">
        {/* Social login buttons */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Divider */}
        <div className="relative">
          <Skeleton className="h-px w-full" />
        </div>

        {/* Form fields */}
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

        {/* Bottom link */}
        <div className="text-center">
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    </div>
  );
}

export function AuthPageLayout({ children, title }: AuthPageLayoutProps) {
  return (
    <div className="bg-grain flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-4">
        <Logo />
        <p className="text-xs font-[family-name:var(--font-dm-mono)] tracking-wide text-muted-foreground/60">
          Embrace Change
        </p>
        <p className="pb-2 text-2xl font-semibold font-[family-name:var(--font-display)]">{title}</p>
        <Suspense fallback={<AuthFormSkeleton />}>{children}</Suspense>
      </div>
    </div>
  );
}
