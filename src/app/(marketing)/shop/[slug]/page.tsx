import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getProductBySlug,
  formatPrice,
  listProducts,
} from "@/lib/payments/products";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { Product3DToggle } from "@/components/shop/product-3d-toggle";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { TrustBadges } from "@/components/shop/trust-badges";
import { RelatedProducts } from "@/components/shop/related-products";
import { StickyAddToCartWrapper } from "./sticky-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Clock, Hammer, Shield, Truck, RotateCcw } from "lucide-react";

/* PDP section components — wireframe-matched */
import { PDPSocialProofScroll, PDPSocialProofBanner } from "@/components/pdp/social-proof-scroll";
import { PDPBenefitsBar } from "@/components/pdp/benefits-bar";
import { ValuePropSection } from "@/components/pdp/value-prop-section";
import { PDPDifferentiators } from "@/components/pdp/differentiators";
import { PDPGuaranteeSection } from "@/components/pdp/guarantee-section";
import { PDPFaq } from "@/components/pdp/pdp-faq";
import { PDPFinalCTA } from "@/components/pdp/final-cta";

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
  const savings = isOnSale && compareAt ? compareAt - product.price : 0;
  const savingsPercent = isOnSale && compareAt
    ? Math.round((savings / compareAt) * 100)
    : 0;

  const productTag = product.metadata.badge_text
    || (product.metadata.featured === "true" ? "Best Seller" : null);

  // JSON-LD structured data — content is from our own Stripe product data, not user input
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* ============================================
          SECTION 1: Product Hero (Above the Fold)
          Image left + Purchase info right
          ============================================ */}
      <section className="bg-grain px-6 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12 lg:gap-16">

            {/* LEFT: Image Gallery */}
            <Product3DToggle
              show3D={
                product.metadata.collection === "skateboard-rings" ||
                product.metadata.collection === "wedding-bands"
              }
              imageGallery={
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                  slug={product.slug}
                />
              }
            />

            {/* RIGHT: Purchase Info — sticky */}
            <div className="flex flex-col md:sticky md:top-20 md:self-start">

              {/* Product tag */}
              {productTag && (
                <span className="mb-3 w-fit rounded-sm bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {productTag}
                </span>
              )}

              {/* Star rating */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-[var(--rebirth-amber)] text-[var(--rebirth-amber)]" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Rated 4.9/5 by 1,000+ customers
                </span>
              </div>

              {/* Benefit headline + Product name */}
              <h1 className="text-2xl leading-[1.1] tracking-tight md:text-3xl lg:text-4xl font-[family-name:var(--font-display)]">
                {product.metadata.subtitle
                  ? `${product.metadata.subtitle} — `
                  : ""
                }
                {product.name}
              </h1>

              {/* Price with savings */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                {isOnSale && compareAt && (
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(compareAt, product.currency)}
                  </p>
                )}
                <p className="text-2xl font-semibold text-primary">
                  {formatPrice(product.price, product.currency)}
                </p>
                {isOnSale && savings > 0 && (
                  <span className="rounded-sm bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    You Save {formatPrice(savings, product.currency)} ({savingsPercent}%)
                  </span>
                )}
              </div>

              {/* Product description */}
              {product.description && (
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}

              {/* Key benefits checklist */}
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  "Handcrafted one at a time",
                  "Recycled skateboard wood",
                  "Water-resistant CA finish",
                  "1-year warranty included",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-[10px] text-primary">&#10003;</span>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Variant selectors + Add to Cart */}
              <StickyAddToCartWrapper product={product}>
                <AddToCartButton
                  product={product}
                  availableSizes={ringSizes}
                  engravingAvailable={
                    product.metadata.engraving_available === "true"
                  }
                />
              </StickyAddToCartWrapper>

              {/* Trust icons: Guarantee | Return Policy | Shipping */}
              <div className="mt-6 flex items-center gap-6 border-t border-border/50 pt-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="size-4" />
                  <span>Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCcw className="size-4" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="size-4" />
                  <span>Free Shipping $75+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Product Details Accordion */}
      <section className="border-y border-border/50 px-6 py-8">
        <div className="mx-auto max-w-[1200px]">
          <Accordion type="single" collapsible defaultValue="details" className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-base font-semibold py-4">Product Details</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-2 text-sm text-muted-foreground">
                  {product.metadata.material && (
                    <div><dt className="font-medium text-foreground">Material</dt><dd>{product.metadata.material}</dd></div>
                  )}
                  {product.metadata.weight && (
                    <div><dt className="font-medium text-foreground">Weight</dt><dd>{product.metadata.weight}g</dd></div>
                  )}
                  {product.metadata.engraving_available === "true" && (
                    <div><dt className="font-medium text-foreground">Engraving</dt><dd>Available (up to 10 characters, +$9)</dd></div>
                  )}
                </dl>
              </AccordionContent>
            </AccordionItem>
            {ringSizes && ringSizes.length > 0 && (
              <AccordionItem value="sizing">
                <AccordionTrigger className="text-base font-semibold py-4">How It Works / Sizing</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Available sizes: {ringSizes.join(", ")}. Wrap string around your finger, measure in mm, and compare with a ring size chart. Wood-lined bands run ~1 size smaller. When in doubt, size up.
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-base font-semibold py-4">Shipping &amp; Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Free standard shipping on US orders $75+ (5-10 business days). Express and international available at checkout.</p>
                  <p>30-day returns on unworn items. Engraved pieces are final sale. 1-year craftsmanship warranty.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* SECTION 3: Social Proof (UGC) Scrollable */}
      <PDPSocialProofScroll />

      {/* SECTION 4: Benefits Bar */}
      <PDPBenefitsBar />

      {/* SECTION 5: Value Prop #1 — Image + Text */}
      <ValuePropSection
        heading="From Board to Ring — Entirely by Hand"
        description="Every Rebirth ring starts as a broken skateboard donated by local skaters on the North Shore. Daniel shapes each one by hand on a lathe — seven layers of maple, sanded through progressively finer grits until the layers emerge smooth and the ring finds its form."
        image={product.images[1] || product.images[0]}
        imageAlt={`${product.name} crafting process`}
      />

      {/* SECTION 6: Value Prop #2 — Benefits + Image (reversed) */}
      <ValuePropSection
        heading="Built to Last, Designed to Be Worn"
        description="Each ring is sealed with thin CA glue for a glass-like finish that's water-resistant and durable."
        image={product.images[2] || product.images[0]}
        imageAlt={`${product.name} close-up`}
        reversed
        benefits={[
          "Water-resistant CA glue finish — not polyurethane",
          "Silky smooth to the touch, polished by hand",
          "Lightweight yet extremely durable",
          "Each ring's wood grain pattern is completely unique",
        ]}
      />

      {/* SECTION 7: Social Proof Banner */}
      <PDPSocialProofBanner />

      {/* SECTION 8: Differentiators (3x2 grid) */}
      <PDPDifferentiators ctaHref={`/shop/${product.slug}`} />

      {/* SECTION 9: Benefits Bar (repeated) */}
      <PDPBenefitsBar />

      {/* SECTION 10: Value Prop #3 */}
      <ValuePropSection
        heading="A Ring with a Story"
        description="Every board that becomes a ring has history — scratches from kickflips, graphics from a favorite brand, layers of color from years of skating. That story lives on in your ring."
        image={product.images[3] || product.images[0]}
        imageAlt={`${product.name} lifestyle`}
        benefits={[
          "Community-donated skateboard decks",
          "Austrian master jeweler heritage",
          "Humanitarian mission at the core",
          "Zero waste — every scrap is used",
        ]}
      />

      {/* SECTION 11: Money Back Guarantee */}
      <PDPGuaranteeSection ctaHref={`/shop/${product.slug}`} />

      {/* SECTION 12: Social Proof Banner */}
      <PDPSocialProofBanner heading="4.9 average from 1,000+ happy customers" />

      {/* SECTION 13: FAQ */}
      <PDPFaq image={product.images[0]} ctaHref={`/shop/${product.slug}`} />

      {/* SECTION 14: Social Proof Scroll */}
      <PDPSocialProofScroll heading="What customers are saying" />

      {/* SECTION 15: Final CTA — Background Image Overlay */}
      <PDPFinalCTA
        heading={`Get your ${product.name} today`}
        description="Handcrafted from recycled skateboards in our North Shore workshop. No two are alike — yours is waiting."
        ctaHref={`/shop/${product.slug}`}
        backgroundImage={product.images[0]}
      />

      {/* Related Products */}
      {product.metadata.collection && (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <Suspense>
              <RelatedProducts
                collection={product.metadata.collection}
                excludeId={product.id}
              />
            </Suspense>
          </div>
        </section>
      )}
    </>
  );
}
