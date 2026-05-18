export const SITE_URL = "https://rebirth.world";
export const SITE_NAME = "Rebirth World";
export const SITE_DESCRIPTION =
  "Handcrafted rings and apparel born from broken skateboards. Made in Mapleton, Utah. Embrace Change.";
export const DEFAULT_OG_IMAGE = "/og/default.jpg";

export function toAbsoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith("/")) {
    return `${SITE_URL}${pathOrUrl}`;
  }

  return `${SITE_URL}/${pathOrUrl}`;
}

export const HOMEPAGE_FAQ_ITEMS = [
  {
    q: "What makes your rings different from other wood rings?",
    a: "These rings are made from recycled materials — broken skateboards donated by the local skate community. Boards that would’ve ended up in a landfill get a second life on your finger. I finish every ring with CA glue so the wood is long-lasting and durable enough for daily wear. You can tell they were handmade with love — because they were. Every single ring is one of a kind because no two broken boards are ever the same. The colors, the layers, the wear patterns — that’s all real history from real sessions. And my father is an Austrian master jeweler, so the craft runs deep in my family.",
  },
  {
    q: "Are the rings durable enough for daily wear?",
    a: "Yes. I use stabilized wood — vacuum-infused with resin for hardness and moisture resistance — and finish the interior with CA glue for a protective seal. Hundreds of customers wear these daily, including surfers and skaters.",
  },
  {
    q: "How long does it take to make my ring?",
    a: "Every ring is handmade to order — allow 5–10 business days before it ships. US orders arrive 2–4 days after shipping. Need it sooner? DM me on Instagram and I’ll do everything I can.",
  },
  {
    q: "What are the apparel collections? How do drops work?",
    a: "Each apparel collection is a one-of-a-kind seasonal drop tied to a theme I’m currently resonating with — designed in collaboration with local artists. When it’s gone, it doesn’t come back. These aren’t basics. They’re wearable messages for whatever chapter you’re in.",
  },
  {
    q: "Can I get custom engraving?",
    a: "Yes — add laser engraving to any ring at checkout for $9. Up to 10 characters inside the band. Dates, initials, coordinates, a word that means something. Custom/engraved rings are final sale.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship worldwide. I’ve shipped to 25+ countries. International orders take 10–15 business days. Rates calculated at checkout.",
  },
];

export const CONTACT_FAQ_ITEMS = [
  {
    question: "What are the rings made from?",
    answer:
      "Our skateboard rings are made from recycled 7-ply Canadian maple — the same wood used in pro decks. Local skaters on the North Shore donate their broken boards, and Daniel shapes each ring by hand. Our wedding bands feature gold-plated steel shells lined with stabilized ancient wood like bog oak or Hawaiian koa.",
  },
  {
    question: "How do I find my ring size?",
    answer:
      "Check the sizing guide on each product page for tips on measuring at home with string or paper. You can also visit any local jeweler for a free sizing. Keep in mind our wood-lined wedding bands run about one size smaller due to the interior liner (a size 9 shell with a 0.8mm wood liner wears like a size 7). When in doubt, size up.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5–10 business days within the US. Express shipping (2–5 business days) is available at checkout. International orders typically arrive in 10–15 business days. Every order includes tracking from our North Shore workshop to your door.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return window for unworn items in original packaging. Engraved or custom pieces are final sale. If your ring doesn't fit, reach out through the contact page and we'll work with you to make it right.",
  },
  {
    question: "How do I care for my ring?",
    answer:
      "The interior of each ring is sealed with a thin CA glue finish for durability — not polyurethane. Avoid prolonged water exposure and store in the included pouch when you're not wearing it. A soft cloth is all you need for polishing. With basic care, your ring will last for years.",
  },
  {
    question: "Do you offer engraving?",
    answer:
      "Yes — most rings can be laser engraved with up to 10 characters of text or a small graphic. You can add engraving during checkout for $9. It adds 2–3 business days to production time. Engraved pieces are final sale.",
  },
  {
    question: "Do you make wedding bands?",
    answer:
      "Yes. Our premium wedding bands feature gold-plated steel shells lined with stabilized ancient wood — including bog oak and Hawaiian koa. These start at $75 and go up depending on materials and customization. They're built to be worn every day for a lifetime.",
  },
];
