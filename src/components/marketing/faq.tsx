import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      className="border-t border-border bg-[#f2ede5] px-6 py-24 dark:bg-muted/30"
    >
      <div className="mx-auto max-w-[720px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Common questions
          </p>
          <h2 className="text-[clamp(1.8rem,4vw,2.4rem)] leading-[1.15] tracking-tight font-[family-name:var(--font-display)]">
            Everything you need to know
          </h2>
        </div>

        {/* FAQ Accordion */}
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
              <AccordionTrigger className="py-5 text-left text-[0.95rem] font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
