import Link from "next/link";

export function GuaranteeSection() {
  return (
    <section
      className="text-center px-6"
      style={{ backgroundColor: "#c4603a", padding: "80px 24px" }}
    >
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        <div className="text-[64px] mb-5">🛡️</div>
        <h2
          className="font-[family-name:var(--font-caps)] text-white leading-none mb-4"
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            letterSpacing: 3,
          }}
        >
          30-DAY SATISFACTION
          <br />
          GUARANTEE
        </h2>
        <p
          className="text-[15px] leading-[1.8] mb-7"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          If your piece doesn&apos;t fit right or you&apos;re not happy with it,
          return it unworn within 30 days. I want you to love what you&apos;re
          wearing &mdash; and wearing what you love.
        </p>
        <Link
          href="#"
          className="inline-flex items-center justify-center font-[family-name:var(--font-caps)] text-base tracking-[2.5px] px-9 py-4 transition-all hover:-translate-y-px"
          style={{ backgroundColor: "#1c1a17", color: "#f2ece0" }}
        >
          SHOP RISK-FREE
        </Link>
      </div>
    </section>
  );
}
