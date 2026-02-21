"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const chartData = [
  { date: "2026-01-01", dms: 42, sms: 28 },
  { date: "2026-01-02", dms: 38, sms: 32 },
  { date: "2026-01-03", dms: 51, sms: 24 },
  { date: "2026-01-04", dms: 47, sms: 35 },
  { date: "2026-01-05", dms: 55, sms: 29 },
  { date: "2026-01-06", dms: 33, sms: 41 },
  { date: "2026-01-07", dms: 29, sms: 22 },
  { date: "2026-01-08", dms: 44, sms: 31 },
  { date: "2026-01-09", dms: 52, sms: 27 },
  { date: "2026-01-10", dms: 48, sms: 33 },
  { date: "2026-01-11", dms: 61, sms: 38 },
  { date: "2026-01-12", dms: 39, sms: 26 },
  { date: "2026-01-13", dms: 43, sms: 30 },
  { date: "2026-01-14", dms: 56, sms: 34 },
  { date: "2026-01-15", dms: 50, sms: 29 },
  { date: "2026-01-16", dms: 47, sms: 36 },
  { date: "2026-01-17", dms: 58, sms: 31 },
  { date: "2026-01-18", dms: 42, sms: 25 },
  { date: "2026-01-19", dms: 35, sms: 28 },
  { date: "2026-01-20", dms: 49, sms: 33 },
  { date: "2026-01-21", dms: 53, sms: 37 },
  { date: "2026-01-22", dms: 46, sms: 30 },
  { date: "2026-01-23", dms: 60, sms: 35 },
  { date: "2026-01-24", dms: 44, sms: 28 },
  { date: "2026-01-25", dms: 38, sms: 24 },
  { date: "2026-01-26", dms: 51, sms: 32 },
  { date: "2026-01-27", dms: 57, sms: 36 },
  { date: "2026-01-28", dms: 49, sms: 29 },
  { date: "2026-01-29", dms: 54, sms: 33 },
  { date: "2026-01-30", dms: 62, sms: 38 },
  { date: "2026-01-31", dms: 45, sms: 27 },
  { date: "2026-02-01", dms: 48, sms: 31 },
  { date: "2026-02-02", dms: 52, sms: 34 },
  { date: "2026-02-03", dms: 41, sms: 26 },
  { date: "2026-02-04", dms: 55, sms: 30 },
  { date: "2026-02-05", dms: 59, sms: 37 },
  { date: "2026-02-06", dms: 47, sms: 29 },
  { date: "2026-02-07", dms: 36, sms: 23 },
  { date: "2026-02-08", dms: 50, sms: 32 },
  { date: "2026-02-09", dms: 54, sms: 35 },
  { date: "2026-02-10", dms: 43, sms: 28 },
  { date: "2026-02-11", dms: 58, sms: 33 },
  { date: "2026-02-12", dms: 46, sms: 30 },
  { date: "2026-02-13", dms: 51, sms: 34 },
  { date: "2026-02-14", dms: 63, sms: 40 },
  { date: "2026-02-15", dms: 49, sms: 31 },
  { date: "2026-02-16", dms: 44, sms: 27 },
  { date: "2026-02-17", dms: 56, sms: 35 },
  { date: "2026-02-18", dms: 52, sms: 33 },
  { date: "2026-02-19", dms: 48, sms: 29 },
  { date: "2026-02-20", dms: 57, sms: 36 },
];

const chartConfig = {
  conversations: {
    label: "Conversations",
  },
  dms: {
    label: "DMs & Voice",
    color: "var(--primary)",
  },
  sms: {
    label: "SMS & Text",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2026-02-20");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Conversations Handled</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Messages handled by Rebirth World
          </span>
          <span className="@[540px]/card:hidden">AI conversations</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDms" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dms)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dms)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSms" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sms)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sms)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sms"
              type="natural"
              fill="url(#fillSms)"
              stroke="var(--color-sms)"
              stackId="a"
            />
            <Area
              dataKey="dms"
              type="natural"
              fill="url(#fillDms)"
              stroke="var(--color-dms)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
