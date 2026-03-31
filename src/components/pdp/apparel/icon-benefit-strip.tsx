const ICONS = [
  { icon: "🎨", label: "Artist\nCollaborations" },
  { icon: "🌿", label: "Eco-Conscious\nMaterials" },
  { icon: "♻️", label: "Recycled\nPolyester" },
  { icon: "✂️", label: "Limited\nDrops Only" },
  { icon: "💬", label: "Wearable\nMessage" },
  { icon: "🤝", label: "Community\nService" },
  { icon: "🚚", label: "Free US\nShipping $75+" },
];

export function IconBenefitStrip() {
  return (
    <div
      className="overflow-x-auto py-7"
      style={{
        backgroundColor: "#f2ece0",
        borderBottom: "1px solid #e6ddd0",
      }}
    >
      <div
        className="flex mx-auto px-6"
        style={{ minWidth: 540, maxWidth: 1200 }}
      >
        {ICONS.map((item, i) => (
          <div
            key={item.label}
            className="flex-1 text-center py-3 px-1.5"
            style={{
              borderRight: i < ICONS.length - 1 ? "1px solid #e6ddd0" : "none",
            }}
          >
            <div className="text-2xl mb-1.5">{item.icon}</div>
            <div
              className="text-[10px] font-semibold tracking-[0.5px] leading-[1.3] whitespace-pre-line"
              style={{ color: "#1c1a17" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
