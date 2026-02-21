"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Truck,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { DashboardHeader } from "../../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-context";
import { formatPrice } from "@/lib/payments/constants";
import type { Order, OrderItem } from "@/lib/supabase/types";

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return {
        label: "Confirmed",
        className: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
      };
    case "shipped":
      return {
        label: "Shipped",
        className: "bg-blue-500 text-white dark:bg-blue-600 dark:text-white",
      };
    case "delivered":
      return {
        label: "Delivered",
        className: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
      };
    case "canceled":
    case "refunded":
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        className: "bg-red-500 text-white dark:bg-red-600 dark:text-white",
      };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        className: "bg-gray-500 text-white dark:bg-gray-600 dark:text-white",
      };
  }
}

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setDataLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single();

        if (orderError || !orderData) {
          setNotFound(true);
          setDataLoading(false);
          return;
        }

        setOrder(orderData as Order);

        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        setItems((itemsData as OrderItem[]) || []);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setNotFound(true);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrder();
    }
  }, [user, authLoading, orderId]);

  const isLoading = authLoading || dataLoading;

  const makeBreadcrumb = (orderNumber?: string) => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="font-semibold">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/orders" className="font-semibold">
            Orders
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">
            {orderNumber || "..."}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (isLoading) {
    return (
      <>
        <DashboardHeader breadcrumb={makeBreadcrumb()} />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-5xl space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="flex-1">
                            <Skeleton className="mb-1 h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !order) {
    return (
      <>
        <DashboardHeader breadcrumb={makeBreadcrumb()} />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-4xl">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <AlertCircle className="text-muted-foreground h-12 w-12" />
                <h2 className="text-xl font-semibold">Order not found</h2>
                <p className="text-muted-foreground">
                  This order doesn&apos;t exist or you don&apos;t have
                  permission to view it.
                </p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/orders">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const status = getStatusBadge(order.status);
  const hasShipping = order.shipping_name || order.shipping_address_line1;
  const hasTracking = order.tracking_number;
  const currency = order.currency || "usd";

  return (
    <>
      <DashboardHeader breadcrumb={makeBreadcrumb(order.order_number)} />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-5xl space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Order items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Items
                  </CardTitle>
                  <CardDescription>
                    {items.length} item{items.length !== 1 ? "s" : ""} in this
                    order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-lg border p-3"
                      >
                        {item.product_image_url ? (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={item.product_image_url}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-md">
                            <Package className="text-muted-foreground h-6 w-6" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {item.product_name}
                          </p>
                          {item.variant_name && (
                            <p className="text-muted-foreground text-sm">
                              {item.variant_name}
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm">
                            {formatPrice(item.unit_price, currency)} &times;{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 font-medium">
                          {formatPrice(item.total_price, currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping address */}
              {hasShipping && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm leading-relaxed">
                      {order.shipping_name && (
                        <p className="font-medium">{order.shipping_name}</p>
                      )}
                      {order.shipping_address_line1 && (
                        <p>{order.shipping_address_line1}</p>
                      )}
                      {order.shipping_address_line2 && (
                        <p>{order.shipping_address_line2}</p>
                      )}
                      <p>
                        {[
                          order.shipping_city,
                          order.shipping_state,
                          order.shipping_postal_code,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {order.shipping_country && (
                        <p>{order.shipping_country}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tracking */}
              {hasTracking && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Tracking number:{" "}
                      </span>
                      <span className="font-medium">
                        {order.tracking_number}
                      </span>
                    </p>
                    {order.tracking_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        asChild
                      >
                        <a
                          href={order.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Track Package
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column — sticky sidebar */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Order number
                      </span>
                      <span className="font-medium">
                        {order.order_number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {order.shipping_cost > 0
                          ? formatPrice(order.shipping_cost, currency)
                          : "Free"}
                      </span>
                    </div>
                    {order.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>
                          {formatPrice(order.tax_amount, currency)}
                        </span>
                      </div>
                    )}
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-green-600 dark:text-green-400">
                          -{formatPrice(order.discount_amount, currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(order.total, currency)}</span>
                  </div>

                  {order.customer_notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                          Notes
                        </p>
                        <p className="text-sm">{order.customer_notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
