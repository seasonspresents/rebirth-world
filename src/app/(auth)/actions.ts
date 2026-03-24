"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notifyAccountCreated } from "@/lib/ghl";
import { sendEmail } from "@/lib/emails";

type OAuthProvider = "google" | "github" | "apple";

// Sign In with Email/Password
export async function signIn(formData: FormData, redirectTo?: string | null) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/dashboard");
}

// Sign In/Up with OAuth (Google, GitHub, Apple)
export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectTo?: string | null
) {
  const supabase = await createClient();

  const callbackUrl = redirectTo
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

// Sign In with Magic Link
export async function signInWithMagicLink(
  email: string,
  redirectTo?: string | null
) {
  const supabase = await createClient();

  const callbackUrl = redirectTo
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Sign Up with Email/Password
export async function signUp(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Fire-and-forget: notify GHL of new account for marketing automation
  notifyAccountCreated({
    email,
    first_name: fullName?.split(" ")[0],
    auth_method: "email",
  });

  // Send welcome email (fire-and-forget)
  sendEmail("welcome", email, {
    userFirstname: fullName?.split(" ")[0] || "there",
  }).catch((err) => {
    console.error("Failed to send welcome email:", err);
  });

  revalidatePath("/", "layout");
  return { success: true };
}

// Send Password Reset Email
export async function sendResetEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Reset Password
export async function resetPassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/sign-in");
}
