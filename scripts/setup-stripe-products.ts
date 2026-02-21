/**
 * Setup Stripe Products & Prices for Satori AI
 *
 * Creates two subscription products (Essentials, Pro) with monthly prices,
 * then updates src/lib/payments/plans.ts with the returned price IDs.
 *
 * Usage: pnpm tsx scripts/setup-stripe-products.ts
 */

import Stripe from "stripe";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load env vars from .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("Missing STRIPE_SECRET_KEY in .env.local");
  process.exit(1);
}

const stripe = new Stripe(secretKey);

const PLANS = [
  {
    id: "essentials",
    name: "Satori Essentials",
    description: "AI receptionist for solo tattoo artists — DMs, SMS, deposits, 24/7.",
    monthlyPriceCents: 30000, // $300
  },
  {
    id: "pro",
    name: "Satori Pro",
    description:
      "Full AI receptionist with voice calls, campaigns, reminders, and priority support.",
    monthlyPriceCents: 50000, // $500
  },
];

async function main() {
  console.log(
    `Using Stripe ${secretKey!.startsWith("sk_live_") ? "LIVE" : "TEST"} mode\n`
  );

  const priceIds: Record<string, string> = {};

  for (const plan of PLANS) {
    // Check if product already exists by metadata
    const existing = await stripe.products.search({
      query: `metadata["satori_plan_id"]:"${plan.id}"`,
    });

    let product: Stripe.Product;

    if (existing.data.length > 0) {
      product = existing.data[0];
      console.log(`Found existing product: ${product.name} (${product.id})`);
    } else {
      product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: { satori_plan_id: plan.id },
      });
      console.log(`Created product: ${product.name} (${product.id})`);
    }

    // Check if a monthly price already exists for this product
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
      type: "recurring",
    });

    const existingMonthly = existingPrices.data.find(
      (p) =>
        p.recurring?.interval === "month" &&
        p.unit_amount === plan.monthlyPriceCents
    );

    let price: Stripe.Price;

    if (existingMonthly) {
      price = existingMonthly;
      console.log(`  Found existing price: $${plan.monthlyPriceCents / 100}/mo (${price.id})`);
    } else {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthlyPriceCents,
        currency: "usd",
        recurring: { interval: "month" },
        metadata: { satori_plan_id: plan.id },
      });
      console.log(`  Created price: $${plan.monthlyPriceCents / 100}/mo (${price.id})`);
    }

    priceIds[plan.id] = price.id;
  }

  // Update plans.ts with the price IDs
  const plansPath = path.resolve(__dirname, "../src/lib/payments/plans.ts");
  let plansFile = fs.readFileSync(plansPath, "utf-8");

  for (const plan of PLANS) {
    const priceId = priceIds[plan.id];
    // Replace the null monthly price ID for this plan
    // Match the stripePriceIds block that follows the plan's id
    const regex = new RegExp(
      `(id: "${plan.id}"[\\s\\S]*?stripePriceIds:\\s*\\{\\s*monthly:\\s*)null`,
      "m"
    );
    plansFile = plansFile.replace(regex, `$1"${priceId}"`);
  }

  fs.writeFileSync(plansPath, plansFile, "utf-8");
  console.log("\nUpdated src/lib/payments/plans.ts with price IDs:");
  console.log(`  Essentials: ${priceIds.essentials}`);
  console.log(`  Pro:        ${priceIds.pro}`);
  console.log("\nDone! Products are ready in Stripe.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
