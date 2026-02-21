"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FeatureTab {
  id: string;
  title: string;
  description: string;
  image: string;
}

const featureTabs: FeatureTab[] = [
  {
    id: "ask",
    title: "Ask Your AI Agent Directly",
    description:
      "Speak or type your command—let SkyAgent capture your intent. Your request instantly sets the process in motion.",
    image:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1974",
  },
  {
    id: "process",
    title: "Let SkyAgent Process It",
    description:
      "Our advanced AI analyzes and understands your needs, preparing the optimal solution.",
    image:
      "https://images.unsplash.com/photo-1614727187346-ec3a009092b0?auto=format&fit=crop&q=80&w=2078",
  },
  {
    id: "results",
    title: "Receive Instant, Actionable Results",
    description:
      "Get immediate, precise outcomes tailored to your request—no waiting, no hassle.",
    image:
      "https://images.unsplash.com/photo-1447433727702-519621625f05?auto=format&fit=crop&q=80&w=1480",
  },
  {
    id: "improvement",
    title: "Continuous Improvement",
    description:
      "We are constantly updating and improving our features to provide the best experience.",
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=2508",
  },
];

interface FeaturesAccordionProps {
  autoPlayInterval?: number;
}

export function FeaturesAccordion({
  autoPlayInterval = 5000,
}: FeaturesAccordionProps) {
  const [activeTab, setActiveTab] = useState(featureTabs[0]?.id || "");
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mobileScrollRef = useRef<HTMLUListElement>(null);

  const activeTabData = featureTabs.find((tab) => tab.id === activeTab);

  // Auto-advance logic
  useEffect(() => {
    if (isPaused || featureTabs.length === 0) return;

    // Auto advance to next tab
    timerRef.current = setTimeout(() => {
      const currentIndex = featureTabs.findIndex((tab) => tab.id === activeTab);
      const nextIndex = (currentIndex + 1) % featureTabs.length;
      setActiveTab(featureTabs[nextIndex].id);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTab, isPaused, autoPlayInterval]);

  // Scroll active tab to center on mobile (horizontal only, no page scroll)
  useEffect(() => {
    if (!mobileScrollRef.current) return;

    const activeIndex = featureTabs.findIndex((tab) => tab.id === activeTab);
    if (activeIndex === -1) return;

    const scrollContainer = mobileScrollRef.current;
    const activeElement = scrollContainer.children[activeIndex] as HTMLElement;

    if (activeElement) {
      // Calculate horizontal scroll position without affecting page scroll
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const scrollLeft =
        scrollContainer.scrollLeft +
        elementRect.left -
        containerRect.left -
        containerRect.width / 2 +
        elementRect.width / 2;

      scrollContainer.scrollLeft = scrollLeft;
    }
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsPaused(true);
    // Resume auto-play after a delay
    setTimeout(() => setIsPaused(false), autoPlayInterval);
  };

  return (
    <section id="how-it-works" className="border-b px-6">
      <div className="mx-auto w-full border-x">
        {/* Header Section */}
        <div className="border-b px-6 py-10 text-center md:py-14">
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-2">
            <h2 className="text-center text-3xl font-medium tracking-tighter text-balance md:text-4xl">
              Simple. Seamless. Smart.
            </h2>
            <p className="text-muted-foreground text-center font-medium text-balance">
              Discover how SkyAgent transforms your commands into action in four
              easy steps
            </p>
          </div>
        </div>
        <div className="flex h-full w-full items-center justify-center lg:h-[450px]">
          <div className="w-full">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
              <div className="mt-6 grid h-full w-full grid-cols-5 items-center gap-x-10 px-10 md:px-20">
                {/* Desktop Accordion - Left Side */}
                <div className="col-span-2 hidden h-full w-full justify-start md:items-center lg:flex">
                  <div className="flex w-full flex-col gap-8">
                    {featureTabs.map((tab) => {
                      const isActive = tab.id === activeTab;
                      return (
                        <motion.div
                          key={tab.id}
                          data-state={isActive ? "open" : "closed"}
                          initial={false}
                          animate={{
                            scale: isActive ? 1 : 0.98,
                            opacity: isActive ? 1 : 0.7,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className={cn(
                            "relative mt-px overflow-hidden focus-within:relative focus-within:z-10",
                            "rounded-lg",
                            "data-[state=closed]:rounded-none data-[state=closed]:border-0",
                            isActive && "bg-card",
                            isActive &&
                              "dark:shadow-[0px_0px_0px_1px_rgba(249,250,251,0.06),0px_0px_0px_1px_var(--color-zinc-800,#27272A),0px_1px_2px_-0.5px_rgba(0,0,0,0.24),0px_2px_4px_-1px_rgba(0,0,0,0.24)]",
                            isActive &&
                              "shadow-[0px_0px_1px_0px_rgba(0,0,0,0.16),0px_1px_2px_-0.5px_rgba(0,0,0,0.16)]"
                          )}
                        >
                          {/* Progress Bar */}
                          <div
                            className={cn(
                              "absolute overflow-hidden rounded-lg transition-opacity duration-300",
                              "bg-border/50",
                              "right-0 bottom-0 left-0 h-0.5 w-full",
                              isActive ? "opacity-100" : "opacity-0"
                            )}
                            data-state={isActive ? "open" : "closed"}
                          >
                            <div
                              className="bg-primary absolute top-0 left-0 h-full transition-all ease-linear"
                              style={{
                                width: isActive ? "100%" : "0%",
                                transitionDuration: isActive
                                  ? `${autoPlayInterval}ms`
                                  : "0s",
                              }}
                            />
                          </div>

                          {/* Tab Button */}
                          <h3 className="flex">
                            <button
                              type="button"
                              onClick={() => handleTabClick(tab.id)}
                              aria-expanded={isActive}
                              data-state={isActive ? "open" : "closed"}
                              className="group flex h-[45px] flex-1 cursor-pointer items-center justify-between p-3 text-left text-lg font-semibold tracking-tight outline-none"
                            >
                              {tab.title}
                            </button>
                          </h3>

                          {/* Content */}
                          <AnimatePresence mode="wait">
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.25, 0.1, 0.25, 1],
                                }}
                                data-state="open"
                                className="overflow-hidden text-sm font-medium"
                              >
                                <div className="p-3">{tab.description}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Image - Right Side */}
                <div className="col-span-5 h-[350px] min-h-[200px] w-auto lg:col-span-3">
                  <div className="relative h-full w-full overflow-hidden">
                    {/* Placeholder background */}
                    <div className="bg-muted absolute inset-0 rounded-xl border opacity-0 transition-all duration-150" />

                    {/* Active image with animation */}
                    <AnimatePresence mode="wait">
                      {activeTabData && (
                        <motion.div
                          key={activeTabData.id}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="h-full w-full"
                        >
                          <Image
                            alt={activeTabData.title}
                            className="aspect-auto h-full w-full rounded-xl border object-cover p-1"
                            loading="eager"
                            width={800}
                            height={600}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            src={activeTabData.image}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile Horizontal Scroll */}
                <ul
                  ref={mobileScrollRef}
                  className={cn(
                    "col-span-5 flex snap-x flex-nowrap overflow-x-auto",
                    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    "[-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)]",
                    "mask-[linear-gradient(90deg,transparent,black_10%,white_90%,transparent)]",
                    "snap-mandatory lg:hidden"
                  )}
                  style={{ padding: "50px calc(50%)" }}
                >
                  {featureTabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                      <a
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={cn(
                          "card relative grid h-full max-w-64 shrink-0 items-start justify-center p-3",
                          "bg-background border-t border-b border-l last:border-r",
                          "first:rounded-tl-xl last:rounded-tr-xl"
                        )}
                        style={{ scrollSnapAlign: "center" }}
                      >
                        {/* Progress Bar */}
                        <div
                          className={cn(
                            "absolute overflow-hidden rounded-lg transition-opacity duration-300",
                            "bg-border/50",
                            "right-0 bottom-0 left-0 h-0.5 w-full",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                          data-state={isActive ? "open" : "closed"}
                        >
                          <div
                            className="bg-primary absolute top-0 left-0 h-full transition-all ease-linear"
                            style={{
                              width: isActive ? "100%" : "0%",
                              transitionDuration: isActive
                                ? `${autoPlayInterval}ms`
                                : "0s",
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <h2 className="text-lg font-bold">{tab.title}</h2>
                          <p className="mx-0 max-w-sm text-sm leading-relaxed font-medium text-balance">
                            {tab.description}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
