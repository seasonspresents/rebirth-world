import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyAccountCreated } from "@/lib/ghl";
import { sendEmail } from "@/lib/emails";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/dashboard";

  // Only allow relative paths for security
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  // Prevent double slashes
  next = next.replace(/\/+/g, "/");

  const supabase = await createClient();

  // OAuth flow (when code parameter exists)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Notify GHL of new OAuth account (fire-and-forget, non-blocking)
      if (type === "signup") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          notifyAccountCreated({
            email: user.email || "",
            first_name: user.user_metadata?.full_name?.split(" ")[0],
            auth_method: "google",
          });

          // Send welcome email (fire-and-forget)
          sendEmail("welcome", user.email || "", {
            userFirstname: user.user_metadata?.full_name?.split(" ")[0] || "there",
          }).catch((err) => {
            console.error("Failed to send welcome email:", err);
          });
        }
      }

      // Redirect to reset-password page if recovery type
      if (type === "recovery") {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/reset-password`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}/reset-password`
          );
        } else {
          return NextResponse.redirect(`${origin}/reset-password`);
        }
      }

      // Redirect to dashboard after OAuth signup
      if (type === "signup") {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/dashboard`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/dashboard`);
        } else {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }

      // By default, redirect to next parameter or dashboard
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Email/Magic Link flow (when token_hash parameter exists)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect to reset-password page if recovery type
      if (type === "recovery") {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/reset-password`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}/reset-password`
          );
        } else {
          return NextResponse.redirect(`${origin}/reset-password`);
        }
      }

      // Redirect to dashboard after email verification for signup
      if (type === "signup" || type === "email") {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/dashboard`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/dashboard`);
        } else {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }

      // For other types, use next parameter
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Redirect to sign-in page with error parameter on failure
  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
