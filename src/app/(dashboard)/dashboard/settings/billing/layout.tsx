import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Manage your subscription, view payment history, and update billing information.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BillingSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
