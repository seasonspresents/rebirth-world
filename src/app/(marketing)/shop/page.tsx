import { Suspense } from "react";
import { Metadata } from "next";
import { listProducts, getProductsByCollection } from "@/lib/payments/products";
import { ProductCard } from "@/components/shop/product-card";
import { CollectionFilter } from "@/components/shop/collection-filter";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of handcrafted rings and jewelry made from recycled metals and reclaimed materials.",
};

async function ProductGrid({ collection }: { collection?: string }) {
  const products = collection
    ? await getProductsByCollection(collection)
    : await listProducts();

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground">
          {collection
            ? "No products found in this collection yet."
            : "No products available yet. Check back soon!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection } = await searchParams;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
            Shop
          </h1>
          <p className="mt-3 max-w-[48ch] text-base text-muted-foreground">
            Each piece is handcrafted from recycled metals and reclaimed
            materials. Browse our collections below.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <Suspense>
            <CollectionFilter />
          </Suspense>
        </div>

        {/* Products */}
        <ProductGrid collection={collection} />
      </div>
    </section>
  );
}
