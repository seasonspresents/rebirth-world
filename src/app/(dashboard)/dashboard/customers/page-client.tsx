"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { DashboardHeader } from "../layout";
import { useAuth } from "@/components/auth/auth-context";
import { isClientAdmin } from "@/lib/admin-client";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/payments/constants";

interface Customer {
  email: string;
  name: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  userId: string | null;
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
        <BreadcrumbPage className="font-semibold">Customers</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

export default function CustomersPageClient() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isClientAdmin(user?.id)) {
      router.push("/dashboard");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !isClientAdmin(user?.id)) return;
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/admin/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data.customers);
      } catch (err) {
        console.error("Customers fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [user, authLoading]);

  if (loading) {
    return (
      <>
        <DashboardHeader breadcrumb={breadcrumb} />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-20" />
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
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              Customers aggregated from order history
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>
                {customers.length} customer{customers.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {customers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Orders</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.email}>
                        <TableCell className="font-medium">
                          {customer.name || "—"}
                        </TableCell>
                        <TableCell className="max-w-[240px] truncate text-sm">
                          {customer.email}
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.orderCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(customer.totalSpent)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(
                            customer.lastOrderDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              customer.userId
                                ? "border-green-500 text-green-600 dark:text-green-400"
                                : "border-gray-400 text-gray-500"
                            }
                          >
                            {customer.userId ? "Registered" : "Guest"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12">
                  <Users className="text-muted-foreground h-12 w-12" />
                  <p className="text-muted-foreground">
                    No customers found yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
