"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "@/components/shared/announcement-bar";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border"
          : "border-b border-transparent"
      )}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "backdrop-blur-[14px] transition-colors duration-300",
          scrolled ? "bg-background/92 text-foreground" : "bg-background/70 text-foreground"
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Shop
          </Link>
          <Link
            href="/our-story"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Our Story
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
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
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
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
        </nav>

        {/* Mobile Menu */}
        <MobileNav />
        </div>
      </div>
    </header>
  );
}
