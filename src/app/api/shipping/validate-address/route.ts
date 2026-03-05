import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateAddress } from "@/lib/shippo";

const addressSchema = z.object({
  name: z.string().min(1),
  street1: z.string().min(1),
  street2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(2).max(2).default("US"),
});

/**
 * Public endpoint: Validate a shipping address via Shippo
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid address", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await validateAddress(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Address validation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Validation failed" },
      { status: 500 }
    );
  }
}
