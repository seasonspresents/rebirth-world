import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { upsertContact } from "@/lib/ghl";
import { sendEmail } from "@/lib/emails";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Upsert contact into GHL with contact_form tag + message in custom fields
    upsertContact({
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      tags: ["contact_form", "lead"],
      source: "rebirth.world",
      customFields: [
        { key: "contact_message", field_value: validatedData.message },
      ],
    });

    // Send notification email to team
    sendEmail("contact-notification", "aloha@rebirth.world", {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      message: validatedData.message,
    }).catch((err) => {
      console.error("Failed to send contact notification email:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
