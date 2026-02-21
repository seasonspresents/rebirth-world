import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Skateboard Rings", href: "/shop?collection=skateboard-rings" },
    { label: "Wedding Bands", href: "/shop?collection=wedding-bands" },
    { label: "Apparel", href: "/shop?collection=apparel" },
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
    <footer className="bg-grain w-full border-t bg-background">
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        {/* Top: Logo + tagline + columns */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="shrink-0">
            <Logo />
            <p className="mt-3 max-w-[28ch] text-base text-muted-foreground">
              Handcrafted from recycled skateboards.
              <br />
              Born on the North Shore.
            </p>
            <p className="mt-2 text-sm font-[family-name:var(--font-dm-mono)] tracking-wide text-muted-foreground/70">
              Embrace Change
            </p>
            <a
              href="https://instagram.com/rebirthrings"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram className="size-5" />
              <span>@rebirthrings</span>
            </a>
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
        <div className="mt-16 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rebirth World LLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
