import { redirect } from "next/navigation";
import { Metadata } from "next";
import { stripe } from "@/lib/payments/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export default async function OrderSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/shop");
  }

  // Retrieve the checkout session from Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product", "shipping_cost"],
    });
  } catch {
    redirect("/shop");
  }

  if (session.status !== "complete") {
    redirect("/shop");
  }

  // Try to find order number from DB
  const supabase = createServiceClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_number")
    .eq("stripe_checkout_session_id", session_id)
    .single();

  const orderNumber = order?.order_number ?? null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = session as any;
  const lineItems = session.line_items?.data ?? [];
  const subtotal = session.amount_subtotal ?? 0;
  const total = session.amount_total ?? 0;
  const shippingCostObj = s.shipping_cost as Record<string, number> | undefined;
  const shippingCost = shippingCostObj?.amount_total ?? 0;
  const tax = session.total_details?.amount_tax ?? 0;
  const shippingDetails = s.shipping_details as {
    name?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  } | undefined;

  return (
    <div className="overflow-x-hidden">
      <Header />
      <CartDrawer />
      <main>
        <ClearCartOnMount />
        <section className="px-6 py-16">
          <div className="mx-auto max-w-[680px] text-center">
            {/* Success icon */}
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
              Order Confirmed!
            </h1>

            {orderNumber ? (
              <p className="mt-3 text-lg text-muted-foreground">
                Order <span className="font-semibold text-foreground">{orderNumber}</span>
              </p>
            ) : (
              <p className="mt-3 text-lg text-muted-foreground">
                Your order is being processed. You&apos;ll receive a confirmation
                email shortly.
              </p>
            )}

            <p className="mt-2 text-sm text-muted-foreground">
              A confirmation has been sent to{" "}
              <span className="font-medium text-foreground">
                {session.customer_details?.email}
              </span>
            </p>

            {/* Order summary card */}
            <div className="mt-10 rounded-xl border border-border bg-card text-card-foreground p-6 text-left">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              {/* Items */}
              <ul className="mt-4 divide-y divide-border">
                {lineItems.map((item, i) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCents(item.amount_total)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCents(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCents(shippingCost)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCents(tax)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCents(total)}</span>
                </div>
              </div>

              {/* Shipping address */}
              {shippingDetails?.address && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Shipping to
                  </p>
                  <p className="mt-1 text-sm">
                    {shippingDetails.name && (
                      <>
                        {shippingDetails.name}
                        <br />
                      </>
                    )}
                    {shippingDetails.address.line1}
                    {shippingDetails.address.line2 && (
                      <>
                        <br />
                        {shippingDetails.address.line2}
                      </>
                    )}
                    <br />
                    {[
                      shippingDetails.address.city,
                      shippingDetails.address.state,
                      shippingDetails.address.postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                    {shippingDetails.address.country}
                  </p>
                </div>
              )}
            </div>

            {/* Daniel's personal note */}
            <div className="mt-8 rounded-xl border border-border bg-card text-card-foreground p-6 text-left">
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;Every ring is made by hand in my North Shore workshop.
                Your order means the world to me — I can&apos;t wait for you to
                see the finished piece. Mahalo for being part of the Rebirth
                community.&rdquo;
              </p>
              <p className="mt-3 text-sm font-medium">
                — Daniel Malzl, Founder
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://instagram.com/rebirthrings"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow @rebirthrings
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
