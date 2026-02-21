import { ImageResponse } from "next/og";

export const alt = "Rebirth World — Handcrafted Recycled Jewelry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1a1a1a",
          color: "#f5f0e8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Subtle teal glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(42,157,143,0.12) 0%, transparent 60%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "36px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              color: "#2a9d8f",
            }}
          >
            Rebirth
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "60px",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            maxWidth: "820px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span>Handcrafted </span>
          <span style={{ color: "#2a9d8f" }}>Recycled Jewelry</span>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "22px",
            color: "#8b8b85",
            textAlign: "center",
            marginTop: "28px",
            maxWidth: "620px",
            lineHeight: 1.5,
          }}
        >
          Each piece carries a story of transformation
        </div>

        {/* Domain pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "44px",
            padding: "8px 20px",
            borderRadius: "100px",
            border: "1px solid rgba(42,157,143,0.3)",
            background: "rgba(42,157,143,0.06)",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              color: "#2a9d8f",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            rebirth.world
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
