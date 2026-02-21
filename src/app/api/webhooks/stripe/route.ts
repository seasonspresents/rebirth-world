/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/payments/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "customer.subscription.created": {
        const createdSubscription = event.data.object as Stripe.Subscription;
        console.log(
          `Processing subscription created: ${createdSubscription.id}`
        );
        await handleSubscriptionCreated(createdSubscription);
        break;
      }

      case "customer.subscription.updated": {
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log(
          `Processing subscription updated: ${updatedSubscription.id}`
        );
        await handleSubscriptionUpdate(updatedSubscription);
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log(
          `Processing subscription deleted: ${deletedSubscription.id}`
        );
        await handleSubscriptionCancellation(deletedSubscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Processing payment succeeded: ${invoice.id}`);
        await handlePaymentSuccess(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log(`Processing payment failed: ${failedInvoice.id}`);
        await handlePaymentFailure(failedInvoice);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Helper function to find user from metadata
function getUserIdFromMetadata(metadata: any): string | null {
  return metadata?.user_id || null;
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log(`Handling subscription created: ${subscription.id}`);

    const supabase = createServiceClient();

    // Get user ID from metadata (should always be present from checkout session)
    const userId = getUserIdFromMetadata(subscription.metadata);

    if (!userId) {
      console.error(
        "No user ID in subscription metadata. This should not happen if checkout session was created correctly.",
        "Subscription ID:",
        subscription.id
      );
      return;
    }

    console.log(`Found user ID from metadata: ${userId}`);

    // Get customer ID for storing
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id || "";

    // Get price information to determine plan details using expanded subscription
    const subscription_expanded = await stripe.subscriptions.retrieve(
      subscription.id,
      {
        expand: ["items.data.price.product"],
      }
    );

    // Extract plan information
    const planInfo = getPlanInfoFromSubscription(subscription_expanded);

    console.log(
      `Plan: ${planInfo.planName}, Billing: ${planInfo.billingCycle}, Price ID: ${planInfo.priceId}, Product ID: ${planInfo.productId}`
    );

    // Get current period dates from subscription items
    const currentPeriodStart =
      subscription_expanded.items.data[0]?.current_period_start ||
      subscription.start_date;
    const currentPeriodEnd =
      subscription_expanded.items.data[0]?.current_period_end ||
      subscription.trial_end;

    // Insert or update subscription in Supabase
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: planInfo.priceId,
          plan_name: planInfo.planName,
          status: subscription.status,
          billing_cycle: planInfo.billingCycle,
          trial_start: subscription.trial_start
            ? new Date(subscription.trial_start * 1000).toISOString()
            : null,
          trial_end: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          current_period_start: currentPeriodStart
            ? new Date(currentPeriodStart * 1000).toISOString()
            : null,
          current_period_end: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : null,
          created_at: new Date(subscription.created * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "stripe_subscription_id",
        }
      )
      .select()
      .single();

    if (subscriptionError) {
      console.error("Error inserting subscription:", subscriptionError);
      return;
    }

    console.log(
      `Successfully created subscription record with ID: ${subscriptionData?.id}`
    );
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    console.log(
      `Handling subscription update: ${subscription.id}, status: ${subscription.status}`
    );

    const supabase = createServiceClient();

    // Get existing subscription data to check if this is a new cancellation
    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("cancel_at, canceled_at")
      .eq("stripe_subscription_id", subscription.id)
      .single();

    // Get current period dates from subscription items or use fallback values
    const currentPeriodStart =
      subscription.items?.data?.[0]?.current_period_start ||
      subscription.start_date;
    const currentPeriodEnd =
      subscription.items?.data?.[0]?.current_period_end ||
      subscription.trial_end;

    // Prepare update data with subscription information
    const updateData: any = {
      status: subscription.status,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: currentPeriodStart
        ? new Date(currentPeriodStart * 1000).toISOString()
        : null,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    // Handle plan/price/billing changes
    if (subscription.items?.data?.[0]?.price) {
      const planInfo = getPlanInfoFromSubscription(subscription);

      updateData.stripe_price_id = planInfo.priceId;
      updateData.billing_cycle = planInfo.billingCycle;
      updateData.plan_name = planInfo.planName;

      console.log(
        `Updated plan info - Name: ${planInfo.planName}, Billing: ${planInfo.billingCycle}, Price ID: ${planInfo.priceId}`
      );
    }

    // Handle cancellation information
    if (subscription.cancel_at_period_end !== undefined) {
      updateData.cancel_at_period_end = subscription.cancel_at_period_end;
    }

    // Handle cancel_at (including null values for renewal cases)
    const newCancelAt = subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null;

    if (subscription.cancel_at !== undefined) {
      updateData.cancel_at = newCancelAt;
    }

    // Handle canceled_at (including null values for renewal cases)
    if (subscription.canceled_at !== undefined && subscription.canceled_at) {
      updateData.canceled_at = new Date(
        subscription.canceled_at * 1000
      ).toISOString();
    } else if (
      newCancelAt &&
      !existingSubscription?.cancel_at &&
      !existingSubscription?.canceled_at
    ) {
      updateData.canceled_at = new Date().toISOString();
      console.log(
        "New cancellation detected - setting canceled_at to current time"
      );
    } else if (!newCancelAt && existingSubscription?.canceled_at) {
      updateData.canceled_at = null;
      console.log("Cancellation removed - clearing canceled_at");
    }

    // Handle cancellation details (including null values for renewal cases)
    if (subscription.cancellation_details) {
      updateData.cancellation_reason =
        subscription.cancellation_details.reason || null;
      updateData.cancellation_feedback =
        subscription.cancellation_details.feedback || null;
    }

    console.log("Updating subscription with data:", updateData);

    const { error } = await supabase
      .from("user_subscriptions")
      .update(updateData)
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      console.error("Error updating subscription:", error);
    } else {
      console.log(`Successfully updated subscription: ${subscription.id}`);
    }
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}

async function handleSubscriptionCancellation(
  subscription: Stripe.Subscription
) {
  try {
    console.log(
      `Handling subscription cancellation: ${subscription.id}, status: ${subscription.status}`
    );

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: subscription.status,
        canceled_at: (subscription as any).canceled_at
          ? new Date((subscription as any).canceled_at * 1000).toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      console.error("Error updating subscription cancellation:", error);
    } else {
      console.log(`Successfully cancelled subscription: ${subscription.id}`);
    }
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  try {
    console.log(`Handling payment success: ${invoice.id}`);

    const supabase = createServiceClient();

    if (!invoice.id) {
      console.error("Invoice missing ID");
      return;
    }

    // Get subscription ID from various possible locations in the invoice
    let subscriptionId: string | null = null;

    if (typeof (invoice as any).subscription === "string") {
      subscriptionId = (invoice as any).subscription;
    } else if ((invoice as any).subscription?.id) {
      subscriptionId = (invoice as any).subscription.id;
    }

    if (
      !subscriptionId &&
      (invoice as any).parent?.subscription_details?.subscription
    ) {
      subscriptionId = (invoice as any).parent.subscription_details
        .subscription;
    }

    if (
      !subscriptionId &&
      (invoice as any).lines?.data?.[0]?.parent?.subscription_item_details
        ?.subscription
    ) {
      subscriptionId = (invoice as any).lines.data[0].parent
        .subscription_item_details.subscription;
    }

    if (!subscriptionId) {
      console.log(
        "No subscription ID found in invoice, skipping payment record"
      );
      return;
    }

    console.log(`Found subscription ID: ${subscriptionId}`);

    const stripeSubscription =
      await stripe.subscriptions.retrieve(subscriptionId);

    const userId = getUserIdFromMetadata(stripeSubscription.metadata);
    if (!userId) {
      console.error(
        "No user ID in subscription metadata for subscription:",
        subscriptionId
      );
      return;
    }

    console.log(`Found user ID from subscription metadata: ${userId}`);

    let planName = "Subscription";
    try {
      const subscriptionData = await supabase
        .from("user_subscriptions")
        .select("plan_name")
        .eq("stripe_subscription_id", subscriptionId)
        .single();

      if (subscriptionData.data?.plan_name) {
        planName = subscriptionData.data.plan_name;
      }
    } catch {
      console.log("Plan name not available yet, using default");
    }

    const { error: paymentError } = await supabase
      .from("payment_history")
      .insert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        amount: (invoice as any).amount_paid || 0,
        currency: invoice.currency || "usd",
        status: "succeeded",
        description: `${planName} subscription payment`,
        invoice_url: (invoice as any).hosted_invoice_url || null,
        created_at: new Date((invoice as any).created * 1000).toISOString(),
      });

    if (paymentError) {
      console.error("Error inserting payment record:", paymentError);
    } else {
      console.log(`Successfully created payment record for user: ${userId}`);
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  try {
    console.log(`Handling payment failure: ${invoice.id}`);

    const supabase = createServiceClient();

    if (!invoice.id) {
      console.error("Invoice missing ID");
      return;
    }

    let subscriptionId: string | null = null;

    if (typeof (invoice as any).subscription === "string") {
      subscriptionId = (invoice as any).subscription;
    } else if ((invoice as any).subscription?.id) {
      subscriptionId = (invoice as any).subscription.id;
    }

    if (
      !subscriptionId &&
      (invoice as any).parent?.subscription_details?.subscription
    ) {
      subscriptionId = (invoice as any).parent.subscription_details
        .subscription;
    }

    if (
      !subscriptionId &&
      (invoice as any).lines?.data?.[0]?.parent?.subscription_item_details
        ?.subscription
    ) {
      subscriptionId = (invoice as any).lines.data[0].parent
        .subscription_item_details.subscription;
    }

    if (!subscriptionId) {
      console.log(
        "No subscription ID found in invoice, skipping failed payment record"
      );
      return;
    }

    console.log(`Found subscription ID: ${subscriptionId}`);

    const stripeSubscription =
      await stripe.subscriptions.retrieve(subscriptionId);

    const userId = getUserIdFromMetadata(stripeSubscription.metadata);
    if (!userId) {
      console.error(
        "No user ID in subscription metadata for subscription:",
        subscriptionId
      );
      return;
    }

    console.log(`Found user ID from subscription metadata: ${userId}`);

    let planName = "Subscription";
    try {
      const subscriptionData = await supabase
        .from("user_subscriptions")
        .select("plan_name")
        .eq("stripe_subscription_id", subscriptionId)
        .single();

      if (subscriptionData.data?.plan_name) {
        planName = subscriptionData.data.plan_name;
      }
    } catch {
      console.log("Plan name not available yet, using default");
    }

    const { error: paymentError } = await supabase
      .from("payment_history")
      .insert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        amount: (invoice as any).amount_due || 0,
        currency: invoice.currency || "usd",
        status: "failed",
        description: `${planName} subscription payment failed`,
        invoice_url: (invoice as any).hosted_invoice_url || null,
        created_at: new Date((invoice as any).created * 1000).toISOString(),
      });

    if (paymentError) {
      console.error("Error inserting failed payment record:", paymentError);
    } else {
      console.log(
        `Successfully created failed payment record for user: ${userId}`
      );
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

// Extract plan information from Stripe Subscription object
function getPlanInfoFromSubscription(subscription: Stripe.Subscription): {
  productId: string | null;
  priceId: string | null;
  planName: string;
  billingCycle: string;
} {
  const defaultResult = {
    productId: null,
    priceId: null,
    planName: "Unknown Plan",
    billingCycle: "month",
  };

  try {
    const priceData = subscription.items?.data?.[0]?.price;
    if (!priceData) {
      console.log("No price data found in subscription");
      return defaultResult;
    }

    const priceId = priceData.id;
    const productId =
      typeof priceData.product === "string"
        ? priceData.product
        : priceData.product?.id || null;
    const billingCycle = priceData.recurring?.interval || "month";

    // Get plan name from the Stripe product if expanded, otherwise use metadata
    let planName = "Unknown Plan";
    if (
      typeof priceData.product !== "string" &&
      priceData.product &&
      "name" in priceData.product &&
      priceData.product.name
    ) {
      planName = priceData.product.name;
    }

    return {
      productId,
      priceId,
      planName,
      billingCycle,
    };
  } catch (error) {
    console.error("Error in getPlanInfoFromSubscription:", error);
    return defaultResult;
  }
}
