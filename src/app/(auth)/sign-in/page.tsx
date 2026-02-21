"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleCheck, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { signInWithOAuth } from "../actions";
import { cn } from "@/lib/utils";

interface AlertState {
  show: boolean;
  title: string;
  message: string;
  variant: "default" | "destructive";
}

function SignInContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => {
    // Get email from sessionStorage (when navigating back)
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("signin-email") || "";
    }
    return "";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Derived state: Calculate alert information from URL parameters
  const alert: AlertState = (() => {
    if (isAlertDismissed) {
      return { show: false, title: "", message: "", variant: "default" };
    }

    const resetParam = searchParams.get("reset");
    const signupParam = searchParams.get("signup");
    const errorParam = searchParams.get("error");

    if (resetParam === "true") {
      return {
        show: true,
        title: "Password reset email sent!",
        message:
          "Please check your email and follow the instructions to reset your password.",
        variant: "default",
      };
    } else if (signupParam === "success") {
      return {
        show: true,
        title: "Account created successfully!",
        message:
          "Please check your email and activate your account before signing in.",
        variant: "default",
      };
    } else if (errorParam === "auth_failed") {
      return {
        show: true,
        title: "Authentication failed!",
        message: "Please try again.",
        variant: "destructive",
      };
    }

    return { show: false, title: "", message: "", variant: "default" };
  })();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // Save email to sessionStorage
    sessionStorage.setItem("signin-email", email);

    // Navigate to confirm page
    router.push("/sign-in/confirm");
  };

  const handleOAuthSignIn = async (provider: "google" | "github" | "apple") => {
    try {
      // Get redirect path from sessionStorage if it exists
      const redirectTo =
        typeof window !== "undefined"
          ? sessionStorage.getItem("signin-redirect-to")
          : null;

      const result = await signInWithOAuth(provider, redirectTo);
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

  const handleCloseAlert = () => {
    setIsAlertDismissed(true);
  };

  return (
    <div className={cn("flex flex-col gap-2", "w-full")}>
      {alert.show && (
        <Alert variant={alert.variant} className="relative">
          {alert.variant === "default" ? (
            <CircleCheck className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={handleCloseAlert}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <OAuthButtons onOAuthSignIn={handleOAuthSignIn} />

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  OR
                </span>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    ref={emailInputRef}
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
                  <div className="text-left text-sm text-red-500">{error}</div>
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
                Don&apos;t have an account?{" "}
                <Button
                  asChild
                  variant="link"
                  className="h-auto px-1 font-semibold"
                >
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthPageLayout title="Sign in">
      <SignInContent />
    </AuthPageLayout>
  );
}
