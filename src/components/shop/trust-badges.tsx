import { Hammer, Truck, RotateCcw, Shield } from "lucide-react";

const DEFAULT_BADGES = [
  { icon: Hammer, label: "Handmade" },
  { icon: Truck, label: "Free shipping" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Shield, label: "Lifetime warranty" },
];

interface TrustBadgesProps {
  marketingFeatures?: string[];
}

export function TrustBadges({ marketingFeatures }: TrustBadgesProps) {
  const badges =
    marketingFeatures && marketingFeatures.length > 0
      ? marketingFeatures.map((label) => {
          const lower = label.toLowerCase();
          const icon = lower.includes("handmade") || lower.includes("craft")
            ? Hammer
            : lower.includes("ship") || lower.includes("delivery")
              ? Truck
              : lower.includes("return") || lower.includes("exchange")
                ? RotateCcw
                : Shield;
          return { icon, label };
        })
      : DEFAULT_BADGES;

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1 md:grid md:grid-cols-4 md:overflow-visible">
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex shrink-0 flex-col items-center gap-1.5 text-center"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
