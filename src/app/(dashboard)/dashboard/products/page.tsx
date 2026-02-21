import type { Metadata } from "next";
import ProductsPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Products | Dashboard",
  description: "View and manage products",
  robots: { index: false, follow: false },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
