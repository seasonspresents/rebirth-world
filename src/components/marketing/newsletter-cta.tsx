"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";

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
    <section className="px-6 py-24">
      <motion.div
        className="mx-auto max-w-[660px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Teal glow behind card */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(42,157,143,0.10)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(42,157,143,0.16)_0%,transparent_65%)]" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-10 py-14 text-center">
            {/* Particles */}
            <Particles
              className="pointer-events-none absolute inset-0"
              quantity={30}
              color="#2a9d8f"
              size={0.3}
              staticity={70}
              ease={60}
            />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.12] tracking-tight font-[family-name:var(--font-display)]">
                Join the <em className="text-primary">Rebirth</em> community
              </h2>
              <p className="mx-auto mb-8 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
                Be the first to see new collections, behind-the-scenes process
                stories, and exclusive early access to limited drops.
              </p>

              {status === "success" ? (
                <p className="text-sm font-medium text-primary">
                  Welcome to the community! Check your inbox.
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row"
                >
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Joining..." : "Subscribe"}
                  </Button>
                </form>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-destructive">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
