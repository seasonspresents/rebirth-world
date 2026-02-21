"use client";

import { DashboardHeader } from "../../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import {
  CreditCard,
  ArrowRight,
  AlertCircle,
  ReceiptText,
  SquareArrowOutUpRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { UserSubscription, PaymentHistory } from "@/lib/supabase/types";

export default function SettingsBillingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!user) {
        setDataLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        // Get subscription info
        const { data: subscriptionData } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Get payment history
        const { data: paymentsData } = await supabase
          .from("payment_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        setSubscription(subscriptionData);
        setPaymentHistory(paymentsData || []);
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading) {
      fetchBillingData();
    }
  }, [user, authLoading]);

  const getSubscriptionStatus = () => {
    if (!subscription)
      return {
        label: "No Active Plan",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      };

    if (subscription.status === "trialing") {
      return {
        label: "Trial",
        color: "bg-blue-500 text-white dark:bg-blue-600 dark:text-white",
      };
    }

    if (subscription.status === "active") {
      return {
        label: "Active",
        color: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
      };
    }

    if (subscription.status === "canceled") {
      return {
        label: "Canceled",
        color: "bg-red-500 text-white dark:bg-red-600 dark:text-white",
      };
    }

    if (subscription.status === "past_due") {
      return {
        label: "Past Due",
        color: "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white",
      };
    }

    return {
      label: subscription.status,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };
  };

  const getNextBillingDate = () => {
    if (!subscription || !subscription.current_period_end) return null;

    const currentPeriodEnd = new Date(subscription.current_period_end);

    return currentPeriodEnd.toLocaleDateString();
  };

  const getFormattedAmount = (amount: number, currency: string) => {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return {
          variant: "default" as const,
          label: "Paid",
          className:
            "bg-green-500 text-white dark:bg-green-600 dark:text-white",
        };
      case "failed":
        return {
          variant: "destructive" as const,
          label: "Failed",
          className: "bg-red-500 text-white dark:bg-red-600 dark:text-white",
        };
      case "pending":
        return {
          variant: "secondary" as const,
          label: "Pending",
          className:
            "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white",
        };
      case "refunded":
        return {
          variant: "outline" as const,
          label: "Refunded",
          className:
            "bg-purple-500 text-white dark:bg-purple-600 dark:text-white",
        };
      default:
        return {
          variant: "secondary" as const,
          label: status,
          className: "bg-gray-500 text-white dark:bg-gray-600 dark:text-white",
        };
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) return;

    setPortalLoading(true);

    try {
      const response = await fetch("/api/customer_portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      // You can add toast notification here
    } finally {
      setPortalLoading(false);
    }
  };

  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          breadcrumb={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard/settings/general"
                    className="font-semibold"
                  >
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    Billing
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-4xl space-y-6">
            <div>
              <Skeleton className="mb-2 h-8 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Skeleton className="mb-1 h-4 w-24" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div>
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div className="mt-6 flex gap-2 border-t pt-6">
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-muted flex items-center justify-between rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <div>
                          <Skeleton className="mb-1 h-5 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const subscriptionStatus = getSubscriptionStatus();
  const nextBillingDate = getNextBillingDate();

  return (
    <>
      <DashboardHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard/settings/general"
                  className="font-semibold"
                >
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  Billing
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Billing & Invoices</h1>
            <p className="text-muted-foreground">
              Manage your subscription and billing information
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Current Subscription
              </CardTitle>
              <CardDescription>
                Your current plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    Current Plan
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-medium">
                      {subscription ? subscription.plan_name : "No Active Plan"}
                    </p>
                    {subscription && (
                      <Badge className={subscriptionStatus.color}>
                        {subscriptionStatus.label}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    Billing Cycle
                  </p>
                  <p className="text-foreground font-medium">
                    {subscription ? subscription.billing_cycle : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    Next Billing Date
                  </p>
                  <p className="text-foreground font-medium">
                    {nextBillingDate || "N/A"}
                  </p>
                </div>
              </div>

              {subscription?.status === "trialing" &&
                subscription.trial_end &&
                new Date() < new Date(subscription.trial_end) && (
                  <div className="mt-6 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Your trial ends on{" "}
                        {new Date(subscription.trial_end).toLocaleDateString()}{" "}
                        You&apos;ll be charged automatically unless you cancel.
                      </p>
                    </div>
                  </div>
                )}

              {subscription &&
                subscription.cancel_at &&
                subscription.status !== "canceled" && (
                  <div className="mt-6 rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Your subscription will be canceled on{" "}
                        {new Date(subscription.cancel_at).toLocaleDateString()}.
                        You&apos;ll have access until then.
                      </p>
                    </div>
                  </div>
                )}

              {subscription && subscription.status === "canceled" && (
                <div className="mt-6 rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Your subscription has been canceled
                      {subscription.canceled_at &&
                        ` on ${new Date(
                          subscription.canceled_at
                        ).toLocaleDateString()}`}
                      .
                    </p>
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <div className="mt-6 flex gap-2">
                {!subscription ? (
                  <Button asChild>
                    <a href="/pricing">
                      Upgrade to Pro
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                  >
                    {portalLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {portalLoading ? "Loading..." : "Manage Subscription"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Invoices
              </CardTitle>
              <CardDescription>View your recent invoices</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => {
                      const statusProps = getStatusBadgeProps(payment.status);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusProps.variant}
                              className={statusProps.className}
                            >
                              {statusProps.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getFormattedAmount(
                              payment.amount,
                              payment.currency
                            )}
                          </TableCell>
                          <TableCell>
                            {payment.invoice_url ? (
                              <a
                                href={payment.invoice_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex cursor-pointer items-center gap-2 hover:underline"
                              >
                                View
                                <SquareArrowOutUpRight className="hover:text-primary h-4 w-4" />
                              </a>
                            ) : (
                              <span className="inline-flex cursor-not-allowed items-center gap-2">
                                View
                                <SquareArrowOutUpRight className="h-4 w-4 opacity-50" />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Empty className="my-8 border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ReceiptText />
                    </EmptyMedia>
                    <EmptyTitle>No Payment History</EmptyTitle>
                    <EmptyDescription>
                      You haven&apos;t made any payments yet. Upgrade to a paid
                      plan to start using premium features.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <a href="/pricing">
                        Upgrade to Pro
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
