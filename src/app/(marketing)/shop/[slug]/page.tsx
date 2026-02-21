import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { getProductBySlug, formatPrice } from "@/lib/payments/products";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} — Handcrafted from recycled materials by Rebirth World.`,
    openGraph: {
      title: `${product.name} | Rebirth World`,
      description:
        product.description ||
        `${product.name} — Handcrafted from recycled materials.`,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const ringSizes = product.metadata.ring_sizes?.split(",").map((s) => s.trim());

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1000px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.metadata.collection && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {product.metadata.collection}
              </p>
            )}
            <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold text-primary">
              {formatPrice(product.price, product.currency)}
            </p>

            {product.description && (
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Material */}
            {product.metadata.material && (
              <div className="mt-6">
                <p className="text-sm font-semibold">Material</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.metadata.material}
                </p>
              </div>
            )}

            {/* Add to Cart (with size selector when applicable) */}
            <AddToCartButton
              product={product}
              availableSizes={ringSizes}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
