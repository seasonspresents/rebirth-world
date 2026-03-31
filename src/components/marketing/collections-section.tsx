import { listProducts } from "@/lib/payments/products";
import { CollectionsAccordion } from "@/components/marketing/collections-accordion";

const COLLECTION_META: Record<string, { title: string; description: string }> = {
  "skateboard-rings": {
    title: "Recycled Skateboard Rings",
    description:
      "I shape every ring from broken skateboards donated by local riders. Seven layers of Canadian maple — sanded, sealed, and turned into something you'll never want to take off. Each one is completely unique.",
  },
  "wedding-bands": {
    title: "Premium Wedding Bands",
    description:
      "Gold-plated ARZ stainless steel shells lined with stabilized exotic wood — Red Amboyna Burl, Spalted Maple Burl, Hawaiian koa. Built to be worn every day for a lifetime. My father taught me to make things that endure.",
  },
  apparel: {
    title: "Limited Apparel Drops",
    description:
      "Each collection is a one-of-a-kind limited seasonal drop tied to a theme I'm currently resonating with, designed with local artists, meant to carry a wearable message. When it's gone, it's gone.",
  },
};

export async function CollectionsSection() {
  const allProducts = await listProducts();

  // Group by collection
  const grouped: Record<string, typeof allProducts> = {};
  for (const p of allProducts) {
    const col = p.metadata.collection ?? "other";
    if (!grouped[col]) grouped[col] = [];
    grouped[col].push(p);
  }

  // Build ordered collection data
  const order = ["skateboard-rings", "wedding-bands", "apparel"];
  const collections = order
    .filter((slug) => grouped[slug] && grouped[slug].length > 0)
    .map((slug, i, arr) => ({
      slug,
      number: String(i + 1).padStart(2, "0"),
      total: String(arr.length).padStart(2, "0"),
      title: COLLECTION_META[slug]?.title ?? slug.replace(/-/g, " "),
      description: COLLECTION_META[slug]?.description ?? "",
      products: grouped[slug],
    }));

  if (collections.length === 0) return null;

  return <CollectionsAccordion collections={collections} />;
}
