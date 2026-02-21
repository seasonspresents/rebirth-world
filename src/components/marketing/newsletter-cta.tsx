"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <section className="bg-grain px-6 py-24 md:py-40">
      <div className="mx-auto max-w-[1200px]">
        <motion.h2
          className="max-w-[18ch] text-4xl leading-[1.08] tracking-tight md:text-6xl font-[family-name:var(--font-display)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Nothing is wasted.{" "}
          <em className="not-italic text-primary">Everything is reborn.</em>
        </motion.h2>

        <motion.p
          className="mt-6 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          New drops, workshop stories, and first access to limited releases.
          Join the crew that keeps Rebirth rolling.
        </motion.p>

        <motion.div
          className="mt-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {status === "success" ? (
            <p className="text-base font-medium text-primary">
              You&apos;re in. Keep an eye on your inbox for the good stuff.
            </p>
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
        </motion.div>
      </div>
    </section>
  );
}
