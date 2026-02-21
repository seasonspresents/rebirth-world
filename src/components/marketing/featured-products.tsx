import { getFeaturedProducts } from "@/lib/payments/products";
import { ProductCard } from "@/components/shop/product-card";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Coming soon
          </p>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] leading-[1.15] tracking-tight font-[family-name:var(--font-display)]">
            Our collection is being curated
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-base text-muted-foreground">
            Sign up for our newsletter to be the first to know when new pieces
            drop.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-[1000px]">
        <div className="mx-auto mb-14 max-w-[480px] text-center">
          <p className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Featured pieces
          </p>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] leading-[1.15] tracking-tight font-[family-name:var(--font-display)]">
            Crafted with intention
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
