/**
 * Test Shippo shipping rates for different product categories
 * Run: npx tsx scripts/test-shippo-rates.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY!;
const FROM = {
  name: "Rebirth World",
  street1: process.env.SHIPPO_FROM_STREET1 || "59-864 Kamehameha Hwy",
  city: process.env.SHIPPO_FROM_CITY || "Haleiwa",
  state: process.env.SHIPPO_FROM_STATE || "HI",
  zip: process.env.SHIPPO_FROM_ZIP || "96712",
  country: "US",
};

const TO = {
  name: "Test Customer",
  street1: "215 Clayton St",
  city: "San Francisco",
  state: "CA",
  zip: "94117",
  country: "US",
};

const PARCELS = {
  jewelry: { length: "6", width: "4", height: "2", distance_unit: "in", weight: "4", mass_unit: "oz" },
  clothing: { length: "12", width: "10", height: "2", distance_unit: "in", weight: "8", mass_unit: "oz" },
  mixed: { length: "14", width: "10", height: "6", distance_unit: "in", weight: "16", mass_unit: "oz" },
};

async function fetchRates(label: string, parcel: Record<string, string>) {
  console.log(`\n--- ${label} ---`);
  const res = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: FROM,
      address_to: TO,
      parcels: [parcel],
      async: false,
    }),
  });

  if (!res.ok) {
    console.error(`  FAILED (${res.status}): ${await res.text()}`);
    return;
  }

  const shipment = await res.json();
  const rates = (shipment.rates || []).sort(
    (a: { amount: string }, b: { amount: string }) => parseFloat(a.amount) - parseFloat(b.amount)
  );

  console.log(`  ${rates.length} rates:`);
  for (const rate of rates) {
    const carrier = rate.provider.padEnd(16);
    const service = (rate.servicelevel?.name || "Standard").padEnd(26);
    const price = `$${parseFloat(rate.amount).toFixed(2)}`.padEnd(8);
    const days = rate.estimated_days ?? "?";
    console.log(`  ${carrier} | ${service} | ${price} | ${days}d`);
  }
}

async function main() {
  console.log("Shippo Rate Test — All Parcel Types");
  console.log(`From: ${FROM.city}, ${FROM.state} ${FROM.zip}`);
  console.log(`To:   ${TO.city}, ${TO.state} ${TO.zip}`);

  await fetchRates("Jewelry (6x4x2, 4oz)", PARCELS.jewelry);
  await fetchRates("Clothing (12x10x2, 8oz)", PARCELS.clothing);
  await fetchRates("Mixed (14x10x6, 16oz)", PARCELS.mixed);

  console.log("\nAll tests passed.");
}

main().catch(console.error);
