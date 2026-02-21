"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { sendResetEmail } from "../actions";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get email from sessionStorage
    const savedEmail = sessionStorage.getItem("signin-email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
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

    try {
      const result = await sendResetEmail(email);

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to sign-in page on success
        router.push("/sign-in?reset=true");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout title="Forgot password?">
      <div className={cn("flex flex-col gap-6", "w-full")}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
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
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                <Button asChild variant="ghost" className="h-auto px-1">
                  <Link href="/sign-in">
                    <ChevronLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthPageLayout>
  );
}
