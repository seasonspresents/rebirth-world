import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Configure your notification preferences for push, email, and mobile notifications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
