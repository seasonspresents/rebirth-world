"use client";

import { useState } from "react";
import { Loader2, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/payments/constants";

interface ShippingRate {
  rateId: string;
  carrier: string;
  service: string;
  price: string;
  priceCents: number;
  currency: string;
  estimatedDays: number | null;
  durationTerms: string | null;
}

interface RatesResponse {
  rates: ShippingRate[];
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
}

export function ShippingEstimator() {
  const { items, subtotal } = useCart();
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("US");
  const [rates, setRates] = useState<ShippingRate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeEligible, setFreeEligible] = useState(false);

  async function fetchRates() {
    if (!zip.trim()) return;

    setLoading(true);
    setError(null);
    setRates(null);

    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            name: "Shipping Estimate",
            street1: "123 Main St",
            city: "Anytown",
            state: "CA",
            zip: zip.trim(),
            country,
          },
          items: items.map((item) => ({
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            collection: item.collection ?? undefined,
          })),
          subtotal_cents: subtotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get rates");
      }

      const data: RatesResponse = await res.json();
      setRates(data.rates);
      setFreeEligible(data.freeShippingEligible);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const thresholdCents = parseInt(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "10000",
    10
  );
  const remainingForFree = thresholdCents - subtotal;

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <Truck className="size-4" />
        Estimate Shipping
      </h3>

      <div className="flex gap-2">
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setRates(null);
          }}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="NZ">New Zealand</option>
        </select>
        <Input
          type="text"
          placeholder="ZIP / Postal"
          value={zip}
          onChange={(e) => {
            setZip(e.target.value);
            setRates(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && fetchRates()}
          className="h-9 w-28"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRates}
          disabled={loading || !zip.trim()}
          className="h-9"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Get Rates"}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {rates && rates.length > 0 && (
        <div className="space-y-1.5">
          {rates.map((rate) => (
            <div
              key={rate.rateId}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Package className="size-3.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{rate.service}</span>
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {rate.carrier}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium font-[family-name:var(--font-mono)]">
                  {rate.priceCents === 0
                    ? "FREE"
                    : formatPrice(rate.priceCents)}
                </span>
                {rate.estimatedDays && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {rate.estimatedDays}d
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {rates && rates.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No shipping options available for this destination.
        </p>
      )}

      {!freeEligible && remainingForFree > 0 && (
        <p className="text-xs text-muted-foreground">
          Add {formatPrice(remainingForFree)} more for free shipping
        </p>
      )}
    </div>
  );
}
