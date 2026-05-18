import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { listProducts } from "@/lib/payments/products";
import { COLLECTIONS, type Product } from "@/lib/payments/constants";
import { getReviewSummariesForProducts } from "@/lib/review-data";
import { ProductCard } from "@/components/shop/product-card";
import { ShopFilters, type ShopFilterOption } from "@/components/shop/shop-filters";
import { ShopSearch } from "@/components/shop/shop-search";
import { SortSelect } from "@/components/shop/sort-select";
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of handcrafted rings and jewelry made from recycled skateboards and reclaimed materials.",
};

const COLLECTION_HEADERS: Record<
  string,
  {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    cta: string;
    accent: string;
    secondaryCta?: {
      label: string;
      href: string;
    };
  }
> = {
  all: {
    eyebrow: "The collection",
    title: "Every piece, shaped by hand",
    body: "Recycled skateboard rings, wood-lined wedding bands, apparel, and small objects made with the Rebirth belief that nothing with a story needs to be wasted.",
    image: "/images/hero/img_0572.webp",
    cta: "Shop all pieces",
    accent: "text-[var(--rebirth-teal)]",
  },
  "skateboard-rings": {
    eyebrow: "Recycled skateboard rings",
    title: "Broken boards, reborn by hand",
    body: "Layered maple from real skate decks, cut and finished into one-of-a-kind rings with color, scuffs, and community baked into every piece.",
    image: "/images/rebirth-2026/rebirth-1-3.webp",
    cta: "Shop skateboard rings",
    accent: "text-[var(--rebirth-teal)]",
  },
  "wedding-bands": {
    eyebrow: "Wood-lined wedding bands",
    title: "Bands as personal as the promise",
    body: "Durable metal shells with hand-fitted wood liners, made for people who want a ring with warmth, craft, and a story worth carrying.",
    image: "/images/wedding-bands/spalted-maple-burl/hand-lifestyle-shot-.webp",
    cta: "Shop wedding bands",
    accent: "text-[#d5a56c]",
    secondaryCta: {
      label: "Find your size",
      href: "/size-guide",
    },
  },
  apparel: {
    eyebrow: "Small-batch apparel",
    title: "Wear the message into the next chapter",
    body: "Limited apparel drops carrying the Rebirth philosophy into everyday life: bless what is breaking, embrace what is blooming.",
    image: "/images/products/everything-you-need-is-already-here-hoodie/main.webp",
    cta: "Shop apparel",
    accent: "text-[#d88a58]",
  },
  accessories: {
    eyebrow: "Objects with intention",
    title: "Small pieces with the same Rebirth soul",
    body: "Patches, tools, and useful objects made to carry the same material story and community energy as the rings.",
    image: "/images/products/rebirth-carabiners/main.webp",
    cta: "Shop accessories",
    accent: "text-[var(--rebirth-amber)]",
  },
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

function getProductMaterial(product: Product) {
  const material = product.metadata.material?.trim();
  if (material) return material;

  switch (product.metadata.collection) {
    case "skateboard-rings":
      return "Recycled skateboard maple";
    case "wedding-bands":
      return "Wood-lined metal";
    case "apparel":
      return "Cotton blend apparel";
    case "accessories":
      return "Rebirth accessories";
    default:
      return "Mixed Rebirth materials";
  }
}

function isRingProduct(product: Product) {
  return ["skateboard-rings", "wedding-bands"].includes(
    product.metadata.collection ?? ""
  );
}

function getRingSizes(product: Product) {
  if (!isRingProduct(product)) return [];
  return (
    product.metadata.ring_sizes
      ?.split(",")
      .map((size) => size.trim())
      .filter(Boolean) ?? []
  );
}

function matchesPrice(product: Product, price?: string) {
  if (!price) return true;

  switch (price) {
    case "under-50":
      return product.price < 5000;
    case "50-100":
      return product.price >= 5000 && product.price <= 10000;
    case "100-200":
      return product.price > 10000 && product.price <= 20000;
    case "200-plus":
      return product.price > 20000;
    default:
      return true;
  }
}

function normalizeSearchValue(value: string | null | undefined) {
  return value?.toLowerCase().replace(/[-_/]+/g, " ").trim() ?? "";
}

function productMatchesSearch(product: Product, query?: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;

  const haystack = [
    product.name,
    product.description,
    product.metadata.collection,
    product.metadata.material,
    getProductMaterial(product),
    product.metadata.subtitle,
    product.metadata.story,
    product.metadata.handmade_note,
  ]
    .map(normalizeSearchValue)
    .filter(Boolean)
    .join(" ");

  return normalizedQuery
    .split(/\s+/)
    .every((token) => haystack.includes(token));
}

function toFilterOptions(counts: Map<string, number>): ShopFilterOption[] {
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([value, count]) => ({ value, label: value, count }));
}

function getCollectionHeader(collection?: string) {
  if (!collection) return COLLECTION_HEADERS.all;
  return COLLECTION_HEADERS[collection] ?? COLLECTION_HEADERS.all;
}

function ShopCollectionHeader({ collection }: { collection?: string }) {
  const header = getCollectionHeader(collection);

  return (
    <section className="relative overflow-hidden bg-[var(--rebirth-warm-black)]">
      <div className="absolute inset-0">
        <Image
          src={header.image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--rebirth-warm-black)] via-[var(--rebirth-warm-black)]/78 to-[var(--rebirth-warm-black)]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rebirth-warm-black)]/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-20 md:px-6 md:py-28 lg:py-32">
        <p
          className={`mb-4 text-[11px] font-bold uppercase tracking-[2.6px] ${header.accent}`}
        >
          {header.eyebrow}
        </p>
        <h1 className="max-w-[13ch] font-[family-name:var(--font-serif)] text-[clamp(44px,7vw,84px)] font-bold italic leading-[1.02] text-[var(--rebirth-film-cream)]">
          {header.title}
        </h1>
        <p className="mt-6 max-w-[560px] text-base leading-[1.75] text-white/70 md:text-lg">
          {header.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="#products"
            className="inline-flex min-h-12 items-center justify-center bg-[var(--rebirth-teal)] px-7 py-3 font-[family-name:var(--font-caps)] text-base tracking-[2px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e7a6e]"
          >
            {header.cta}
          </Link>
          {header.secondaryCta ? (
            <Link
              href={header.secondaryCta.href}
              className="inline-flex min-h-12 items-center justify-center border border-white/30 px-6 py-3 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-white transition-all hover:border-white hover:bg-white/10"
            >
              {header.secondaryCta.label}
            </Link>
          ) : null}
          {collection ? (
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center border border-white/30 px-6 py-3 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-white transition-all hover:border-white hover:bg-white/10"
            >
              VIEW ALL
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

async function ProductGrid({
  collection,
  material,
  price,
  size,
  q,
  sort = "featured",
}: {
  collection?: string;
  material?: string;
  price?: string;
  size?: string;
  q?: string;
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

  const materialCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();
  for (const product of allProducts) {
    const productMaterial = getProductMaterial(product);
    materialCounts.set(
      productMaterial,
      (materialCounts.get(productMaterial) ?? 0) + 1
    );

    for (const ringSize of getRingSizes(product)) {
      sizeCounts.set(ringSize, (sizeCounts.get(ringSize) ?? 0) + 1);
    }
  }

  const collectionOptions = COLLECTIONS.map((collectionOption) => ({
    value: collectionOption.slug,
    label: collectionOption.label,
    count: counts[collectionOption.slug] ?? 0,
  }));
  const materialOptions = toFilterOptions(materialCounts);
  const sizeOptions = toFilterOptions(sizeCounts);

  // Filter by URL-backed state.
  let products: Product[];
  if (collection) {
    products = allProducts.filter(
      (product) => product.metadata.collection === collection
    );
  } else {
    products = allProducts;
  }

  if (material) {
    products = products.filter(
      (product) => getProductMaterial(product) === material
    );
  }

  if (price) {
    products = products.filter((product) => matchesPrice(product, price));
  }

  if (size) {
    products = products.filter((product) => getRingSizes(product).includes(size));
  }

  if (q) {
    products = products.filter((product) => productMatchesSearch(product, q));
  }

  // Sort
  products = sortProducts(products, sort);
  const reviewSummaries = await getReviewSummariesForProducts(
    products.map((product) => product.id)
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
      <Suspense>
        <ShopFilters
          collections={collectionOptions}
          materials={materialOptions}
          sizes={sizeOptions}
        />
      </Suspense>

      <div>
        <div className="mb-5 md:mb-7">
          <Suspense>
            <ShopSearch />
          </Suspense>
        </div>

        {/* Sort row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
          <div>
            <p className="text-muted-foreground text-sm">
              {products.length} {products.length === 1 ? "product" : "products"}
              {q ? (
                <>
                  {" "}
                  for <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
                </>
              ) : null}
            </p>
            {(collection || material || price || size || q) && (
              <Link
                href="/shop"
                className="mt-1 inline-flex text-sm font-medium text-[var(--rebirth-teal)] underline-offset-4 hover:underline"
              >
                Reset search and filters
              </Link>
            )}
          </div>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="border-border bg-muted/20 py-20 text-center">
            <p className="text-muted-foreground mx-auto max-w-[48ch] text-lg leading-relaxed">
              {collection || material || price || size || q
                ? "No pieces match that search yet. Reset the search and filters to keep exploring everything Rebirth has available."
                : "No products available yet. Check back soon!"}
            </p>
            {collection || material || price || size || q ? (
              <Link
                href="/shop"
                className="mt-6 inline-flex min-h-11 items-center justify-center bg-[var(--rebirth-warm-black)] px-6 py-3 font-[family-name:var(--font-caps)] text-sm tracking-[2px] text-white transition-all hover:-translate-y-0.5"
              >
                RESET SEARCH
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 lg:gap-10">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                reviewSummary={reviewSummaries[product.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string;
    material?: string;
    price?: string;
    size?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const { collection, material, price, size, q, sort } = await searchParams;

  return (
    <>
      <ShopCollectionHeader collection={collection} />

      {/* Products grid — luxury spacing */}
      <section id="products" className="px-6 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid
              collection={collection}
              material={material}
              price={price}
              size={size}
              q={q}
              sort={sort}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
