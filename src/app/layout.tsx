import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// import { PHProvider } from "@/components/posthog-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Organization, WithContext } from "schema-dts";
import { AuthProvider } from "@/components/auth/auth-context";
import { CartProvider } from "@/components/cart/cart-context";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/supabase/types";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rebirth.world"),
  title: {
    default: "Rebirth World — Handcrafted Recycled Jewelry",
    template: "%s | Rebirth World",
  },
  description:
    "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
  keywords: [
    "recycled jewelry",
    "handcrafted rings",
    "sustainable jewelry",
    "reclaimed materials",
    "eco-friendly rings",
    "rebirth world",
    "handmade jewelry",
  ],
  authors: [{ name: "Rebirth World" }],
  creator: "Rebirth World",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rebirth.world",
    siteName: "Rebirth World",
    title: "Rebirth World — Handcrafted Recycled Jewelry",
    description:
      "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
    images: [
      {
        url: "/og/homepage.png",
        width: 1200,
        height: 630,
        alt: "Rebirth World — Handcrafted Recycled Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebirth World — Handcrafted Recycled Jewelry",
    description:
      "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
    images: ["/og/homepage.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user and profile from server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: UserProfile | null = null;
  if (user) {
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
  }

  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rebirth World",
    url: "https://rebirth.world",
    logo: "https://rebirth.world/logo.png",
    description:
      "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
    sameAs: [],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} ${dmSans.className} antialiased`}
        suppressHydrationWarning
      >
        {/* If you want to use PostHog, uncomment the PHProvider */}
        {/* <PHProvider> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialUser={user} initialProfile={profile}>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ThemeProvider>
        {/* </PHProvider> */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
