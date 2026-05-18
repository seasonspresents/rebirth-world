"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/cart-context";
import type { CartShippingAddress, CartShippingRate } from "@/lib/cart/types";
import { formatPrice } from "@/lib/payments/constants";

interface RatesResponse {
  rates: CartShippingRate[];
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
}

export function ShippingEstimator() {
  const {
    items,
    subtotal,
    selectedShippingRate,
    shippingAddress,
    setShippingRate,
    setShippingAddress,
    clearShippingSelection,
  } = useCart();
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("US");
  const [rates, setRates] = useState<CartShippingRate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeEligible, setFreeEligible] = useState(false);

  async function fetchRates() {
    if (!zip.trim()) return;

    setLoading(true);
    setError(null);
    setRates(null);
    clearShippingSelection();

    const estimateAddress: CartShippingAddress = {
      name: "Shipping Estimate",
      street1: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: zip.trim(),
      country,
    };

    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: estimateAddress,
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
      setShippingAddress(estimateAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function selectRate(rate: CartShippingRate) {
    setShippingRate(rate);
    if (!shippingAddress || shippingAddress.zip !== zip.trim()) {
      setShippingAddress({
        name: "Shipping Estimate",
        street1: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: zip.trim(),
        country,
      });
    }
  }

  const thresholdCents = parseInt(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "10000",
    10
  );
  const remainingForFree = thresholdCents - subtotal;

  useEffect(() => {
    if (!shippingAddress) return;
    setZip(shippingAddress.zip);
    setCountry(shippingAddress.country);
  }, [shippingAddress]);

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
            clearShippingSelection();
          }}
          className="border-border bg-background h-9 rounded-md border px-3 text-sm"
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
            clearShippingSelection();
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

      {error && <p className="text-destructive text-xs">{error}</p>}

      {rates && rates.length > 0 && (
        <div className="space-y-1.5">
          {rates.map((rate) => (
            <button
              type="button"
              key={rate.rateId}
              onClick={() => selectRate(rate)}
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                selectedShippingRate?.rateId === rate.rateId
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-4 items-center justify-center rounded-full border ${
                    selectedShippingRate?.rateId === rate.rateId
                      ? "border-primary"
                      : "border-muted-foreground/50"
                  }`}
                  aria-hidden="true"
                >
                  {selectedShippingRate?.rateId === rate.rateId && (
                    <span className="bg-primary size-2 rounded-full" />
                  )}
                </span>
                <Package className="text-muted-foreground size-3.5" />
                <div>
                  <span className="font-medium">{rate.service}</span>
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    {rate.carrier}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-[family-name:var(--font-mono)] font-medium">
                  {rate.priceCents === 0
                    ? "FREE"
                    : formatPrice(rate.priceCents)}
                </span>
                {rate.estimatedDays && (
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    {rate.estimatedDays}d
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedShippingRate && (
        <p className="text-muted-foreground text-xs">
          Selected: {selectedShippingRate.service}. Final shipping is verified
          at checkout.
        </p>
      )}

      {rates && rates.length === 0 && (
        <p className="text-muted-foreground text-xs">
          No shipping options available for this destination.
        </p>
      )}

      {!freeEligible && remainingForFree > 0 && (
        <p className="text-muted-foreground text-xs">
          Add {formatPrice(remainingForFree)} more for free shipping
        </p>
      )}
    </div>
  );
}
