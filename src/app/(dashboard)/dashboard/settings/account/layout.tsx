import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Manage your profile information, contact details, and account preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
