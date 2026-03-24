type ProductJsonLdProps = {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  slug: string;
  availability?: string;
  ratingValue?: number;
  reviewCount?: number;
};

type BreadcrumbJsonLdProps = {
  items: Array<{ name: string; href: string }>;
};

type FAQPageJsonLdProps = {
  questions: Array<{ question: string; answer: string }>;
};

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Rebirth World",
        url: "https://rebirth.world",
        logo: "https://rebirth.world/logo.png",
        description:
          "Handcrafted rings made from recycled skateboards and wood-lined metal wedding bands. Shaped by hand on the North Shore of Oahu.",
        sameAs: [],
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "USD",
  slug,
  availability = "https://schema.org/InStock",
  ratingValue,
  reviewCount,
}: ProductJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability,
      url: `https://rebirth.world/shop/${slug}`,
    },
  };

  if (ratingValue !== undefined && reviewCount !== undefined) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    };
  }

  return <JsonLdScript data={data} />;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `https://rebirth.world${item.href}`,
        })),
      }}
    />
  );
}

export function FAQPageJsonLd({ questions }: FAQPageJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      }}
    />
  );
}
