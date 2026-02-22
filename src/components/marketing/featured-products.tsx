import { getFeaturedProducts } from "@/lib/payments/products";
import { ProductCard } from "@/components/shop/product-card";
import { TextReveal } from "@/components/ui/text-reveal";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <section className="section-dark px-6 py-24 md:py-40">
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
    <section className="section-dark px-6 py-24 md:py-40">
      <div className="mx-auto max-w-[1200px]">
        <TextReveal as="h2" className="text-fluid-display" type="words">
          Crafted with intention
        </TextReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:gap-10 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
