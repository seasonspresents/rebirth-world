"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { signIn, signInWithMagicLink } from "../../actions";
import { cn } from "@/lib/utils";

export default function SignInConfirmPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get email from sessionStorage
    const savedEmail = sessionStorage.getItem("signin-email");
    if (!savedEmail) {
      // Redirect to sign-in page if email is missing
      router.push("/sign-in");
      return;
    }
    setEmail(savedEmail);
  }, [router]);

  // Focus on password input after email is set
  useEffect(() => {
    if (email) {
      passwordInputRef.current?.focus();
    }
  }, [email]);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      // Get redirect path from sessionStorage if it exists
      const redirectTo =
        typeof window !== "undefined"
          ? sessionStorage.getItem("signin-redirect-to")
          : null;

      const result = await signIn(formData, redirectTo);
      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        return;
      }
      console.error("Sign in error:", error);
      setError("An error occurred during sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSend = async () => {
    setIsSendingMagicLink(true);
    setError(null);

    try {
      // Get redirect path from sessionStorage if it exists
      const redirectTo =
        typeof window !== "undefined"
          ? sessionStorage.getItem("signin-redirect-to")
          : null;

      const result = await signInWithMagicLink(email, redirectTo);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Magic link sent!", {
          description: "Check your email to sign in.",
        });
      }
    } catch (error) {
      console.error("Magic link error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const handleGoBack = () => {
    // Keep email in sessionStorage for use on sign-in page
    sessionStorage.setItem("signin-email", email);
    router.push("/sign-in");
  };

  if (!email) {
    return null; // Loading email
  }

  return (
    <AuthPageLayout title="Sign in">
      <div className={cn("flex flex-col gap-6", "w-full")}>
        <Card>
          <CardContent>
            <form onSubmit={handlePasswordSignIn}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted h-10"
                  />
                </div>

                <Button
                  type="button"
                  size="lg"
                  onClick={handleMagicLinkSend}
                  className="w-full"
                  disabled={isSendingMagicLink}
                >
                  {isSendingMagicLink ? (
                    <>
                      <Spinner />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send magic link
                    </>
                  )}
                </Button>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm underline-offset-4 hover:underline"
                      onClick={() => {
                        sessionStorage.setItem("signin-email", email);
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <Eye className="text-muted-foreground h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-left text-sm text-red-500">{error}</div>
                )}

                <Button
                  variant="default"
                  size="lg"
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !password}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleGoBack}
                  className="h-auto px-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Go back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthPageLayout>
  );
}
