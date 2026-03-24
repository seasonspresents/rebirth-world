import { getFeaturedProducts } from "@/lib/payments/products";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Spotlight } from "@/components/ui/spotlight";
import { HorizontalProductShowcase } from "@/components/marketing/horizontal-product-showcase";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <section
        data-section-theme="dark"
        className="section-dark px-6 py-24 md:py-40"
      >
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-fluid-display">
            Our collection is being curated
          </h2>
          <p className="mt-4 max-w-[44ch] text-base text-section-muted">
            Sign up for our newsletter to be the first to know when new pieces
            drop.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      data-section-theme="dark"
      className="section-dark relative overflow-hidden"
    >
      {/* Aceternity Spotlight for dramatic lighting */}
      <Spotlight
        className="-top-40 -right-20 md:-top-20"
        fill="var(--rebirth-amber)"
      />

      <div className="px-6 pt-24 md:pt-40">
        <div className="mx-auto max-w-[1200px]">
          <TextGenerateEffect
            words="Crafted with intention"
            className="text-fluid-display text-section-fg"
            duration={0.6}
          />
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <HorizontalProductShowcase products={products} />
      </div>

      <div className="px-6 pb-24 md:hidden" />
    </section>
  );
}
