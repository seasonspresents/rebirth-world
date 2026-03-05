import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCheckoutShippingRates } from "@/lib/shippo";

const cartItemSchema = z.object({
  product_name: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number().int().min(0), // cents
  collection: z.string().optional(), // "skateboard-rings" | "wedding-bands" | "apparel"
  weight_oz: z.number().optional(),
});

const ratesRequestSchema = z.object({
  address: z.object({
    name: z.string().min(1),
    street1: z.string().min(1),
    street2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(2).max(2).default("US"),
  }),
  items: z.array(cartItemSchema).min(1),
  subtotal_cents: z.number().int().min(0),
});

/**
 * Public endpoint: Get live shipping rates for checkout
 * Returns carrier rates + free shipping option if eligible
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ratesRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const { address, items, subtotal_cents } = parsed.data;
    const result = await getCheckoutShippingRates(address, items, subtotal_cents);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to get checkout shipping rates:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get rates" },
      { status: 500 }
    );
  }
}
