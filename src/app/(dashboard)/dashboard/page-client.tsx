"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { DashboardHeader } from "./layout";
import { ChartAreaInteractive, OrderChartDataPoint } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { createBrowserClient } from "@supabase/ssr";
import { Skeleton } from "@/components/ui/skeleton";

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { start, end };
}

export function DashboardPageClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState({
    orderCount: 0,
    revenue: 0,
    avgOrderValue: 0,
    pendingShipments: 0,
  });
  const [chartData, setChartData] = React.useState<OrderChartDataPoint[]>([]);

  React.useEffect(() => {
    if (!user) return;

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    async function fetchData() {
      const { start, end } = getMonthRange();

      // Fetch this month's orders for metrics
      const { data: monthOrders } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .eq("user_id", user!.id)
        .gte("created_at", start)
        .lte("created_at", end);

      const orders = monthOrders ?? [];
      const orderCount = orders.length;
      const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0) / 100;
      const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;
      const pendingShipments = orders.filter((o) => o.status === "confirmed").length;

      setMetrics({ orderCount, revenue, avgOrderValue, pendingShipments });

      // Fetch last 90 days of orders for chart
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: chartOrders } = await supabase
        .from("orders")
        .select("total, created_at")
        .eq("user_id", user!.id)
        .gte("created_at", ninetyDaysAgo.toISOString());

      // Aggregate by date
      const byDate = new Map<string, { orders: number; revenue: number }>();
      for (const o of chartOrders ?? []) {
        const date = o.created_at.slice(0, 10);
        const existing = byDate.get(date) ?? { orders: 0, revenue: 0 };
        existing.orders += 1;
        existing.revenue += (o.total ?? 0) / 100;
        byDate.set(date, existing);
      }

      const chart: OrderChartDataPoint[] = Array.from(byDate.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(chart);
      setLoading(false);
    }

    fetchData();
  }, [user]);

  return (
    <>
      <DashboardHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  Overview
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        actions={
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/settings/general")}
          >
            <Settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Settings</span>
          </Button>
        }
      />
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-xl" />
            ))}
          </div>
        ) : (
          <SectionCards {...metrics} />
        )}
        <div className="px-4 lg:px-6">
          {loading ? (
            <Skeleton className="h-[350px] rounded-xl" />
          ) : (
            <ChartAreaInteractive chartData={chartData} />
          )}
        </div>
      </div>
    </>
  );
}
