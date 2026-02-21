import { Metadata } from "next";
import { OurStoryContent } from "./our-story-content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How broken skateboards become handcrafted rings — the story of Daniel Malzl, Austrian jeweler heritage, and the North Shore community that fuels Rebirth World.",
  openGraph: {
    title: "Our Story | Rebirth World",
    description:
      "How broken skateboards become handcrafted rings — the story of Daniel Malzl and Rebirth World.",
    url: "https://rebirth.world/our-story",
    siteName: "Rebirth World",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | Rebirth World",
    description:
      "How broken skateboards become handcrafted rings — the story of Daniel Malzl and Rebirth World.",
  },
};

export default function OurStoryPage() {
  return <OurStoryContent />;
}
