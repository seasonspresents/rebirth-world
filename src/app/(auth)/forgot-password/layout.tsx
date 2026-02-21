import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Rebirth World",
  description:
    "Reset your Rebirth World account password. We'll send you a secure link to create a new password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
