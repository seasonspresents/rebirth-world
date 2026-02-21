import { NextRequest, NextResponse } from "next/server";
import { listProducts, getProductsByCollection } from "@/lib/payments/products";

export async function GET(req: NextRequest) {
  try {
    const collection = req.nextUrl.searchParams.get("collection");

    const products = collection
      ? await getProductsByCollection(collection)
      : await listProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
