import Link from "next/link";
import { Shield } from "lucide-react";

export function Guarantee() {
  return (
    <section className="bg-[var(--rebirth-amber)] px-5 py-16 text-center md:py-20">
      <div className="mx-auto max-w-[680px]">
        <div className="mb-5 flex justify-center">
          <Shield className="size-16 text-white" strokeWidth={1.5} />
        </div>
        <h2 className="mb-4 font-[family-name:var(--font-caps)] text-[clamp(38px,6vw,68px)] leading-none tracking-[3px] text-white">
          30-DAY SATISFACTION
          <br />
          GUARANTEE
        </h2>
        <p className="mb-7 text-[15px] leading-[1.8] text-white/85">
          I put everything I have into every piece I make. If you&apos;re not
          completely satisfied — for any reason — return it within 30 days for a
          full refund or exchange. No paperwork. No questions. That&apos;s my
          word.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 bg-[var(--rebirth-warm-black)] px-12 py-5 font-[family-name:var(--font-caps)] text-xl tracking-[2.5px] text-[var(--rebirth-film-cream)] transition-all hover:-translate-y-0.5 hover:bg-[#111]"
        >
          SHOP RISK-FREE
        </Link>
      </div>
    </section>
  );
}
