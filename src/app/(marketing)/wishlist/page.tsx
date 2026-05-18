import type { Metadata } from "next";
import { WishlistPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Saved Items",
  description: "Products saved for later from Rebirth World.",
  alternates: {
    canonical: "/wishlist",
  },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
