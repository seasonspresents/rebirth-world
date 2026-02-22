import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TextReveal } from "@/components/ui/text-reveal";

const faqItems = [
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

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-earth bg-grain px-6 py-24 md:py-36"
    >
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          {/* Left column — header */}
          <div className="md:sticky md:top-24 md:self-start">
            <TextReveal as="h2" className="text-fluid-display" type="words">
              Everything you need to know
            </TextReveal>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Questions about sizing, materials, shipping, or care — we&apos;ve
              got you covered.
            </p>
          </div>

          {/* Right column — accordion */}
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full"
          >
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-x-0 px-0"
              >
                <AccordionTrigger className="py-6 text-left text-base font-semibold hover:no-underline md:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] pb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
