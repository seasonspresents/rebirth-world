import { Suspense } from "react";
import type { Product } from "@/lib/payments/constants";
import { RelatedProducts } from "@/components/shop/related-products";

/* Ring PDP sections — matching mockup order */
import { RingHero } from "@/components/pdp/ring/ring-hero";
import { RingUgcStrip } from "@/components/pdp/ring/ring-ugc-strip";
import { RingIconStrip } from "@/components/pdp/ring/ring-icon-strip";
import { RingStatBar } from "@/components/pdp/ring/ring-stat-bar";
import { RingCraft, RingPhilosophy } from "@/components/pdp/ring/ring-value-props";
import { RingTestimonials } from "@/components/pdp/ring/ring-testimonials";
import { RingFounderStory } from "@/components/pdp/ring/ring-founder-story";
import { RingDifferentiators } from "@/components/pdp/ring/ring-differentiators";
import { RingFeatures } from "@/components/pdp/ring/ring-features";
import { RingClothingDrops } from "@/components/pdp/ring/ring-clothing-drops";
import { RingGuarantee } from "@/components/pdp/ring/ring-guarantee";
import { RingFaq } from "@/components/pdp/ring/ring-faq";
import { RingSocialGrid } from "@/components/pdp/ring/ring-social-grid";
import { RingFinalCTA } from "@/components/pdp/ring/ring-final-cta";

interface RingPDPProps {
  product: Product;
}

export function RingPDP({ product }: RingPDPProps) {
  const ctaHref = `/shop/${product.slug}`;

  return (
    <>
      {/* ─── 1. Hero Product Section ─── */}
      <RingHero product={product} />

      {/* ─── 2. UGC Scroll Strip ─── */}
      <RingUgcStrip ctaHref={ctaHref} />

      {/* ─── 3. Icon Benefit Strip ─── */}
      <RingIconStrip />

      {/* ─── 4. Stat Bar ─── */}
      <RingStatBar />

      {/* ─── 5. Value Prop 1 — The Craft ─── */}
      <RingCraft image={product.images[1]} ctaHref={ctaHref} />

      {/* ─── 6. Value Prop 2 — The Philosophy ─── */}
      <RingPhilosophy image={product.images[2]} ctaHref={ctaHref} />

      {/* ─── 7. Full Testimonials (light) ─── */}
      <RingTestimonials variant="light" ctaHref={ctaHref} />

      {/* ─── 8. Founder Story ─── */}
      <RingFounderStory image={product.images[3]} />

      {/* ─── 9. Differentiator Grid ─── */}
      <RingDifferentiators ctaHref={ctaHref} />

      {/* ─── 10. Features + Image ─── */}
      <RingFeatures image={product.images[2]} ctaHref={ctaHref} />

      {/* ─── 11. Clothing Drops ─── */}
      <RingClothingDrops />

      {/* ─── 12. Guarantee ─── */}
      <RingGuarantee ctaHref={ctaHref} />

      {/* ─── 13. More Testimonials (dark) ─── */}
      <RingTestimonials variant="dark" ctaHref={ctaHref} />

      {/* ─── 14. FAQ ─── */}
      <RingFaq image={product.images[0]} ctaHref={ctaHref} />

      {/* ─── 15. Social Grid ─── */}
      <RingSocialGrid ctaHref={ctaHref} />

      {/* ─── 16. Final CTA ─── */}
      <RingFinalCTA
        productName={product.name}
        price={product.price}
        currency={product.currency}
        ctaHref={ctaHref}
      />

      {/* ─── Related Products ─── */}
      {product.metadata.collection && (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <Suspense>
              <RelatedProducts
                collection={product.metadata.collection}
                excludeId={product.id}
              />
            </Suspense>
          </div>
        </section>
      )}
    </>
  );
}
