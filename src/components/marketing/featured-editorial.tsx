import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/payments/products";
import { formatPrice, getCollectionStyle } from "@/lib/payments/constants";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { ScrollImage } from "@/components/ui/scroll-image";

export async function FeaturedEditorial() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <section data-section-theme="dark" className="section-dark bg-grain px-6 py-24 md:py-32 lg:py-40">
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <h2 className="text-fluid-display">Our collection is being curated</h2>
          <p className="mt-4 max-w-[44ch] text-base text-section-muted">
            Sign up for our newsletter to be the first to know when new pieces drop.
          </p>
        </div>
      </section>
    );
  }

  const [hero, secondary, banner] = [
    products[0],
    products[1] ?? products[0],
    products[2] ?? products[0],
  ];

  return (
    <section data-section-theme="dark" className="section-dark bg-grain relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <Spotlight className="-top-40 -right-20 md:-top-20" fill="var(--rebirth-amber)" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Section heading */}
        <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-section-accent font-[family-name:var(--font-dm-mono)]">
          Featured
        </p>
        <h2 className="text-fluid-display mb-12 md:mb-16">
          Crafted with intention
        </h2>

        {/* Asymmetric 2-col grid: 60% / 40% */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr] md:gap-8">
          {/* Card 1 — hero (60%) */}
          <EditorialCard product={hero} aspect="aspect-[16/10]" priority />

          {/* Card 2 — secondary (40%) */}
          <EditorialCard product={secondary} aspect="aspect-[4/5]" />
        </div>

        {/* Card 3 — full-width banner below */}
        {products.length >= 3 && (
          <div className="mt-6 md:mt-8">
            <EditorialCard product={banner} aspect="aspect-[21/9] md:aspect-[3/1]" />
          </div>
        )}
      </div>
    </section>
  );
}

function EditorialCard({
  product,
  aspect,
  priority = false,
}: {
  product: Awaited<ReturnType<typeof getFeaturedProducts>>[number];
  aspect: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block overflow-hidden rounded-xl"
      style={getCollectionStyle(product.metadata.collection)}
    >
      {/* Image with cinematic scroll reveal */}
      <div className={`relative ${aspect} overflow-hidden bg-section-fg/5`}>
        {product.images[0] ? (
          <ScrollImage
            src={product.images[0]}
            alt={`${product.name} — ${product.metadata.subtitle || "Handcrafted ring"}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={priority}
            scaleFrom={1.15}
            containerClassName="h-full w-full"
            radius="0.75rem"
            style={{ viewTransitionName: `product-${product.slug}` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-section-muted">
            Photography placeholder
          </div>
        )}

        {/* Overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
          {product.metadata.collection && (
            <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/60 font-[family-name:var(--font-dm-mono)]">
              {product.metadata.collection.replace(/-/g, " ")}
            </p>
          )}
          <h3 className="text-xl font-semibold text-white md:text-2xl font-[family-name:var(--font-display)]">
            {product.name}
          </h3>
          {product.metadata.subtitle && (
            <p className="mt-1 text-sm text-white/70">{product.metadata.subtitle}</p>
          )}
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm font-medium text-white font-[family-name:var(--font-dm-mono)]">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-white/80 transition-all duration-500 group-hover:tracking-[0.2em]">
              Shop Now &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
