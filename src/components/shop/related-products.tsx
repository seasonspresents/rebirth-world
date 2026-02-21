import { getProductsByCollection } from "@/lib/payments/products";
import { ProductCard } from "@/components/shop/product-card";

interface RelatedProductsProps {
  collection: string;
  excludeId: string;
}

export async function RelatedProducts({
  collection,
  excludeId,
}: RelatedProductsProps) {
  const products = await getProductsByCollection(collection);
  const related = products.filter((p) => p.id !== excludeId).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-16">
      <h2 className="mb-8 text-center text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-[family-name:var(--font-display)]">
        Complete the look
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
