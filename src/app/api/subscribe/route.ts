import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewsletterSignup } from "@/lib/ghl";

const schema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  source: z.string().default("website"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("email_subscribers")
    .upsert(
      {
        email: parsed.data.email,
        first_name: parsed.data.first_name || null,
        source: parsed.data.source,
        subscribed: true,
      },
      { onConflict: "email" }
    );

  if (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }

  // Fire GHL webhook (non-blocking)
  notifyNewsletterSignup({
    email: parsed.data.email,
    first_name: parsed.data.first_name,
    source: parsed.data.source,
  });

  return NextResponse.json({ success: true });
}
