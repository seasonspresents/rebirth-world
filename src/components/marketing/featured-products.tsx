import { getFeaturedProducts } from "@/lib/payments/products";
import { ProductCard } from "@/components/shop/product-card";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <section className="px-6 py-24 md:py-40">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
            Our collection is being curated
          </h2>
          <p className="mt-4 max-w-[44ch] text-base text-muted-foreground">
            Sign up for our newsletter to be the first to know when new pieces
            drop.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-24 md:py-40">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-3xl leading-[1.15] tracking-tight md:text-5xl font-[family-name:var(--font-display)]">
          Crafted with intention
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:gap-10 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
