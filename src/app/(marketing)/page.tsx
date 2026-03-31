import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { listProducts, getFeaturedProducts } from "@/lib/payments/products";
import { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";

/* ── Homepage Components ── */
import { Hero } from "@/components/homepage/hero";
import { Bestsellers } from "@/components/homepage/bestsellers";
import { UgcStrip } from "@/components/homepage/ugc-strip";
import { IconStrip } from "@/components/homepage/icon-strip";
import { StatBar } from "@/components/homepage/stat-bar";
import { ValueProp1, ValueProp2, ValueProp3 } from "@/components/homepage/value-prop";
import { Categories } from "@/components/homepage/categories";
import { SocialProofLight, SocialProofDark } from "@/components/homepage/social-proof";
import { Differentiators } from "@/components/homepage/differentiators";
import { Guarantee } from "@/components/homepage/guarantee";
import { FaqSection } from "@/components/homepage/faq-section";
import { Offers } from "@/components/homepage/offers";
import { FinalCta } from "@/components/homepage/final-cta";

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

/* Icon strip data — two variants */
const ICON_STRIP_1 = [
  { icon: "✋", line1: "Handmade", line2: "in Utah" },
  { icon: "🛹", line1: "Recycled", line2: "Skate Decks" },
  { icon: "🌿", line1: "Eco-Conscious", line2: "Materials" },
  { icon: "✍️", line1: "Free Custom", line2: "Engraving" },
  { icon: "🛡️", line1: "1-Year", line2: "Warranty" },
  { icon: "🚚", line1: "Free US", line2: "Shipping $75+" },
  { icon: "🌍", line1: "Service at", line2: "the Core" },
];

const ICON_STRIP_2 = [
  { icon: "🪷", line1: "Embrace", line2: "Change" },
  { icon: "💍", line1: "One of a", line2: "Kind Rings" },
  { icon: "🎨", line1: "Artist", line2: "Collaborations" },
  { icon: "♻️", line1: "Nothing", line2: "Wasted" },
  { icon: "🤙", line1: "Skate &", line2: "Surf Culture" },
  { icon: "🌍", line1: "Ships", line2: "Worldwide" },
  { icon: "👨‍🎨", line1: "Made by", line2: "Daniel Malzl" },
];

export default async function Home() {
  const allProducts = await listProducts();

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
        {/* 1. Hero */}
        <Hero />

        {/* 2. Bestselling Products — tabbed grid */}
        <Bestsellers products={allProducts} />

        {/* 3. UGC Scroll Strip */}
        <UgcStrip />

        {/* 4. Icon Benefit Strip */}
        <IconStrip items={ICON_STRIP_1} />

        {/* 5. Stat Bar */}
        <StatBar />

        {/* 6. Value Prop 1 — "The Original" */}
        <ValueProp1 />

        {/* 7. Value Prop 2 — "Wedding Bands" */}
        <ValueProp2 />

        {/* 8. Product Categories */}
        <Categories />

        {/* 9. Social Proof Full — Light */}
        <SocialProofLight />

        {/* 10. Differentiator Grid */}
        <Differentiators />

        {/* 11. Icon Strip (repeat — cream variant) */}
        <IconStrip variant="cream" items={ICON_STRIP_2} />

        {/* 12. Value Prop 3 — "The Philosophy" */}
        <ValueProp3 />

        {/* 13. Stat Bar (repeat) */}
        <StatBar />

        {/* 14. Guarantee */}
        <Guarantee />

        {/* 15. Social Proof Dark */}
        <SocialProofDark />

        {/* 16. FAQ */}
        <FaqSection />

        {/* 17. Additional Offers */}
        <Offers />

        {/* 18. Final CTA */}
        <FinalCta />

        {/* 19. Footer — rendered by layout */}
      </div>
    </>
  );
}
