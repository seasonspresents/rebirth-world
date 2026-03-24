"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { ButtonMovingBorder } from "@/components/ui/moving-border";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section data-section-theme="warm" className="section-warm bg-grain px-6 py-24 md:py-32 lg:py-40">
      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-[var(--rebirth-teal)] opacity-[0.04] blur-[120px]" />

        <TextGenerateEffect
          words="Nothing is wasted. Everything is reborn."
          className="text-fluid-display max-w-[18ch] text-section-fg"
          duration={0.5}
        />

        <motion.p
          className="mt-6 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          New drops, workshop stories, and first access to limited releases.
          Join the crew that keeps Rebirth rolling.
        </motion.p>

        <motion.div
          className="mt-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <BackgroundGradient className="rounded-2xl bg-background p-6">
                <p className="text-base font-medium text-primary">
                  You&apos;re in. Keep an eye on your inbox for the good stuff.
                </p>
              </BackgroundGradient>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <ButtonMovingBorder
                as="button"
                type="submit"
                borderRadius="0.75rem"
                className="bg-background px-6 py-2 text-sm font-medium text-foreground"
                containerClassName="h-10"
                duration={3000}
              >
                {status === "loading" ? "Joining..." : "Subscribe"}
              </ButtonMovingBorder>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
