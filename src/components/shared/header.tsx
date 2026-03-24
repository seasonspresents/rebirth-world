"use client";

import { useRef } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "@/components/shared/announcement-bar";

const NAV_ITEMS = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const prevScrollY = useRef(0);
  const { itemCount, setCartOpen } = useCart();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = prevScrollY.current;
    prevScrollY.current = current;

    setScrolled(current > 8);

    if (current < 50) {
      setHidden(false);
      return;
    }

    if (current - prev > 0 && current > 200) {
      setHidden(true);
    } else if (prev - current > 0) {
      setHidden(false);
    }
  });

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border/50" : "border-b border-transparent"
      )}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "backdrop-blur-[14px] transition-colors duration-300",
          scrolled ? "bg-background/92" : "bg-background/70"
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <Logo />

          {/* Desktop Navigation — Aceternity-style hover indicators */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {hoveredNav === item.label && (
                  <motion.span
                    layoutId="navHover"
                    className="absolute inset-0 rounded-md bg-muted/50"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.4,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}

            <div className="ml-3 flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="size-5" />
                <AnimatePresence mode="wait">
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <Badge className="absolute -top-1 -right-1 size-5 p-0 text-[10px]">
                        {itemCount}
                      </Badge>
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="sr-only">Cart</span>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </nav>

          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
