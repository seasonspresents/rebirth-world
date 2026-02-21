import type { Metadata } from "next";
import OrdersPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Orders | Dashboard",
  description: "View your order history",
};

export default function OrdersPage() {
  return <OrdersPageClient />;
}
