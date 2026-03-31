import { BrandHero } from "@/components/marketing/brand-hero";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { FeaturedEditorial } from "@/components/marketing/featured-editorial";
import { BrandStory } from "@/components/marketing/brand-story";
import { CollectionsSection } from "@/components/marketing/collections-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { ValueProps } from "@/components/marketing/value-props";
import { FAQ } from "@/components/marketing/faq";
import { NewsletterCTA } from "@/components/marketing/newsletter-cta";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { getFeaturedProducts } from "@/lib/payments/products";
import { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Rebirth World — Recycled Skateboard Rings & Wood-Lined Wedding Bands",
  description:
    "Handcrafted rings and apparel born from broken skateboards. Made in Mapleton, Utah. Inspired by many cultures.",
  keywords: [
    "recycled skateboard rings",
    "skateboard jewelry",
    "wood wedding bands",
    "handcrafted rings",
    "recycled jewelry",
    "sustainable rings",
    "rebirth world",
    "wood-lined wedding bands",
    "handmade rings",
  ],
  openGraph: {
    title: "Rebirth World — Recycled Skateboard Rings & Wood-Lined Wedding Bands",
    description:
      "Handcrafted rings and apparel born from broken skateboards. Made in Mapleton, Utah.",
    url: "https://rebirth.world",
    siteName: "Rebirth World",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebirth World — Recycled Skateboard Rings & Wood-Lined Wedding Bands",
    description:
      "Handcrafted rings and apparel born from broken skateboards. Made in Mapleton, Utah.",
  },
};

export default async function Home() {
  const featured = await getFeaturedProducts();
  const heroImage = featured[0]?.images[0];

  // JSON-LD — static trusted content, safe to inline
  const jsonLdContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rebirth World",
    url: "https://rebirth.world",
    description: "Handcrafted rings and apparel born from broken skateboards. Made in Mapleton, Utah.",
  } satisfies WithContext<WebSite>).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdContent }} />
      <OrganizationJsonLd />
      <div>
        {/* 1. Brand Hero — full-viewport pinned, SplitText */}
        <BrandHero heroImage={heroImage} />

        {/* 2. Social Proof Bar — marquee ticker */}
        <SocialProofBar />

        {/* 3. Featured Products — editorial asymmetric grid */}
        <FeaturedEditorial />

        {/* 4. Brand Story / Origin — sticky pull quote + 4 scroll blocks */}
        <BrandStory />

        {/* 5. Product Collections — BASIC/DEPT numbered accordion */}
        <CollectionsSection />

        {/* 6. Social Proof / Testimonials */}
        <Testimonials />

        {/* 7. Value Propositions */}
        <ValueProps />

        {/* 8. FAQ */}
        <FAQ />

        {/* 9. Newsletter CTA */}
        <NewsletterCTA />
      </div>
    </>
  );
}
