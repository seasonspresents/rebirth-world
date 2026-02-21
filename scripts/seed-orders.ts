/**
 * Seed Supabase with realistic mock orders for testing the admin portal.
 * Run: npx tsx scripts/seed-orders.ts
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// --- Mock data pools ---

const firstNames = [
  "Kai", "Leilani", "Jake", "Malia", "Bryce", "Noa", "Sierra",
  "Finn", "Jade", "Tanner", "Luna", "Cole", "Makena", "Reef",
  "Aria", "Dash", "Isla", "Keanu", "Sage", "Phoenix", "Willow",
  "Chase", "Coral", "Dylan", "Harper", "Jasper", "Kira", "Mason",
  "Olive", "Ryder", "Stella", "Ty", "Violet", "Wren", "Zara",
];

const lastNames = [
  "Nakamura", "Peterson", "Chen", "Kalani", "Torres", "Andersen",
  "Kealoha", "Park", "Williams", "Reyes", "Hoffman", "Silva",
  "O'Brien", "Tanaka", "Vasquez", "Lee", "Mitchell", "Russo",
  "Brooks", "Nguyen", "Campbell", "Foster", "Garcia", "Hensley",
  "Jensen", "Kim", "Larson", "Martinez", "Nelson", "Ortiz",
];

const cities = [
  { city: "Haleiwa", state: "HI", zip: "96712" },
  { city: "Honolulu", state: "HI", zip: "96815" },
  { city: "Kailua", state: "HI", zip: "96734" },
  { city: "San Diego", state: "CA", zip: "92101" },
  { city: "Los Angeles", state: "CA", zip: "90001" },
  { city: "San Francisco", state: "CA", zip: "94102" },
  { city: "Portland", state: "OR", zip: "97201" },
  { city: "Seattle", state: "WA", zip: "98101" },
  { city: "Austin", state: "TX", zip: "73301" },
  { city: "Denver", state: "CO", zip: "80201" },
  { city: "Nashville", state: "TN", zip: "37201" },
  { city: "Brooklyn", state: "NY", zip: "11201" },
  { city: "Venice Beach", state: "CA", zip: "90291" },
  { city: "Encinitas", state: "CA", zip: "92024" },
  { city: "Santa Cruz", state: "CA", zip: "95060" },
  { city: "Maui", state: "HI", zip: "96768" },
  { city: "Boulder", state: "CO", zip: "80301" },
  { city: "Bend", state: "OR", zip: "97701" },
];

const streetAddresses = [
  "123 North Shore Dr", "456 Pipeline Rd", "789 Sunset Blvd",
  "321 Oceanview Ave", "654 Palm St", "987 Wave Ln",
  "147 Boardwalk Dr", "258 Reef Rd", "369 Tide Way",
  "741 Coral St", "852 Beach Blvd", "963 Surf Ave",
  "159 Harbor Ln", "267 Marina Dr", "378 Cliff Rd",
];

// Products that match our Stripe seed data
const products = [
  {
    name: "Ocean Wave Ring",
    collection: "skateboard-rings",
    price: 2500,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    engravingAvailable: true,
  },
  {
    name: "Sunset Fade Ring",
    collection: "skateboard-rings",
    price: 2500,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    engravingAvailable: true,
  },
  {
    name: "Midnight Stripe Ring",
    collection: "skateboard-rings",
    price: 2500,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    engravingAvailable: true,
  },
  {
    name: "Koa Heritage Band",
    collection: "wedding-bands",
    price: 15000,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    engravingAvailable: true,
  },
  {
    name: "Bog Oak Eternal Band",
    collection: "wedding-bands",
    price: 17500,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    engravingAvailable: true,
  },
  {
    name: "Embrace Change Hoodie",
    collection: "apparel",
    price: 6500,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    sizes: [],
    engravingAvailable: false,
  },
  {
    name: "Rebirth Logo Tee",
    collection: "apparel",
    price: 3500,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    sizes: [],
    engravingAvailable: false,
  },
];

const engravings = [
  "Forever", "Aloha", "Ride On", "Love", "Be Free", "Stoked",
  "North Shore", "OG", "Always", "Ohana", "Mahalo", "Waves",
  "2026", "J+M", "K+L", "♥", "Shred",
];

const carriers = ["USPS", "UPS", "FedEx", "DHL"];

const adminNotes = [
  "Customer requested gift wrapping.",
  "Rush order — expedite if possible.",
  "Repeat customer, upgraded to free express.",
  "Custom color request — used teal/amber deck.",
  "Wedding order — deliver before June 15.",
  "Include thank-you card.",
  "Customer asked about care instructions.",
  "VIP customer — Daniel's friend from the North Shore.",
  null, null, null, null, null, null, // Most orders have no notes
];

// --- Helpers ---

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.random() * daysAgo);
  d.setHours(randomInt(6, 22), randomInt(0, 59), randomInt(0, 59));
  return d;
}

function generateTrackingNumber(): string {
  const chars = "0123456789";
  let num = "9";
  for (let i = 0; i < 21; i++) num += chars[Math.floor(Math.random() * chars.length)];
  return num;
}

async function seed() {
  console.log("Seeding realistic order data...\n");

  // Check for existing orders
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    console.log(`  Found ${count} existing orders. Skipping seed.`);
    console.log("  To re-seed, delete existing orders first.\n");
    return;
  }

  const orderStatuses: Array<{
    status: string;
    payment_status: string;
    fulfillment_status: string;
    weight: number;
  }> = [
    { status: "confirmed", payment_status: "paid", fulfillment_status: "unfulfilled", weight: 8 },
    { status: "processing", payment_status: "paid", fulfillment_status: "unfulfilled", weight: 5 },
    { status: "shipped", payment_status: "paid", fulfillment_status: "fulfilled", weight: 12 },
    { status: "delivered", payment_status: "paid", fulfillment_status: "fulfilled", weight: 20 },
    { status: "cancelled", payment_status: "refunded", fulfillment_status: "unfulfilled", weight: 2 },
    { status: "refunded", payment_status: "refunded", fulfillment_status: "unfulfilled", weight: 1 },
  ];

  // Build weighted status array
  const weightedStatuses = orderStatuses.flatMap((s) =>
    Array.from({ length: s.weight }, () => s)
  );

  const totalOrders = 48;
  let orderNum = 1001;

  for (let i = 0; i < totalOrders; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "proton.me"])}`;
    const addr = pick(cities);
    const street = pick(streetAddresses);

    const statusInfo = pick(weightedStatuses);
    const createdAt = randomDate(90);

    // Pick 1-3 products for this order
    const numItems = Math.random() < 0.7 ? 1 : Math.random() < 0.8 ? 2 : 3;
    const orderProducts: typeof products[number][] = [];
    const usedIndices = new Set<number>();
    for (let j = 0; j < numItems; j++) {
      let idx: number;
      do {
        idx = randomInt(0, products.length - 1);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);
      orderProducts.push(products[idx]);
    }

    const subtotal = orderProducts.reduce((sum, p) => sum + p.price, 0);
    const shippingCost = Math.random() < 0.8 ? 0 : 1500; // 80% free, 20% express
    const total = subtotal + shippingCost;

    // Timestamps
    let shippedAt: string | null = null;
    let deliveredAt: string | null = null;
    let trackingNumber: string | null = null;
    let trackingUrl: string | null = null;

    if (statusInfo.status === "shipped" || statusInfo.status === "delivered") {
      const shipDate = new Date(createdAt);
      shipDate.setDate(shipDate.getDate() + randomInt(1, 4));
      shippedAt = shipDate.toISOString();
      trackingNumber = generateTrackingNumber();
      const carrier = pick(carriers);
      trackingUrl = carrier === "USPS"
        ? `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
        : carrier === "UPS"
          ? `https://www.ups.com/track?tracknum=${trackingNumber}`
          : carrier === "FedEx"
            ? `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
            : `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;

      if (statusInfo.status === "delivered") {
        const deliverDate = new Date(shipDate);
        deliverDate.setDate(deliverDate.getDate() + randomInt(3, 8));
        deliveredAt = deliverDate.toISOString();
      }
    }

    const isGuest = Math.random() < 0.35; // 35% guest checkout
    const notes = pick(adminNotes);

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: `RB-${orderNum}`,
        user_id: null, // All mock orders are "guest" — no real user IDs
        email,
        stripe_checkout_session_id: `cs_test_mock_${Date.now()}_${i}`,
        stripe_payment_intent_id: `pi_test_mock_${Date.now()}_${i}`,
        status: statusInfo.status,
        payment_status: statusInfo.payment_status,
        fulfillment_status: statusInfo.fulfillment_status,
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: 0,
        total,
        currency: "usd",
        shipping_name: `${firstName} ${lastName}`,
        shipping_address_line1: street,
        shipping_city: addr.city,
        shipping_state: addr.state,
        shipping_postal_code: addr.zip,
        shipping_country: "US",
        shipping_method: shippingCost === 0 ? "Free Standard Shipping" : "Express Shipping",
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        shipped_at: shippedAt,
        delivered_at: deliveredAt,
        notes,
        created_at: createdAt.toISOString(),
      })
      .select("id")
      .single();

    if (orderError) {
      console.error(`  ✗ Order RB-${orderNum}: ${orderError.message}`);
      orderNum++;
      continue;
    }

    // Insert order items
    const orderItems = orderProducts.map((prod) => {
      const hasSize = prod.sizes.length > 0;
      const size = hasSize ? pick(prod.sizes) : null;
      const hasEngraving = prod.engravingAvailable && Math.random() < 0.3;
      const engraving = hasEngraving ? pick(engravings) : null;

      return {
        order_id: order!.id,
        stripe_product_id: `prod_mock_${prod.name.toLowerCase().replace(/\s+/g, "_")}`,
        stripe_price_id: `price_mock_${prod.name.toLowerCase().replace(/\s+/g, "_")}`,
        product_name: prod.name,
        product_image_url: prod.image,
        variant_name: size ? `Size ${size}` : null,
        engraving_text: engraving,
        unit_price: prod.price,
        quantity: 1,
        total_price: prod.price,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error(`  ✗ Items for RB-${orderNum}: ${itemsError.message}`);
    }

    const statusEmoji =
      statusInfo.status === "delivered" ? "✓" :
      statusInfo.status === "shipped" ? "→" :
      statusInfo.status === "cancelled" || statusInfo.status === "refunded" ? "✗" :
      "●";

    console.log(
      `  ${statusEmoji} RB-${orderNum} | ${statusInfo.status.padEnd(10)} | $${(total / 100).toFixed(2).padStart(7)} | ${firstName} ${lastName} | ${orderProducts.map(p => p.name).join(", ")}`
    );

    orderNum++;
  }

  // Summary
  console.log(`\n  Seeded ${totalOrders} orders (RB-1001 to RB-${orderNum - 1})`);
  console.log("  View in admin portal at /dashboard\n");
}

seed().catch(console.error);
