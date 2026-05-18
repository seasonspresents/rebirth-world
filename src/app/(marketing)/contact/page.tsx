import { ContactForm } from "@/components/marketing/contact-form";
import { FAQ } from "@/components/marketing/faq";
import { FAQPageJsonLd } from "@/components/seo/json-ld";
import { CONTACT_FAQ_ITEMS } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a question about our jewelry, sizing, or custom orders? Get in touch with the Rebirth World team.",
  openGraph: {
    title: "Contact | Rebirth World",
    description:
      "Have a question about our jewelry, sizing, or custom orders? Get in touch with the Rebirth World team.",
    url: "https://rebirth.world/contact",
    siteName: "Rebirth World",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Rebirth World",
    description:
      "Have a question about our jewelry, sizing, or custom orders? Get in touch with the Rebirth World team.",
  },
};

export default function ContactPage() {
  return (
    <div>
      <FAQPageJsonLd
        questions={CONTACT_FAQ_ITEMS.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
      />
      <ContactForm />
      <FAQ />
    </div>
  );
}
