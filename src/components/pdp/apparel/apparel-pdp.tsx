import type { Product } from "@/lib/payments/constants";
import { ApparelHero } from "./apparel-hero";
import { UgcScrollStrip } from "./ugc-scroll-strip";
import { IconBenefitStrip } from "./icon-benefit-strip";
import { StatBar } from "./stat-bar";
import { PhilosophySection } from "./philosophy-section";
import { CollectionGrid } from "./collection-grid";
import { TejidosSection } from "./tejidos-section";
import { SustainabilitySection } from "./sustainability-section";
import { TestimonialsSection } from "./testimonials-section";
import { DifferentiatorGrid } from "./differentiator-grid";
import { GuaranteeSection } from "./guarantee-section";
import { FaqSection } from "./faq-section";
import { SocialGrid } from "./social-grid";
import { FinalCta } from "./final-cta";

interface ApparelPDPProps {
  product: Product;
}

export function ApparelPDP({ product }: ApparelPDPProps) {
  return (
    <>
      {/* 1. Hero Product Section */}
      <ApparelHero product={product} />

      {/* 2. UGC Scroll Strip */}
      <UgcScrollStrip />

      {/* 3. Icon Benefit Strip */}
      <IconBenefitStrip />

      {/* 4. Stat Bar */}
      <StatBar />

      {/* 5. Philosophy Section */}
      <PhilosophySection />

      {/* 6. Collection Grid */}
      <CollectionGrid product={product} />

      {/* 7. Tejidos de Santiagitos */}
      <TejidosSection />

      {/* 8. Sustainability Section */}
      <SustainabilitySection />

      {/* 9. Full Testimonials — "Worn With Intention" */}
      <TestimonialsSection
        variant="light"
        label="Verified Reviews"
        heading="WORN WITH INTENTION"
        subheading="Real people who found the right message at the right time"
        testimonials={[
          {
            quote: "I\u2019ve had this crewneck for four months. I reach for it when I need a reminder. There\u2019s something about wearing a message you actually believe.",
            name: "Marcus T.",
            meta: "A1\u2013B2 Crewneck \u00b7 Charcoal",
            hasMedia: true,
            mediaLabel: "Video",
          },
          {
            quote: "I wore the Flower Tee through six countries in Latin America. Every time someone asked about the flowers, I got to share something real. That\u2019s what I call a conversation piece.",
            name: "Sofia R.",
            meta: "Rebirth Flower Tee \u00b7 Verified Buyer",
            hasMedia: true,
            mediaLabel: "Customer Photo",
          },
          {
            quote: "The quality alone would justify the price. But the fact that there\u2019s a real story behind it \u2014 and that Daniel made it with his own community \u2014 makes it worth ten times more.",
            name: "Brendan O.",
            meta: "A1\u2013B2 Crewneck \u00b7 Olive \u00b7 Size XL",
            hasMedia: true,
            mediaLabel: "Instagram UGC",
          },
        ]}
      />

      {/* 10. Differentiator Grid */}
      <DifferentiatorGrid />

      {/* 11. Guarantee */}
      <GuaranteeSection />

      {/* 12. More Testimonials */}
      <TestimonialsSection
        variant="parchment"
        label="More From the Community"
        heading="REAL PEOPLE. REAL CHAPTERS."
        testimonials={[
          {
            quote: "Opened the package and the fabric immediately felt different. Then I read the message and it hit me \u2014 I\u2019m literally in this chapter right now. Gave me chills.",
            name: "Jasmine K.",
            meta: "A1\u2013B2 Crewneck \u00b7 Sand",
            hasMedia: true,
            mediaLabel: "Unboxing",
          },
          {
            quote: "I bought the Flower Tee during a hard year. Wore it through the hardest parts. Looking at it now feels like proof I made it through.",
            name: "Elena V.",
            meta: "Rebirth Flower Tee \u00b7 Verified",
            hasMedia: true,
            mediaLabel: "Before / After",
          },
          {
            quote: "I DM\u2019d Daniel after wearing the crewneck through a job loss and a new start. He actually responded. A real human behind a real brand. Hard to find.",
            name: "Carlos M.",
            meta: "Crewneck \u00b7 Charcoal \u00b7 Size L",
            hasMedia: true,
            mediaLabel: "DM Screenshot",
          },
        ]}
      />

      {/* 13. FAQ */}
      <FaqSection />

      {/* 14. Social 4-Grid */}
      <SocialGrid />

      {/* 15. Final CTA */}
      <FinalCta product={product} />
    </>
  );
}
