import { Suspense } from "react";
import type { Product } from "@/lib/payments/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RelatedProducts } from "@/components/shop/related-products";

/* Ring PDP sections */
import { RingHero } from "@/components/pdp/ring/ring-hero";
import { ValuePropBlock } from "@/components/pdp/ring/ring-value-props";
import { RingDifferentiators } from "@/components/pdp/ring/ring-differentiators";
import { RingGuarantee } from "@/components/pdp/ring/ring-guarantee";
import { RingFaq } from "@/components/pdp/ring/ring-faq";
import { RingFinalCTA } from "@/components/pdp/ring/ring-final-cta";

/* Shared PDP sections */
import { SocialProofCarousel, SocialProofBanner } from "@/components/pdp/shared/social-proof-carousel";
import { BenefitIconsScroll } from "@/components/pdp/shared/benefit-icons-scroll";

interface RingPDPProps {
  product: Product;
}

export function RingPDP({ product }: RingPDPProps) {
  const ringSizes = product.metadata.ring_sizes?.split(",").map((s) => s.trim());
  const slug = product.slug;
  const ctaHref = `/shop/${slug}`;

  return (
    <>
      {/* ─── 1. Hero / Product Section (above the fold) ─── */}
      <RingHero product={product} />

      {/* ─── 2. Product Details Accordion ─── */}
      <section className="border-y border-border/50 px-6 py-6">
        <div className="mx-auto max-w-[1200px]">
          <Accordion type="single" collapsible defaultValue="details" className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm font-semibold py-4">Product Details</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-2 text-sm text-muted-foreground">
                  {product.metadata.material && (
                    <div><dt className="font-medium text-foreground">Material</dt><dd>{product.metadata.material}</dd></div>
                  )}
                  {product.metadata.weight && (
                    <div><dt className="font-medium text-foreground">Weight</dt><dd>{product.metadata.weight}g</dd></div>
                  )}
                  <div><dt className="font-medium text-foreground">Engraving</dt><dd>Free — up to 20 characters</dd></div>
                  <div><dt className="font-medium text-foreground">Turnaround</dt><dd>2–3 weeks, handmade to order</dd></div>
                </dl>
              </AccordionContent>
            </AccordionItem>
            {ringSizes && ringSizes.length > 0 && (
              <AccordionItem value="sizing">
                <AccordionTrigger className="text-sm font-semibold py-4">Sizing Guide</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Available sizes: {ringSizes.join(", ")}. Wood-lined bands run ~1 size smaller. Wrap string around your finger, measure in mm, compare with a chart. When in doubt, size up.
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm font-semibold py-4">Shipping &amp; Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Free standard shipping on US orders $100+ (5–10 business days). Express and international available at checkout.</p>
                  <p>30-day returns on unworn items. Engraved pieces are final sale. 1-year craftsmanship warranty.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ─── 3. Social Proof UGC Carousel ─── */}
      <SocialProofCarousel heading="What Our Customers Say" />

      {/* ─── 4. Benefit Icons Scroll ─── */}
      <BenefitIconsScroll type="ring" />

      {/* ─── 5. Value Prop — The Craft ─── */}
      <ValuePropBlock
        theme="section-warm"
        eyebrow="The Craft"
        heading="Every Ring Begins with a Broken Board"
        body="I shape every ring by hand on a lathe in my Mapleton, Utah workshop. Local skaters donate their broken decks — seven layers of Canadian maple that I sand through progressively finer grits until the layers emerge smooth and the ring finds its form."
        imageAlt="Daniel's hands sanding a ring liner on the lathe, sawdust visible, workshop atmosphere, warm overhead lighting"
        image={product.images[1]}
        ctaHref={ctaHref}
      />

      {/* ─── 6. Value Prop — The Materials ─── */}
      <ValuePropBlock
        theme="section-earth"
        eyebrow="The Materials"
        heading="Materials with a Past"
        body="Every material in a Rebirth ring has lived a life before. The wood came from a skateboard that saw thousands of tricks. The metal is precision-forged ARZ stainless steel, gold-plated to endure."
        imageAlt="Close-up of Red Amboyna Burl wood grain showing natural swirl patterns, next to gold-plated steel shell"
        image={product.images[2]}
        reversed
        benefits={[
          "Recycled 7-ply Canadian maple from donated skateboards",
          "Stabilized exotic woods: Red Amboyna Burl, Spalted Maple Burl",
          "Gold-plated ARZ stainless steel shells for wedding bands",
        ]}
        ctaHref={ctaHref}
      />

      {/* ─── 7. Social Proof Banner ─── */}
      <SocialProofBanner heading="Loved by 1,000+ customers worldwide" />

      {/* ─── 8. Differentiators Grid ─── */}
      <RingDifferentiators ctaHref={ctaHref} />

      {/* ─── 9. Benefit Icons Scroll (repeat) ─── */}
      <BenefitIconsScroll type="ring" />

      {/* ─── 10. Value Prop — The Story ─── */}
      <ValuePropBlock
        theme="section-ocean"
        eyebrow="The Story"
        heading="The Ring That Started It All"
        body="I started making rings from broken skateboards when I was fourteen. My father — a trained jeweler from Salzburg, Austria — taught me the fundamentals. Years later, after chapters in Hawaii and Guatemala, I brought it all together in Mapleton, Utah."
        imageAlt="Daniel Malzl portrait in his workshop, surrounded by tools and finished rings"
        image={product.images[3]}
        benefits={[
          "Skateboarder at heart",
          "Third-generation jeweler",
          "Inspired by many cultures",
          "Crafted with intention and purpose",
        ]}
        ctaHref={ctaHref}
      />

      {/* ─── 11. Money-Back Guarantee ─── */}
      <RingGuarantee ctaHref={ctaHref} />

      {/* ─── 12. Social Proof Banner (repeat) ─── */}
      <SocialProofBanner heading="4.9★ average from 150+ happy customers" />

      {/* ─── 13. FAQ ─── */}
      <RingFaq image={product.images[0]} ctaHref={ctaHref} />

      {/* ─── 14. Social Proof Carousel (repeat) ─── */}
      <SocialProofCarousel heading="More from Our Customers" />

      {/* ─── 15. Final CTA ─── */}
      <RingFinalCTA
        productName={product.name}
        backgroundImage={product.images[0]}
        ctaHref={ctaHref}
      />

      {/* ─── Related Products ─── */}
      {product.metadata.collection && (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <Suspense>
              <RelatedProducts collection={product.metadata.collection} excludeId={product.id} />
            </Suspense>
          </div>
        </section>
      )}
    </>
  );
}
