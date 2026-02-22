import { getFeaturedProducts } from "@/lib/payments/products";
import { TextReveal } from "@/components/ui/text-reveal";
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
      className="section-dark"
    >
      <div className="px-6 pt-24 md:pt-40">
        <div className="mx-auto max-w-[1200px]">
          <TextReveal as="h2" className="text-fluid-display" type="words">
            Crafted with intention
          </TextReveal>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <HorizontalProductShowcase products={products} />
      </div>

      {/* Bottom padding for mobile grid */}
      <div className="px-6 pb-24 md:hidden">
        {/* spacer for mobile layout */}
      </div>
    </section>
  );
}
