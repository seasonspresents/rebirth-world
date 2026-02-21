import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Rebirth World",
  description:
    "Create a new password for your Rebirth World account to regain access to your dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
