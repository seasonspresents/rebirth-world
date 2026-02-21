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
import { signUp, signInWithMagicLink } from "../../actions";
import { cn } from "@/lib/utils";

export default function SignUpConfirmPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get fullName and email from sessionStorage
    const savedFullName = sessionStorage.getItem("signup-fullname");
    const savedEmail = sessionStorage.getItem("signup-email");
    if (!savedFullName || !savedEmail) {
      // Redirect to sign-up page if data is missing
      router.push("/sign-up");
      return;
    }
    setFullName(savedFullName);
    setEmail(savedEmail);
  }, [router]);

  // Focus on password input after email is set
  useEffect(() => {
    if (email) {
      passwordInputRef.current?.focus();
    }
  }, [email]);

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);

      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to sign-in page with success parameter
        router.push("/sign-in?signup=success");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        return;
      }
      console.error("Sign up error:", error);
      setError("An error occurred during sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSend = async () => {
    setIsSendingMagicLink(true);
    setError(null);

    try {
      const result = await signInWithMagicLink(email);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Magic link sent!", {
          description: "Check your email to complete your registration.",
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
    // Keep fullName and email in sessionStorage
    sessionStorage.setItem("signup-fullname", fullName);
    sessionStorage.setItem("signup-email", email);
    router.push("/sign-up");
  };

  if (!email) {
    return null; // Loading
  }

  return (
    <AuthPageLayout title="Sign up">
      <div className={cn("flex flex-col gap-6", "w-full")}>
        <Card>
          <CardContent>
            <form onSubmit={handlePasswordSignUp}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="fullName">Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    disabled
                    className="bg-muted h-10"
                  />
                </div>

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
                      Continue with magic link
                    </>
                  )}
                </Button>

                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                      Creating account...
                    </>
                  ) : (
                    "Create account"
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
