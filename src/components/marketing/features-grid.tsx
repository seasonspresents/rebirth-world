"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";
import Image from "next/image";

/* ═══════════════════════════════════════════════
   Animation loop hook
   Cycles through steps at given delays, resets, repeats.
   ═══════════════════════════════════════════════ */

function useLoop(delays: number[], cycle: number): number {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    let active = true;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const run = () => {
      if (!active) return;
      clear();
      setStep(-1);
      delays.forEach((d, i) => {
        timers.push(setTimeout(() => active && setStep(i), d));
      });
      timers.push(setTimeout(run, cycle));
    };

    run();
    return () => {
      active = false;
      clear();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return step;
}

/* ═══════════════════════════════════════════════
   Shared mini-components
   ═══════════════════════════════════════════════ */

function MiniAvatar({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={22}
      height={22}
      className="shrink-0 rounded-full"
    />
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-[3px] rounded-2xl bg-accent/10 px-2.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1 w-1 rounded-full bg-accent/50"
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function ClientBubble({ text }: { text: string }) {
  return (
    <motion.div
      className="flex"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-2xl rounded-bl-sm bg-foreground/[0.06] px-2.5 py-1.5 text-[0.6rem] leading-snug text-muted-foreground">
        {text}
      </div>
    </motion.div>
  );
}

function AiBubble({
  text,
  avatar,
  showAvatar = true,
}: {
  text: string;
  avatar: string;
  showAvatar?: boolean;
}) {
  return (
    <motion.div
      className="flex items-end justify-end gap-1.5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-2xl rounded-br-sm bg-accent/10 px-2.5 py-1.5 text-[0.6rem] leading-snug">
        {text}
      </div>
      {showAvatar && <MiniAvatar src={avatar} />}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Scene 1: Speed Reply — Luna answers in seconds
   ═══════════════════════════════════════════════ */

function SpeedReplyScene() {
  const step = useLoop([300, 1300, 2500, 3500], 6500);
  const avatar = "/avatars/ai-dm.png";

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-4">
      {step >= 0 && (
        <ClientBubble text="Hey! Do you do fine-line botanicals?" />
      )}
      {step === 1 && (
        <motion.div
          className="flex items-center justify-end gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TypingDots />
          <MiniAvatar src={avatar} />
        </motion.div>
      )}
      {step >= 2 && (
        <AiBubble
          text="Hi! Florals are my specialty — want to see some recent work?"
          avatar={avatar}
        />
      )}
      {step >= 3 && (
        <motion.div
          className="flex justify-center pt-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.55rem] font-semibold text-accent">
            ⚡ Replied in 8 seconds
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Scene 2: Night Shift — Hex handles after-hours
   ═══════════════════════════════════════════════ */

function NightShiftScene() {
  const step = useLoop([300, 1500, 3100], 5800);
  const avatar = "/avatars/ai-outbound.png";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-3">
      {step >= 0 && (
        <motion.p
          className="text-[0.6rem] font-medium text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🌙 11:47 PM
        </motion.p>
      )}
      {step >= 1 && (
        <motion.div
          className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MiniAvatar src={avatar} />
          <div className="min-w-0 flex-1">
            <p className="text-[0.6rem] font-medium">Booking confirmed</p>
            <p className="truncate text-[0.5rem] text-muted-foreground">
              Sarah M. — Floral half-sleeve
            </p>
          </div>
          <span className="text-[0.6rem] text-green-500">✓</span>
        </motion.div>
      )}
      {step >= 2 && (
        <motion.div
          className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MiniAvatar src={avatar} />
          <div className="min-w-0 flex-1">
            <p className="text-[0.6rem] font-medium">Deposit received</p>
            <p className="truncate text-[0.5rem] text-muted-foreground">
              $350 · Marcus R.
            </p>
          </div>
          <span className="text-[0.6rem] text-green-500">✓</span>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Scene 3: Style Match — Big Mike quotes prices
   ═══════════════════════════════════════════════ */

function StyleMatchScene() {
  const step = useLoop([300, 1500, 2700], 5700);
  const avatar = "/avatars/ai-sms.png";

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-4">
      {step >= 0 && (
        <ClientBubble text="How much for a traditional eagle?" />
      )}
      {step >= 1 && (
        <AiBubble
          text="Great choice! $800–1,200 depending on size and placement."
          avatar={avatar}
        />
      )}
      {step >= 2 && (
        <AiBubble
          text="$200 deposit locks your spot. Want to check availability?"
          avatar={avatar}
          showAvatar={false}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Scene 4: Smart Filter — Kenji screens inquiries
   ═══════════════════════════════════════════════ */

const inquiries = [
  { text: "small infinity symbol on wrist", qualified: false },
  { text: "Japanese sleeve — $3K budget", qualified: true },
  { text: "face tattoo how much lol", qualified: false },
];

function FilterScene() {
  const step = useLoop([300, 1100, 1900, 2700], 5500);

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-3">
      <div className="mb-1 flex items-center gap-1.5">
        <MiniAvatar src="/avatars/ai-voice.png" />
        <span className="text-[0.55rem] font-medium text-muted-foreground/70">
          Screening inquiries
        </span>
      </div>
      {inquiries.map((item, i) =>
        step >= 0 ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: step >= i + 1 && !item.qualified ? 0.3 : 1,
              y: 0,
            }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-center justify-between rounded-lg border border-border/40 px-2.5 py-1.5"
          >
            <span className="max-w-[70%] truncate text-[0.55rem] text-muted-foreground">
              {item.text}
            </span>
            {step >= i + 1 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={
                  item.qualified
                    ? "text-[0.55rem] font-bold text-green-500"
                    : "text-[0.55rem] text-muted-foreground/30"
                }
              >
                {item.qualified ? "✓ Qualified" : "✗"}
              </motion.span>
            )}
          </motion.div>
        ) : null
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Scene 5: Deposit — payment notification
   ═══════════════════════════════════════════════ */

function DepositScene() {
  const step = useLoop([300, 1300], 4500);

  return (
    <div className="flex h-full items-center justify-center px-4">
      {step >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full max-w-[200px] rounded-xl border border-green-500/20 bg-green-500/[0.04] p-4 text-center"
        >
          <div className="text-2xl font-semibold leading-none font-[family-name:var(--font-display)]">
            $350
          </div>
          <p className="mt-1 text-[0.6rem] font-medium text-green-600 dark:text-green-400">
            Deposit received
          </p>
          <p className="mt-0.5 text-[0.5rem] text-muted-foreground">
            Sarah M. · Floral half-sleeve
          </p>
          {step >= 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[0.5rem] text-white"
            >
              ✓
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Scene 6: Stay in Chair — calendar fills up
   ═══════════════════════════════════════════════ */

const slots = ["10:00 AM", "12:30 PM", "2:00 PM", "4:30 PM"];

function ChairScene() {
  const step = useLoop([300, 900, 1500, 2100, 2700], 5500);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 px-4">
      {step >= 0 && (
        <motion.p
          className="text-[0.55rem] font-medium text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🔕 Phone on silent · You&apos;re tattooing
        </motion.p>
      )}
      <div className="grid w-full max-w-[190px] gap-1">
        {slots.map((time, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded px-2.5 py-1 text-[0.5rem] transition-colors duration-300 ${
              step >= i + 1
                ? "border border-green-500/30 bg-green-500/[0.06]"
                : "border border-border/30"
            }`}
          >
            <span className="text-muted-foreground">{time}</span>
            {step >= i + 1 && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="text-[0.5rem] font-medium text-green-500"
              >
                Booked ✓
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Features data
   ═══════════════════════════════════════════════ */

const features = [
  {
    title: "Every message answered in 60 seconds",
    description:
      "No more leads lost to slow replies. Your AI responds to DMs, texts, and missed calls before they message your competitor.",
    Scene: SpeedReplyScene,
  },
  {
    title: "Books clients while you sleep",
    description:
      "62% of inquiries come after hours. Your assistant works the midnight shift so you don't have to.",
    Scene: NightShiftScene,
  },
  {
    title: "Trained on your style, prices, and process",
    description:
      "Not a generic chatbot. It knows your work, your hourly rate, your placement preferences. Clients think they're talking to your front desk.",
    Scene: StyleMatchScene,
  },
  {
    title: "Filters tire-kickers automatically",
    description:
      "Asks about style, placement, size, and budget before you're ever involved. You only talk to people ready to book.",
    Scene: FilterScene,
  },
  {
    title: "Deposits collected before you're involved",
    description:
      "No more awkward money conversations. Pricing and deposits happen naturally in the chat — before you ever pick up your phone.",
    Scene: DepositScene,
  },
  {
    title: "You stay in the chair",
    description:
      "No more stopping mid-session to check your phone. Your assistant handles the front desk. You handle the art.",
    Scene: ChairScene,
  },
];

/* ═══════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════ */

export function FeaturesGrid() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        {/* Section Heading */}
        <motion.div
          className="mx-auto mb-14 max-w-[600px] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Coverage, not boundaries
          </p>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.12] tracking-tight font-[family-name:var(--font-display)]">
            You became an artist.{" "}
            <span className="italic text-muted-foreground/70">
              Not a receptionist.
            </span>
          </h2>
          <p className="mx-auto max-w-[58ch] text-base leading-relaxed text-muted-foreground">
            Every feature exists to solve one problem: you&apos;re doing a
            receptionist&apos;s job on top of a tattooing job. Here&apos;s what
            changes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Border beam on the first card */}
              {index === 0 && (
                <BorderBeam
                  size={80}
                  duration={8}
                  colorFrom="#e08a30"
                  colorTo="transparent"
                  borderWidth={1.5}
                />
              )}

              {/* Animated scene area */}
              <div className="h-40 border-b border-border/50 bg-muted/20">
                <feature.Scene />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-base font-semibold leading-snug">
                  {feature.title}
                </h3>
                <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
