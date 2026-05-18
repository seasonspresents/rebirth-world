"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { House, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

const navItems = [
  { label: "Home", href: "/", icon: House },
  {
    label: "Search",
    href: "/shop#products",
    icon: Search,
    isActive: (pathname: string) => pathname === "/shop",
  },
  { label: "Cart", href: null, icon: ShoppingCart },
  {
    label: "Account",
    href: "/sign-in",
    icon: User,
    isActive: (pathname: string) =>
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/dashboard"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return <BottomNavInner key={pathname} pathname={pathname} />;
}

function BottomNavInner({ pathname }: { pathname: string }) {
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

  const isActive = (item: (typeof navItems)[number]) => {
    if ("isActive" in item) return item.isActive(pathname);
    const href = item.href;
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
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 text-foreground shadow-[0_-8px_24px_rgba(28,25,23,0.08)] backdrop-blur-md md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex h-16 items-center justify-around">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              if (item.label === "Cart") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
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
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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
