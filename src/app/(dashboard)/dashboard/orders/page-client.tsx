"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, Eye } from "lucide-react";
import { DashboardHeader } from "../layout";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-context";
import { formatPrice } from "@/lib/payments/constants";
import type { Order } from "@/lib/supabase/types";

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

const breadcrumb = (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/dashboard" className="font-semibold">
          Dashboard
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="font-semibold">Orders</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

export default function OrdersPageClient() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setDataLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        const fetchedOrders = (ordersData as Order[]) || [];
        setOrders(fetchedOrders);

        // Fetch item counts per order
        if (fetchedOrders.length > 0) {
          const orderIds = fetchedOrders.map((o) => o.id);
          const { data: items } = await supabase
            .from("order_items")
            .select("order_id")
            .in("order_id", orderIds);

          if (items) {
            const counts: Record<string, number> = {};
            for (const item of items) {
              counts[item.order_id] = (counts[item.order_id] || 0) + 1;
            }
            setItemCounts(counts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
      <>
        <DashboardHeader breadcrumb={breadcrumb} />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-4xl space-y-6">
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
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

  return (
    <>
      <DashboardHeader breadcrumb={breadcrumb} />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-muted-foreground">
              View and track your past orders
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                {orders.length} order{orders.length !== 1 ? "s" : ""} total
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const status = getStatusBadge(order.status);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.order_number}
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {itemCounts[order.id] || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(order.total, order.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
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
                      <Package />
                    </EmptyMedia>
                    <EmptyTitle>No orders yet</EmptyTitle>
                    <EmptyDescription>
                      Once you place an order, it will appear here.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <Link href="/shop">
                        Browse Collection
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
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
