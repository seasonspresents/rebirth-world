"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Skateboard Rings", href: "/shop?collection=skateboard-rings" },
    { label: "Wedding Bands", href: "/shop?collection=wedding-bands" },
    { label: "Apparel", href: "/shop?collection=apparel" },
    { label: "Saved Items", href: "/wishlist" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  Company: [
    { label: "Our Story", href: "/our-story" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms-of-service" },
    { label: "Cookies", href: "/cookie-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-grain bg-background text-foreground w-full border-t">
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Logo />
            <p className="text-muted-foreground mt-3 max-w-[28ch] text-base">
              Handcrafted from recycled skateboards.
              <br />
              Made in Mapleton, Utah.
            </p>
            <p className="text-muted-foreground/70 mt-2 font-[family-name:var(--font-dm-mono)] text-sm tracking-wide">
              Embrace Change
            </p>
            <motion.a
              href="https://instagram.com/rebirthrings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground mt-5 inline-flex items-center gap-2 text-base transition-colors"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Instagram className="size-5" />
              <span>@rebirthrings</span>
            </motion.a>
          </motion.div>

          {/* Link columns with staggered reveal */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16">
            {Object.entries(footerLinks).map(([heading, links], colIdx) => (
              <motion.div
                key={heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: colIdx * 0.1 }}
              >
                <h3 className="mb-3 text-sm font-semibold">{heading}</h3>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group text-muted-foreground hover:text-foreground relative inline-block text-sm transition-colors"
                      >
                        <span>{link.label}</span>
                        <span className="bg-primary absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 border-t pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Rebirth World LLC. All rights
            reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
