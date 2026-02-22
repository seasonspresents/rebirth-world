import type { Metadata } from "next";
import ProductEditClient from "./page-client";

export const metadata: Metadata = {
  title: "Edit Product | Dashboard",
  description: "Edit product details",
  robots: { index: false, follow: false },
};

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductEditClient productId={id} />;
}
