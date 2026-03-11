/**
 * Quick Shippo API token verification
 * Run: npx tsx scripts/verify-shippo.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;

if (!SHIPPO_API_KEY) {
  console.error("❌ SHIPPO_API_KEY not found in .env.local");
  process.exit(1);
}

console.log(`🔑 Token: ${SHIPPO_API_KEY.slice(0, 16)}...${SHIPPO_API_KEY.slice(-4)}`);
console.log(`📋 Mode: ${SHIPPO_API_KEY.startsWith("shippo_test") ? "TEST" : "LIVE"}\n`);

async function verify() {
  // 1. Test address validation
  console.log("1️⃣  Testing address validation...");
  const addressRes = await fetch("https://api.goshippo.com/addresses/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Test Customer",
      street1: "215 Clayton St",
      city: "San Francisco",
      state: "CA",
      zip: "94117",
      country: "US",
      validate: true,
    }),
  });

  if (!addressRes.ok) {
    const err = await addressRes.text();
    console.error(`❌ Address validation failed (${addressRes.status}): ${err}`);
    process.exit(1);
  }

  const address = await addressRes.json();
  console.log(`   ✅ Address created: ${address.object_id}`);
  console.log(`   ✅ Valid: ${address.validation_results?.is_valid ?? "N/A"}\n`);

  // 2. Test shipping rates
  console.log("2️⃣  Testing rate fetch (Haleiwa HI → San Francisco CA)...");
  const shipmentRes = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: {
        name: "Rebirth World",
        street1: process.env.SHIPPO_FROM_STREET1 || "59-864 Kamehameha Hwy",
        city: process.env.SHIPPO_FROM_CITY || "Haleiwa",
        state: process.env.SHIPPO_FROM_STATE || "HI",
        zip: process.env.SHIPPO_FROM_ZIP || "96712",
        country: "US",
      },
      address_to: {
        name: "Test Customer",
        street1: "215 Clayton St",
        city: "San Francisco",
        state: "CA",
        zip: "94117",
        country: "US",
      },
      parcels: [
        {
          length: "6",
          width: "4",
          height: "2",
          distance_unit: "in",
          weight: "4",
          mass_unit: "oz",
        },
      ],
      async: false,
    }),
  });

  if (!shipmentRes.ok) {
    const err = await shipmentRes.text();
    console.error(`❌ Shipment creation failed (${shipmentRes.status}): ${err}`);
    process.exit(1);
  }

  const shipment = await shipmentRes.json();
  const rates = shipment.rates || [];
  console.log(`   ✅ Shipment created: ${shipment.object_id}`);
  console.log(`   ✅ ${rates.length} rates returned:\n`);

  // Format rates table
  console.log("   Carrier          | Service                    | Price   | Days");
  console.log("   -----------------|----------------------------|---------|-----");
  for (const rate of rates.sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount))) {
    const carrier = rate.provider.padEnd(16);
    const service = (rate.servicelevel?.name || rate.servicelevel?.token || "Standard").padEnd(26);
    const price = `$${parseFloat(rate.amount).toFixed(2)}`.padEnd(7);
    const days = rate.estimated_days ?? "?";
    console.log(`   ${carrier} | ${service} | ${price} | ${days}`);
  }

  console.log("\n✅ Shippo test token is working. All API calls succeeded.");
}

verify().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
