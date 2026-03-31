import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Cormorant_Garamond, Bebas_Neue, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
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
import { Preloader } from "@/components/shared/preloader";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

/* Clash Display kept as --font-clash for legacy references */
const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caps",
  display: "swap",
});

/* Playfair Display — PRIMARY heading font across all pages */
const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

/* Also keep --font-serif alias for explicit serif references */
const playfairSerif = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rebirth.world"),
  title: {
    default: "Rebirth World — Recycled Skateboard Rings & Wedding Bands",
    template: "%s | Rebirth World",
  },
  description:
    "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu, Hawaii.",
  keywords: [
    "recycled skateboard rings",
    "skateboard jewelry",
    "wood wedding bands",
    "handcrafted rings",
    "recycled jewelry",
    "sustainable rings",
    "rebirth world",
    "handmade rings hawaii",
    "wood-lined wedding bands",
    "north shore jewelry",
  ],
  authors: [{ name: "Rebirth World" }],
  creator: "Rebirth World",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rebirth.world",
    siteName: "Rebirth World",
    title: "Rebirth World — Recycled Skateboard Rings & Wedding Bands",
    description:
      "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu.",
    images: [
      {
        url: "/og/homepage.png",
        width: 1200,
        height: 630,
        alt: "Rebirth World — Recycled Skateboard Rings & Wedding Bands",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebirth World — Recycled Skateboard Rings & Wedding Bands",
    description:
      "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu.",
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
      "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu, Hawaii.",
    sameAs: ["https://instagram.com/rebirthrings"],
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
        className={`${dmSans.variable} ${clashDisplay.variable} ${dmMono.variable} ${cormorantGaramond.variable} ${bebasNeue.variable} ${playfairDisplay.variable} ${playfairSerif.variable} ${dmSans.className} antialiased`}
        suppressHydrationWarning
      >
        <Preloader />
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
