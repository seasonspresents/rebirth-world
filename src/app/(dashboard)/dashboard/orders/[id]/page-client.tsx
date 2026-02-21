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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-context";
import { isClientAdmin } from "@/lib/admin-client";
import { formatPrice } from "@/lib/payments/constants";
import type { Order, OrderItem } from "@/lib/supabase/types";

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return {
        label: "Confirmed",
        className: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
      };
    case "processing":
      return {
        label: "Processing",
        className: "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white",
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
    case "cancelled":
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

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const CARRIER_OPTIONS = ["USPS", "UPS", "FedEx", "DHL", "Other"];

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const isAdmin = isClientAdmin(user?.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Admin fulfillment state
  const [adminStatus, setAdminStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [carrier, setCarrier] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [fulfilling, setFulfilling] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setDataLoading(false);
        return;
      }

      try {
        if (isAdmin) {
          // Admin: fetch from admin API (no user_id filter)
          const res = await fetch(`/api/admin/orders/${orderId}`);
          if (!res.ok) {
            setNotFound(true);
            setDataLoading(false);
            return;
          }
          const data = await res.json();
          setOrder(data.order as Order);
          setItems((data.items as OrderItem[]) || []);
          // Initialize admin form fields
          setAdminStatus(data.order.status);
          setTrackingNumber(data.order.tracking_number || "");
          setTrackingUrl(data.order.tracking_url || "");
          setAdminNotes(data.order.notes || "");
        } else {
          // Customer: fetch own order via Supabase
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
        }
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
  }, [user, authLoading, orderId, isAdmin]);

  const handleStatusUpdate = async () => {
    if (!adminStatus || adminStatus === order?.status) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: adminStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setOrder(data.order as Order);
      toast.success(`Status updated to ${adminStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleFulfill = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Tracking number is required");
      return;
    }
    setFulfilling(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          tracking_url: trackingUrl || undefined,
          carrier: carrier || undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Failed to fulfill order");
        return;
      }
      const data = await res.json();
      setOrder(data.order as Order);
      setAdminStatus("shipped");
      if (data.emailSent) {
        toast.success("Order marked as shipped and customer notified");
      } else {
        toast.warning("Order marked as shipped, but email notification failed. Notify customer manually.");
      }
    } catch {
      toast.error("Failed to fulfill order");
    } finally {
      setFulfilling(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: adminNotes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      const data = await res.json();
      setOrder(data.order as Order);
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

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
                          {item.engraving_text && (
                            <p className="text-muted-foreground text-sm">
                              Engraving: &quot;{item.engraving_text}&quot;
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

              {/* Tracking (customer view) */}
              {!isAdmin && hasTracking && (
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

              {/* Admin: Fulfillment controls */}
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Fulfillment
                    </CardTitle>
                    <CardDescription>
                      Update order status, add tracking, and notify customer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status update */}
                    <div className="space-y-2">
                      <Label>Order Status</Label>
                      <div className="flex gap-2">
                        <Select
                          value={adminStatus}
                          onValueChange={setAdminStatus}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={handleStatusUpdate}
                          disabled={
                            updatingStatus || adminStatus === order.status
                          }
                        >
                          {updatingStatus && (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          )}
                          Update
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Tracking info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="carrier">Carrier</Label>
                        <Select value={carrier} onValueChange={setCarrier}>
                          <SelectTrigger id="carrier">
                            <SelectValue placeholder="Select carrier" />
                          </SelectTrigger>
                          <SelectContent>
                            {CARRIER_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tracking-number">Tracking Number</Label>
                        <Input
                          id="tracking-number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tracking-url">
                          Tracking URL (optional)
                        </Label>
                        <Input
                          id="tracking-url"
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <Button
                        onClick={handleFulfill}
                        disabled={fulfilling || !trackingNumber.trim()}
                        className="w-full"
                      >
                        {fulfilling && (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        )}
                        Mark as Shipped & Notify Customer
                      </Button>
                    </div>

                    <Separator />

                    {/* Admin notes */}
                    <div className="space-y-2">
                      <Label htmlFor="admin-notes">Admin Notes</Label>
                      <Textarea
                        id="admin-notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Internal notes about this order..."
                        rows={3}
                      />
                      <Button
                        variant="outline"
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                      >
                        {savingNotes && (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        )}
                        Save Notes
                      </Button>
                    </div>
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
                    {isAdmin && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer</span>
                        <span className="max-w-[180px] truncate text-right">
                          {order.email}
                        </span>
                      </div>
                    )}
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
                          Customer Notes
                        </p>
                        <p className="text-sm">{order.customer_notes}</p>
                      </div>
                    </>
                  )}

                  {/* Admin: show tracking info in summary if it exists */}
                  {isAdmin && hasTracking && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm font-medium">
                          Tracking
                        </p>
                        <p className="font-mono text-sm">
                          {order.tracking_number}
                        </p>
                        {order.tracking_url && (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Track package
                            <ExternalLink className="ml-1 inline h-3 w-3" />
                          </a>
                        )}
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
