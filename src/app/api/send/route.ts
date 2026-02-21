import { NextRequest } from "next/server";
import { sendEmail, EmailType, EmailProps } from "@/lib/emails";
import { z } from "zod";

// Request body validation schema
const emailRequestSchema = z.object({
  type: z.enum(["welcome", "confirm-signup"]),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  props: z.record(z.string(), z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = emailRequestSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { type, to, props } = validation.data;

    // Send email using centralized function
    const result = await sendEmail(
      type as EmailType,
      to,
      props as EmailProps[typeof type]
    );

    return Response.json(result);
  } catch (error) {
    console.error("API send email error:", error);
    return Response.json(
      { error: "Failed to send email", details: error },
      { status: 500 }
    );
  }
}

// GET endpoint for testing in development environment
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 404 });
  }

  // Test email examples
  const examples = {
    welcome: {
      type: "welcome",
      to: "user@example.com",
      props: {
        userFirstname: "John",
        dashboardUrl: "https://rebirth.world/dashboard",
        siteUrl: "https://rebirth.world",
      },
    },
    "confirm-signup": {
      type: "confirm-signup",
      to: "user@example.com",
      props: {
        confirmationUrl:
          "https://rebirth.world/auth/callback?token_hash=example123&type=email",
        siteUrl: "https://rebirth.world",
      },
    },
  };

  return Response.json({
    message: "Email API - Use POST method to send emails",
    examples,
  });
}
