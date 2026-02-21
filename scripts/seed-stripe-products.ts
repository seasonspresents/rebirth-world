/**
 * Seed Stripe test mode with Rebirth World products.
 * Run: npx tsx scripts/seed-stripe-products.ts
 */
import Stripe from "stripe";
import { config } from "dotenv";
config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SeedProduct {
  name: string;
  description: string;
  images: string[];
  price: number; // cents
  metadata: Record<string, string>;
}

const products: SeedProduct[] = [
  // Skateboard Rings
  {
    name: "Ocean Wave Ring",
    description:
      "Handcrafted from 7-layer recycled skateboard maple. Each ring captures the unique color layers of a board that shredded the North Shore.",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"],
    price: 2500,
    metadata: {
      collection: "skateboard-rings",
      material: "recycled-skateboard",
      ring_sizes: "5,6,7,8,9,10,11,12",
      featured: "true",
      slug: "ocean-wave-ring",
      subtitle: "Recycled Maple • North Shore",
      story: "Born from a board that rode Pipeline. Each layer tells a story of salt, sun, and stoke.",
      engraving_available: "true",
      lead_time: "5-7",
      sort_order: "1",
    },
  },
  {
    name: "Sunset Fade Ring",
    description:
      "Warm amber and crimson layers from a recycled skateboard deck. Like a Hawaiian sunset you can wear every day.",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"],
    price: 2500,
    metadata: {
      collection: "skateboard-rings",
      material: "recycled-skateboard",
      ring_sizes: "5,6,7,8,9,10,11,12",
      featured: "true",
      slug: "sunset-fade-ring",
      subtitle: "Recycled Maple • Warm Tones",
      story: "The warmest tones come from boards that spent their lives in the sun.",
      engraving_available: "true",
      lead_time: "5-7",
      sort_order: "2",
    },
  },
  {
    name: "Midnight Stripe Ring",
    description:
      "Deep blacks and natural wood tones from recycled skate decks. Bold contrast for those who ride after dark.",
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"],
    price: 2500,
    metadata: {
      collection: "skateboard-rings",
      material: "recycled-skateboard",
      ring_sizes: "6,7,8,9,10,11,12",
      featured: "false",
      slug: "midnight-stripe-ring",
      subtitle: "Recycled Maple • Dark Tones",
      story: "For the night riders. Dark layers from boards that know every streetlight.",
      engraving_available: "true",
      lead_time: "5-7",
      sort_order: "3",
    },
  },
  // Wedding Bands
  {
    name: "Koa Heritage Band",
    description:
      "Gold-plated steel shell lined with stabilized Hawaiian Koa wood. A premium wedding band that carries the spirit of the islands.",
    images: ["https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"],
    price: 15000,
    metadata: {
      collection: "wedding-bands",
      material: "steel-koa",
      ring_sizes: "6,7,8,9,10,11,12",
      featured: "true",
      slug: "koa-heritage-band",
      subtitle: "Gold Steel • Hawaiian Koa",
      story: "Koa is sacred in Hawaii. This band carries that reverence into your forever promise.",
      engraving_available: "true",
      lead_time: "10-14",
      sort_order: "4",
    },
  },
  {
    name: "Bog Oak Eternal Band",
    description:
      "Gold-plated steel shell with ancient Irish Bog Oak liner. Wood preserved for thousands of years, now part of your story.",
    images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80"],
    price: 17500,
    metadata: {
      collection: "wedding-bands",
      material: "steel-bog-oak",
      ring_sizes: "6,7,8,9,10,11,12",
      featured: "true",
      slug: "bog-oak-eternal-band",
      subtitle: "Gold Steel • Ancient Bog Oak",
      story: "This wood is over 5,000 years old. Some things are truly meant to last.",
      engraving_available: "true",
      lead_time: "10-14",
      sort_order: "5",
    },
  },
  // Apparel
  {
    name: "Embrace Change Hoodie",
    description:
      "Premium heavyweight hoodie with Rebirth World logo. Soft-washed cotton blend that gets better with every wear.",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
    price: 6500,
    metadata: {
      collection: "apparel",
      material: "cotton-blend",
      featured: "false",
      slug: "embrace-change-hoodie",
      subtitle: "Premium Cotton Blend",
      engraving_available: "false",
      lead_time: "3-5",
      sort_order: "6",
    },
  },
  {
    name: "Rebirth Logo Tee",
    description:
      "Classic fit tee with the Rebirth World lotus mark. 100% organic cotton, screen-printed in Hawaii.",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
    price: 3500,
    metadata: {
      collection: "apparel",
      material: "organic-cotton",
      featured: "false",
      slug: "rebirth-logo-tee",
      subtitle: "Organic Cotton • Screen-printed",
      engraving_available: "false",
      lead_time: "3-5",
      sort_order: "7",
    },
  },
];

async function seed() {
  console.log("Seeding Stripe test products...\n");

  for (const p of products) {
    // Check if product already exists by slug
    const existing = await stripe.products.search({
      query: `metadata['slug']:'${p.metadata.slug}'`,
    });

    if (existing.data.length > 0) {
      console.log(`  ✓ ${p.name} already exists (${existing.data[0].id})`);
      continue;
    }

    const product = await stripe.products.create({
      name: p.name,
      description: p.description,
      images: p.images,
      metadata: p.metadata,
      default_price_data: {
        unit_amount: p.price,
        currency: "usd",
      },
    });

    console.log(`  + ${p.name} → ${product.id} ($${(p.price / 100).toFixed(2)})`);
  }

  console.log("\nDone! Products visible at https://dashboard.stripe.com/test/products");
}

seed().catch(console.error);
