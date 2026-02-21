import { BrandHero } from "@/components/marketing/brand-hero";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { ValueProps } from "@/components/marketing/value-props";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";
import { NewsletterCTA } from "@/components/marketing/newsletter-cta";
import { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Rebirth World — Handcrafted Recycled Jewelry",
  description:
    "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
  keywords: [
    "recycled jewelry",
    "handcrafted rings",
    "sustainable jewelry",
    "reclaimed materials",
    "eco-friendly rings",
    "rebirth world",
  ],
  openGraph: {
    title: "Rebirth World — Handcrafted Recycled Jewelry",
    description:
      "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
    url: "https://rebirth.world",
    siteName: "Rebirth World",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebirth World — Handcrafted Recycled Jewelry",
    description:
      "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
  },
};

export default function Home() {
  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rebirth World",
    url: "https://rebirth.world",
    description:
      "Handcrafted rings and jewelry made from recycled metals and reclaimed materials. Each piece carries a story of transformation.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div>
        <BrandHero />
        <FeaturedProducts />
        <ValueProps />
        <Testimonials />
        <FAQ />
        <NewsletterCTA />
      </div>
    </>
  );
}
