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
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/cart">
          <ShoppingBag className="size-5" />
          <span className="sr-only">Cart</span>
        </Link>
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
            <div className="mt-auto flex justify-center">
              <ThemeToggle />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
