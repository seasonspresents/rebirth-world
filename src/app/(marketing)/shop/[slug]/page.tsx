import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, listProducts } from "@/lib/payments/products";
import { RingPDP } from "@/components/pdp/ring/ring-pdp";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const collection = product.metadata?.collection;

  // JSON-LD — from our own Stripe product data (trusted)
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Rebirth World" },
    offers: {
      "@type": "Offer",
      url: `https://rebirth.world/shop/${product.slug}`,
      priceCurrency: product.currency.toUpperCase(),
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  }).replace(/</g, "\\u003c");

  // Route to appropriate PDP template based on collection
  if (collection === "apparel") {
    // Phase 3: Apparel PDP template — for now fall back to Ring PDP
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <RingPDP product={product} />
      </>
    );
  }

  // Default: Ring PDP (skateboard-rings, wedding-bands, or unspecified)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <RingPDP product={product} />
    </>
  );
}
