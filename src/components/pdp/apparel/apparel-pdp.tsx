import { Suspense } from "react";
import type { Product } from "@/lib/payments/constants";
import { RelatedProducts } from "@/components/shop/related-products";
import { ApparelHero } from "@/components/pdp/apparel/apparel-hero";
import { CollectionStory } from "@/components/pdp/apparel/collection-story";
import { ProductDetailsGrid } from "@/components/pdp/apparel/product-details-grid";
import { MakingOf } from "@/components/pdp/apparel/making-of";
import { SocialProofCarousel } from "@/components/pdp/shared/social-proof-carousel";
import { NewsletterCTA } from "@/components/marketing/newsletter-cta";

interface ApparelPDPProps {
  product: Product;
}

export function ApparelPDP({ product }: ApparelPDPProps) {
  return (
    <>
      {/* 1. Hero / Product Section (apparel-specific) */}
      <ApparelHero product={product} />

      {/* 2. Collection Story */}
      <CollectionStory product={product} />

      {/* 3. Product Details Grid */}
      <ProductDetailsGrid product={product} />

      {/* 4. The Making Of */}
      <MakingOf />

      {/* 5. Social Proof */}
      <SocialProofCarousel heading="What Customers Say" />

      {/* 6. Related Products */}
      {product.metadata.collection && (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <Suspense>
              <RelatedProducts collection={product.metadata.collection} excludeId={product.id} />
            </Suspense>
          </div>
        </section>
      )}

      {/* 7. Newsletter CTA */}
      <NewsletterCTA />
    </>
  );
}
