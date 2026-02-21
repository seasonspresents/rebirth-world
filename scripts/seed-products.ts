/**
 * Seed Stripe test products for Rebirth World
 *
 * Run with: npx tsx scripts/seed-products.ts
 *
 * Uses .env.local for STRIPE_SECRET_KEY
 */

import Stripe from "stripe";
import { config } from "dotenv";

config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SeedProduct {
  name: string;
  description: string;
  images: string[];
  metadata: Record<string, string>;
  marketing_features: string[];
  price: number; // in cents
}

const products: SeedProduct[] = [
  // --- Skateboard Rings ---
  {
    name: "Ocean Wave Ring",
    description:
      "A striking ring crafted from layers of recycled skateboard maple, revealing vibrant blues and teals embedded in the wood grain. Each ring tells the story of countless rides along the North Shore.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    ],
    metadata: {
      collection: "skateboard-rings",
      material: "Recycled skateboard maple, resin finish",
      slug: "ocean-wave-ring",
      featured: "true",
      subtitle: "Reclaimed maple & ocean-blue resin",
      story:
        "Born from boards donated by North Shore locals, this ring carries the energy of Hawaiian waves. The blue resin represents the Pacific horizon that inspires every session.",
      care_instructions:
        "Avoid prolonged water exposure. Clean with a soft dry cloth. Store in the included pouch when not wearing.",
      handmade_note:
        "Each piece takes 3-4 hours of hands-on crafting by Daniel in his Haleiwa workshop.",
      lead_time: "5-7",
      weight: "4",
      engraving_available: "true",
      badge_text: "Bestseller",
      sort_order: "1",
      ring_sizes: "5,6,7,8,9,10,11,12",
    },
    marketing_features: [
      "Handcrafted in Hawaii",
      "Free US shipping",
      "30-day returns",
      "Lifetime warranty",
    ],
    price: 7500,
  },
  {
    name: "Sunset Fade Ring",
    description:
      "Layers of warm amber, crimson, and gold from recycled skateboard decks create a gradient that mirrors a Hawaiian sunset. No two rings share the same pattern.",
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80",
    ],
    metadata: {
      collection: "skateboard-rings",
      material: "Recycled skateboard maple with amber tones",
      slug: "sunset-fade-ring",
      featured: "true",
      subtitle: "Warm amber layers from reclaimed decks",
      story:
        "Each ring captures the magic of a North Shore sunset—layers of color that could never be manufactured, only discovered in the wood of boards that have lived full lives.",
      care_instructions:
        "Keep away from harsh chemicals. Wipe with a damp cloth if needed and dry immediately.",
      handmade_note: "Hand-turned and shaped over 4 hours of meticulous work.",
      lead_time: "5-7",
      weight: "4",
      engraving_available: "true",
      sort_order: "2",
      ring_sizes: "5,6,7,8,9,10,11,12",
    },
    marketing_features: [
      "Handcrafted in Hawaii",
      "Free US shipping",
      "30-day returns",
      "Lifetime warranty",
    ],
    price: 6500,
  },
  {
    name: "Midnight Grip Ring",
    description:
      "Dark, dramatic layers of black grip tape residue fused with recycled maple create a bold, edgy aesthetic. A statement piece for those who ride after hours.",
    images: [
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ],
    metadata: {
      collection: "skateboard-rings",
      material: "Recycled skateboard with grip tape carbon layers",
      slug: "midnight-grip-ring",
      featured: "false",
      subtitle: "Dark carbon layers & reclaimed maple",
      story:
        "The grip tape that once kept feet locked in during kickflips now creates the dark, dramatic layers in this ring. Grit meets grace.",
      care_instructions:
        "Clean gently with a soft cloth. Avoid submerging in water.",
      handmade_note:
        "Every ring is unique—the grip tape layers create unrepeatable patterns.",
      lead_time: "7-10",
      weight: "5",
      engraving_available: "true",
      sort_order: "3",
      ring_sizes: "6,7,8,9,10,11,12",
    },
    marketing_features: [
      "Handcrafted in Hawaii",
      "Free US shipping",
      "30-day returns",
      "Lifetime warranty",
    ],
    price: 8500,
  },
  {
    name: "Rainbow Stack Ring",
    description:
      "The most vibrant expression in the collection. Multiple colored plies from different skateboard decks are stacked to reveal a full spectrum of hues. Pure joy on your finger.",
    images: [
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
    metadata: {
      collection: "skateboard-rings",
      material: "Multi-colored recycled skateboard maple",
      slug: "rainbow-stack-ring",
      featured: "false",
      subtitle: "Full-spectrum reclaimed skateboard layers",
      care_instructions:
        "Store in a cool, dry place. Clean with a microfiber cloth.",
      handmade_note: "Requires boards from 3-4 different decks to achieve the full spectrum.",
      lead_time: "7-10",
      weight: "4",
      engraving_available: "true",
      compare_at_price: "9500",
      badge_text: "Limited run",
      sort_order: "4",
      ring_sizes: "5,6,7,8,9,10,11,12",
    },
    marketing_features: [
      "Handcrafted in Hawaii",
      "Free US shipping",
      "30-day returns",
      "Lifetime warranty",
    ],
    price: 7500,
  },

  // --- Wedding Bands ---
  {
    name: "Koa Wood & Steel Band",
    description:
      "A premium wedding band featuring a brushed steel exterior lined with Hawaiian Koa wood. The warmth of the islands meets modern strength—a ring built to last as long as your love.",
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ],
    metadata: {
      collection: "wedding-bands",
      material: "Brushed stainless steel with Hawaiian Koa wood liner",
      slug: "koa-wood-steel-band",
      featured: "true",
      subtitle: "Brushed steel & Hawaiian Koa wood",
      story:
        "Koa is sacred in Hawaiian culture—a wood reserved for royalty and canoe building. We source fallen Koa responsibly, giving it new life as the warm heart of your wedding band.",
      care_instructions:
        "Remove before swimming or heavy labor. Polish steel with provided cloth. Oil the Koa liner monthly with the included wood conditioner.",
      handmade_note:
        "Each band is hand-fitted and finished by Daniel using techniques learned from his father, Austrian master jeweler Christoph Malzl.",
      lead_time: "10-14",
      weight: "8",
      engraving_available: "true",
      badge_text: "Premium",
      sort_order: "5",
      ring_sizes: "6,7,8,9,10,11,12,13",
    },
    marketing_features: [
      "Handcrafted in Hawaii",
      "Free express shipping",
      "Lifetime exchange",
      "Ring sizing kit included",
    ],
    price: 24500,
  },
  {
    name: "Bog Oak & Steel Band",
    description:
      "Ancient meets modern in this striking wedding band. Lined with 5,000-year-old bog oak preserved in European peat bogs, wrapped in polished steel. A ring with literal millennia of history.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    ],
    metadata: {
      collection: "wedding-bands",
      material: "Polished stainless steel with ancient bog oak liner",
      slug: "bog-oak-steel-band",
      featured: "false",
      subtitle: "Polished steel & 5,000-year-old bog oak",
      story:
        "This oak was a living tree when the pyramids were being built. Preserved for millennia in European peat bogs, it now lines a ring that symbolizes timeless commitment.",
      care_instructions:
        "Avoid prolonged water contact. Polish with provided cloth. The bog oak will develop a richer patina over time.",
      handmade_note:
        "The ancient bog oak is carefully sourced from European artisans and hand-fitted in our Hawaii workshop.",
      lead_time: "10-14",
      weight: "9",
      engraving_available: "true",
      sort_order: "6",
      ring_sizes: "7,8,9,10,11,12,13",
    },
    marketing_features: [
      "Handcrafted in Hawaii",
      "Free express shipping",
      "Lifetime exchange",
      "Ring sizing kit included",
    ],
    price: 29500,
  },

  // --- Apparel ---
  {
    name: "Embrace Change Tee",
    description:
      "Premium heavyweight tee featuring the Rebirth World lotus mark and our signature tagline. Printed with water-based inks on 100% organic cotton.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    metadata: {
      collection: "apparel",
      material: "100% organic cotton, 220gsm",
      slug: "embrace-change-tee",
      featured: "false",
      subtitle: "Heavyweight organic cotton",
      care_instructions:
        "Machine wash cold, tumble dry low. Print will soften and age beautifully over time.",
      lead_time: "3-5",
      weight: "220",
      engraving_available: "false",
      sort_order: "7",
    },
    marketing_features: [
      "Organic cotton",
      "Free US shipping",
      "Water-based inks",
      "Unisex fit",
    ],
    price: 3800,
  },
  {
    name: "North Shore Hoodie",
    description:
      "A cozy pullover hoodie with the Rebirth World logo embroidered on the chest. Made from a cotton-recycled poly blend for warmth and sustainability.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079470-0a4536e2b2f7?w=800&q=80",
    ],
    metadata: {
      collection: "apparel",
      material: "60% organic cotton, 40% recycled polyester, 320gsm",
      slug: "north-shore-hoodie",
      featured: "false",
      subtitle: "Cotton-recycled poly blend",
      care_instructions:
        "Machine wash cold inside out. Hang dry for best results.",
      lead_time: "3-5",
      weight: "480",
      engraving_available: "false",
      compare_at_price: "7500",
      badge_text: "New",
      sort_order: "8",
    },
    marketing_features: [
      "Recycled materials",
      "Free US shipping",
      "Embroidered logo",
      "Unisex fit",
    ],
    price: 6500,
  },
];

async function seed() {
  console.log("Seeding Stripe test products...\n");

  for (const p of products) {
    try {
      const stripeProduct = await stripe.products.create({
        name: p.name,
        description: p.description,
        images: p.images,
        metadata: p.metadata,
        marketing_features: p.marketing_features.map((name) => ({ name })),
        default_price_data: {
          unit_amount: p.price,
          currency: "usd",
        },
      });

      console.log(
        `  ✓ ${p.name} — $${(p.price / 100).toFixed(2)} (${stripeProduct.id})`
      );
    } catch (err) {
      console.error(`  ✗ ${p.name}:`, err);
    }
  }

  console.log("\nDone! Products are now in your Stripe test dashboard.");
}

seed();
