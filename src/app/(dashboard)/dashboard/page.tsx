import type { Metadata } from "next";
import { DashboardPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "View your dashboard overview with analytics, charts, and key metrics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
