import Link from "next/link";
import type { Product } from "@/lib/payments/constants";
import { formatPrice } from "@/lib/payments/constants";

interface FinalCtaProps {
  product: Product;
}

export function FinalCta({ product }: FinalCtaProps) {
  const priceStr = formatPrice(product.price, product.currency);

  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ backgroundColor: "#1c1a17", padding: "120px 24px" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 15% 50%, rgba(196,96,58,0.14) 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 85% 30%, rgba(92,102,68,0.10) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-[1] mx-auto" style={{ maxWidth: 660 }}>
        <span
          className="block text-[10px] font-semibold tracking-[3.5px] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Wear the Message
        </span>
        <h2
          className="font-[family-name:var(--font-editorial)] italic font-semibold leading-[1.15] mb-4"
          style={{
            fontSize: "clamp(34px, 6vw, 64px)",
            color: "#f2ece0",
          }}
        >
          Every Chapter Deserves
          <br />
          Something{" "}
          <em className="not-italic" style={{ color: "#c4603a" }}>
            Worth Wearing.
          </em>
        </h2>
        <p
          className="text-[15px] leading-[1.8] mb-10 mx-auto"
          style={{ color: "#777", maxWidth: 520 }}
        >
          I make these collections for the person in the middle of something
          &mdash; a transition, a growth, a letting go. These aren&apos;t basics.
          They&apos;re reminders. Thoughtfully designed, collaboratively made, and
          meant to be worn into whatever you&apos;re walking toward.
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="block mx-auto font-[family-name:var(--font-caps)] text-[20px] tracking-[2.5px] py-5 px-12 transition-all hover:-translate-y-px mb-3.5"
          style={{
            backgroundColor: "#c4603a",
            color: "#fff",
            maxWidth: 380,
          }}
        >
          SHOP CURRENT DROP &mdash; {priceStr}
        </Link>
        <p className="text-[11px] tracking-[0.5px]" style={{ color: "#444" }}>
          Free US Shipping $75+ &middot; 30-Day Returns &middot; Eco-Conscious
          Materials &middot; Limited Edition
        </p>
      </div>
    </section>
  );
}
