"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { House, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

const navItems = [
  { label: "Home", href: "/", icon: House },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Cart", href: null, icon: ShoppingCart },
  { label: "Account", href: "/sign-in", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount, setCartOpen } = useCart();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 10) {
      setVisible(true);
    } else if (currentScrollY > lastScrollY.current) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isActive = (href: string | null) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 text-foreground backdrop-blur-md md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex h-16 items-center justify-around">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              if (item.label === "Cart") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="flex flex-col items-center gap-0.5 text-muted-foreground transition-colors"
                  >
                    <span className="relative">
                      <Icon className="size-5" />
                      {itemCount > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white">
                          {itemCount > 99 ? "99+" : itemCount}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`flex flex-col items-center gap-0.5 transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
