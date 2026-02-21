import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Rebirth World",
  description:
    "Sign in to your Rebirth World account to access your dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
