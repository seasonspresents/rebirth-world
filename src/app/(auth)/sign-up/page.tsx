"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { signInWithOAuth } from "../actions";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const [fullName, setFullName] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("signup-fullname") || "";
    }
    return "";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("signup-email") || "";
    }
    return "";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fullNameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Save fullName and email to sessionStorage
    sessionStorage.setItem("signup-fullname", fullName);
    sessionStorage.setItem("signup-email", email);

    // Navigate to confirm page
    router.push("/sign-up/confirm");
  };

  const handleOAuthSignUp = async (provider: "google" | "github" | "apple") => {
    try {
      const result = await signInWithOAuth(provider);
      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        return;
      }
      console.error("OAuth error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <AuthPageLayout title="Sign up">
      <div className={cn("flex flex-col gap-6", "w-full")}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <OAuthButtons onOAuthSignIn={handleOAuthSignUp} />

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    OR
                  </span>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="fullName">Name</Label>
                    <Input
                      ref={fullNameInputRef}
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      className="h-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      className="h-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-left text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="default"
                    size="lg"
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Loading...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Button
                    asChild
                    variant="link"
                    className="h-auto px-1 font-semibold"
                  >
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-muted-foreground *:hover:text-primary text-center text-xs text-balance">
          By continuing, you agree to our
          <br />
          <Link
            href="/terms-of-service"
            className="underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </AuthPageLayout>
  );
}
