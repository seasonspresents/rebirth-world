import { Hammer, Truck, RotateCcw, Shield } from "lucide-react";

const DEFAULT_BADGES = [
  { icon: Hammer, label: "Handmade", accent: "bg-primary/10 text-primary" },
  { icon: Truck, label: "Free shipping", accent: "bg-accent/10 text-accent" },
  { icon: RotateCcw, label: "30-day returns", accent: "bg-primary/10 text-primary" },
  { icon: Shield, label: "1-year warranty", accent: "bg-accent/10 text-accent" },
];

interface TrustBadgesProps {
  marketingFeatures?: string[];
}

export function TrustBadges({ marketingFeatures }: TrustBadgesProps) {
  const badges =
    marketingFeatures && marketingFeatures.length > 0
      ? marketingFeatures.map((label, i) => {
          const lower = label.toLowerCase();
          const icon = lower.includes("handmade") || lower.includes("craft")
            ? Hammer
            : lower.includes("ship") || lower.includes("delivery")
              ? Truck
              : lower.includes("return") || lower.includes("exchange")
                ? RotateCcw
                : Shield;
          const accent = i % 2 === 0 ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent";
          return { icon, label, accent };
        })
      : DEFAULT_BADGES;

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1 md:grid md:grid-cols-4 md:overflow-visible">
      {badges.map(({ icon: Icon, label, accent }) => (
        <div
          key={label}
          className="flex shrink-0 flex-col items-center gap-1.5 text-center"
        >
          <div className={`flex size-10 items-center justify-center rounded-full ${accent}`}>
            <Icon className="size-4" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
