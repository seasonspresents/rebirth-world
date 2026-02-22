"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCart } from "@/components/cart/cart-context";
import { useLenisPause } from "@/hooks/use-lenis-pause";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { itemCount, setCartOpen } = useCart();

  useLenisPause(open);

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingBag className="size-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 size-5 p-0 text-[10px]">
            {itemCount}
          </Badge>
        )}
        <span className="sr-only">Cart</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex w-full flex-col px-6 pt-20 pb-6 sm:w-full"
          closeIconSize="size-8"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation links
          </SheetDescription>
          <nav className="flex flex-1 flex-col gap-4">
            <Link
              href="/shop"
              className="block rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/our-story"
              className="block rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Our Story
            </Link>
            <Link
              href="/blog"
              className="block rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/sign-in"
              className="block rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Button asChild className="mt-4 w-full" size="lg">
              <Link href="/shop" onClick={() => setOpen(false)}>
                Browse collection
              </Link>
            </Button>
            <div className="mt-auto flex flex-col items-center gap-4">
              <ThemeToggle />
              <p className="text-xs font-[family-name:var(--font-dm-mono)] tracking-wide text-muted-foreground/60">
                Embrace Change
              </p>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
