import { BrandHero } from "@/components/marketing/brand-hero";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { CraftStory } from "@/components/marketing/craft-story";
import { ValueProps } from "@/components/marketing/value-props";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";
import { NewsletterCTA } from "@/components/marketing/newsletter-cta";
import { ScrollRingSceneLazy } from "@/components/3d/scroll-ring-scene-lazy";
import { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Rebirth World — Recycled Skateboard Rings & Wood-Lined Wedding Bands",
  description:
    "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Each piece is shaped by hand on the North Shore of Oahu.",
  keywords: [
    "recycled skateboard rings",
    "skateboard jewelry",
    "wood wedding bands",
    "handcrafted rings",
    "recycled jewelry",
    "sustainable rings",
    "rebirth world",
    "north shore jewelry",
    "wood-lined wedding bands",
    "handmade rings hawaii",
  ],
  openGraph: {
    title: "Rebirth World — Recycled Skateboard Rings & Wood-Lined Wedding Bands",
    description:
      "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu.",
    url: "https://rebirth.world",
    siteName: "Rebirth World",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebirth World — Recycled Skateboard Rings & Wood-Lined Wedding Bands",
    description:
      "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu.",
  },
};

export default function Home() {
  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rebirth World",
    url: "https://rebirth.world",
    description:
      "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu.",
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
        <CraftStory />
        <ScrollRingSceneLazy />
        <ValueProps />
        <Testimonials />
        <FAQ />
        <NewsletterCTA />
      </div>
    </>
  );
}
