import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getProductBySlug,
  formatPrice,
  listProducts,
} from "@/lib/payments/products";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { TrustBadges } from "@/components/shop/trust-badges";
import { ProductStory } from "@/components/shop/product-story";
import { RelatedProducts } from "@/components/shop/related-products";
import { StickyAddToCartWrapper } from "./sticky-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, Hammer } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
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

  const ringSizes = product.metadata.ring_sizes
    ?.split(",")
    .map((s) => s.trim());

  const compareAt = product.metadata.compare_at_price
    ? parseInt(product.metadata.compare_at_price, 10)
    : null;
  const isOnSale = compareAt !== null && compareAt > product.price;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: "Rebirth World",
    },
    offers: {
      "@type": "Offer",
      url: `https://rebirth.world/shop/${product.slug}`,
      priceCurrency: product.currency.toUpperCase(),
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Image Gallery */}
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />

            {/* Product Details */}
            <div className="flex flex-col">
              {/* Collection badge */}
              {product.metadata.collection && (
                <Badge
                  variant="outline"
                  className="mb-3 w-fit uppercase tracking-widest text-[10px] font-semibold"
                >
                  {product.metadata.collection.replace(/-/g, " ")}
                </Badge>
              )}

              {/* Name */}
              <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
                {product.name}
              </h1>

              {/* Subtitle */}
              {product.metadata.subtitle && (
                <p className="mt-1.5 text-base text-muted-foreground">
                  {product.metadata.subtitle}
                </p>
              )}

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">
                <p className="text-2xl font-semibold text-primary">
                  {formatPrice(product.price, product.currency)}
                </p>
                {isOnSale && compareAt && (
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(compareAt, product.currency)}
                  </p>
                )}
              </div>

              {/* Handmade note */}
              {product.metadata.handmade_note && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                  <Hammer className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {product.metadata.handmade_note}
                  </p>
                </div>
              )}

              {/* Lead time */}
              {product.metadata.lead_time && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>
                    Made to order — ships in {product.metadata.lead_time} days
                  </span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}

              {/* Add to Cart */}
              <StickyAddToCartWrapper product={product}>
                <AddToCartButton
                  product={product}
                  availableSizes={ringSizes}
                  engravingAvailable={
                    product.metadata.engraving_available === "true"
                  }
                />
              </StickyAddToCartWrapper>

              {/* Trust Badges */}
              <div className="mt-6">
                <TrustBadges
                  marketingFeatures={product.marketingFeatures}
                />
              </div>

              {/* Accordion */}
              <Accordion
                type="single"
                collapsible
                className="mt-6 w-full"
                defaultValue="details"
              >
                <AccordionItem value="details">
                  <AccordionTrigger>Details</AccordionTrigger>
                  <AccordionContent>
                    <dl className="space-y-2 text-sm text-muted-foreground">
                      {product.metadata.material && (
                        <div>
                          <dt className="font-medium text-foreground">
                            Material
                          </dt>
                          <dd>{product.metadata.material}</dd>
                        </div>
                      )}
                      {product.metadata.weight && (
                        <div>
                          <dt className="font-medium text-foreground">
                            Weight
                          </dt>
                          <dd>{product.metadata.weight}g</dd>
                        </div>
                      )}
                      {product.metadata.engraving_available === "true" && (
                        <div>
                          <dt className="font-medium text-foreground">
                            Engraving
                          </dt>
                          <dd>Available (up to 10 characters)</dd>
                        </div>
                      )}
                    </dl>
                  </AccordionContent>
                </AccordionItem>

                {ringSizes && ringSizes.length > 0 && (
                  <AccordionItem value="sizing">
                    <AccordionTrigger>Sizing Guide</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Available sizes: {ringSizes.join(", ")}. Not sure of
                        your size? Wrap a piece of string around your finger
                        and measure the length in millimeters, then compare
                        with a standard ring size chart.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {product.metadata.care_instructions && (
                  <AccordionItem value="care">
                    <AccordionTrigger>Care Instructions</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        {product.metadata.care_instructions}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        Free standard shipping on all US orders. International
                        shipping available at checkout.
                      </p>
                      <p>
                        30-day return policy. Items must be unworn and in
                        original condition. Custom engraved items are
                        final sale.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Story section */}
          {product.metadata.story && (
            <ProductStory
              story={product.metadata.story}
              productName={product.name}
            />
          )}

          {/* Related products */}
          {product.metadata.collection && (
            <Suspense>
              <RelatedProducts
                collection={product.metadata.collection}
                excludeId={product.id}
              />
            </Suspense>
          )}
        </div>
      </section>
    </>
  );
}
