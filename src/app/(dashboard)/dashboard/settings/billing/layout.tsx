import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "View your order history and payment information.",
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
