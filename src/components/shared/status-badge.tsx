"use client";
"use no memo";

import { useTheme } from "next-themes";
import { useEffect, useState, startTransition } from "react";

export function StatusBadge() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  // This is the recommended pattern for next-themes to avoid hydration mismatch
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  // Use resolvedTheme which handles system theme automatically
  const badgeTheme = resolvedTheme === "dark" ? "dark" : "light";

  // Return placeholder during SSR and initial render
  if (!mounted) {
    return <div className="h-[30px] w-[185px]" />;
  }

  return (
    <iframe
      src={`https://status.getsabo.com/badge?theme=${badgeTheme}`}
      width="185"
      height="30"
      frameBorder="0"
      scrolling="no"
      style={{ colorScheme: "none" }}
      title="System Status"
    />
  );
}
