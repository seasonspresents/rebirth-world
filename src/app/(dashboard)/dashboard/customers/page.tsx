import type { Metadata } from "next";
import CustomersPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Customers | Dashboard",
  description: "View customer information",
  robots: { index: false, follow: false },
};

export default function CustomersPage() {
  return <CustomersPageClient />;
}
