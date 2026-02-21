import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General",
  description:
    "Manage your application preferences including language, timezone, and theme settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GeneralSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
