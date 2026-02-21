import { redirect } from "next/navigation";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import { Confetti } from "@/components/ui/confetti";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface SearchParams {
  session_id: string;
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent", "subscription"],
  });

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    // If this is a subscription and webhook hasn't processed it yet,
    // we can optionally ensure the subscription is recorded
    if (session.mode === "subscription" && session.subscription) {
      try {
        const supabase = await createClient();

        // Check if subscription already exists in our database
        const { data: existingSubscription } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("stripe_subscription_id", session.subscription as string)
          .single();

        // If subscription doesn't exist, it means webhook hasn't processed it yet
        // In production, you might want to trigger webhook processing manually here
        // or show a loading state until webhook processes it
        if (!existingSubscription) {
          console.log(
            "Subscription not yet processed by webhook, this is normal for immediate redirects"
          );
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
      }
    }

    return (
      <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* Main content */}
        <Card className="bg-card/80 w-full max-w-lg backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-8 py-8 text-center">
            <CircleCheck className="h-20 w-20 stroke-[1.5] text-green-500 dark:text-green-400" />
            <div className="flex flex-col gap-4">
              <h1 className="text-foreground text-3xl font-bold">
                Subscription successful!
              </h1>
              <p className="text-muted-foreground text-lg">
                Thank you for your subscription! <br />
                You can immediately start using our service.
              </p>
            </div>
            <Button asChild variant="default" size="lg">
              <Link href="/dashboard" className="flex items-center gap-2">
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Confetti
          className="pointer-events-none absolute top-0 left-0 h-full w-full"
          options={{
            particleCount: 200,
            angle: 60,
            spread: 60,
            startVelocity: 55,
            origin: {
              x: 0,
              y: 0.5,
            },
            disableForReducedMotion: true,
          }}
        />
        <Confetti
          className="pointer-events-none absolute top-0 left-0 h-full w-full"
          options={{
            particleCount: 200,
            angle: 120,
            spread: 60,
            startVelocity: 55,
            origin: {
              x: 1,
              y: 0.5,
            },
            disableForReducedMotion: true,
          }}
        />
      </div>
    );
  }
}
