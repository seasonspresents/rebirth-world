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
import { ReceiptText, ArrowRight } from "lucide-react";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatPrice } from "@/lib/payments/constants";
import type { Order } from "@/lib/supabase/types";

export default function SettingsBillingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
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
          .order("created_at", { ascending: false })
          .limit(20);

        setOrders((ordersData as Order[]) || []);
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

  const isLoading = authLoading || dataLoading;

  const totalSpent = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

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
              <CardContent className="p-6">
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
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
            <h1 className="text-2xl font-bold">Billing & Payments</h1>
            <p className="text-muted-foreground">
              View your order payment history
            </p>
          </div>

          {orders.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Orders</CardDescription>
                  <CardTitle className="text-2xl">{orders.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Spent</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatPrice(totalSpent)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent order payments</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.order_number}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.payment_status === "paid"
                                ? "bg-green-500 text-white"
                                : order.payment_status === "refunded"
                                  ? "bg-purple-500 text-white"
                                  : "bg-gray-500 text-white"
                            }
                          >
                            {(order.payment_status ?? "unpaid").charAt(0).toUpperCase() +
                              (order.payment_status ?? "unpaid").slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(order.total, order.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Empty className="my-8 border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ReceiptText />
                    </EmptyMedia>
                    <EmptyTitle>No Payments Yet</EmptyTitle>
                    <EmptyDescription>
                      Your order payment history will appear here after your
                      first purchase.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <a href="/shop">
                        Browse Collection
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
