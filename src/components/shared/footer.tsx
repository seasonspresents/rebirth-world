import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Rings", href: "/shop?collection=rings" },
    { label: "Necklaces", href: "/shop?collection=necklaces" },
    { label: "Bracelets", href: "/shop?collection=bracelets" },
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
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {/* Top: Logo + tagline + columns */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="shrink-0">
            <Logo />
            <p className="mt-3 max-w-[26ch] text-sm text-muted-foreground">
              Handcrafted jewelry from recycled metals and reclaimed materials.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="mb-3 text-sm font-semibold">{heading}</h3>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom separator + copyright */}
        <div className="mt-12 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Rebirth World. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
