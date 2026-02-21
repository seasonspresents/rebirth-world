import { Suspense } from "react";
import { Metadata } from "next";
import { listProducts, getProductsByCollection } from "@/lib/payments/products";
import { COLLECTIONS } from "@/lib/payments/constants";
import type { Product } from "@/lib/payments/constants";
import { ProductCard } from "@/components/shop/product-card";
import { CollectionFilter } from "@/components/shop/collection-filter";
import { SortSelect } from "@/components/shop/sort-select";
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of handcrafted rings and jewelry made from recycled skateboards and reclaimed materials.",
};

function sortProducts(products: Product[], sort: string): Product[] {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...products].sort((a, b) => b.price - a.price);
    case "newest":
      return [...products].reverse();
    case "featured":
    default:
      return products; // already sorted by sort_order from server
  }
}

async function ProductGrid({
  collection,
  sort = "featured",
}: {
  collection?: string;
  sort?: string;
}) {
  const allProducts = await listProducts();

  // Compute collection counts from all products
  const counts: Record<string, number> = {};
  for (const p of allProducts) {
    const col = p.metadata.collection;
    if (col) {
      counts[col] = (counts[col] ?? 0) + 1;
    }
  }

  // Filter by collection if needed
  let products: Product[];
  if (collection) {
    products = await getProductsByCollection(collection);
  } else {
    products = allProducts;
  }

  // Sort
  products = sortProducts(products, sort);

  return (
    <>
      {/* Filter + Sort row */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense>
          <CollectionFilter counts={counts} totalCount={allProducts.length} />
        </Suspense>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">
            {collection
              ? "No products found in this collection yet."
              : "No products available yet. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; sort?: string }>;
}) {
  const { collection, sort } = await searchParams;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
            The Collection
          </h1>
          <p className="mt-3 max-w-[52ch] text-base text-muted-foreground">
            Recycled skateboard rings, wood-lined wedding bands, and apparel —
            each piece handmade in the North Shore workshop. No two are alike.
          </p>
        </div>

        {/* Products with filter + sort */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid collection={collection} sort={sort} />
        </Suspense>
      </div>
    </section>
  );
}
