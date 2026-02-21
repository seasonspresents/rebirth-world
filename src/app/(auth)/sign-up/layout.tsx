import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Rebirth World",
  description:
    "Create your Rebirth World account to get started.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
