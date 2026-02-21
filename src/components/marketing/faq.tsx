import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I find my ring size?",
    answer:
      "We include a printable ring sizer with every order, or you can visit any local jeweler for a free sizing. Our sizing guide on each product page also has tips for measuring at home with string or paper. If you're between sizes, we recommend sizing up.",
  },
  {
    question: "What materials do you use?",
    answer:
      "We use recycled sterling silver, reclaimed copper, salvaged steel, and ethically sourced natural materials like bog oak, whiskey barrel wood, and antler. Every piece lists its exact materials on the product page. We never use conflict minerals or newly mined precious metals.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-10 business days within the US. Express shipping (2-5 business days) is available at checkout. International orders typically arrive in 10-15 business days. Every order includes tracking so you can follow your piece from our workshop to your door.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return window for unworn items in original packaging. Engraved or custom pieces are final sale. If your ring doesn't fit, we'll resize it once for free within the first year. Just reach out to us through the contact page.",
  },
  {
    question: "How do I care for my jewelry?",
    answer:
      "Each piece ships with a care card specific to its materials. Generally: avoid prolonged water exposure, store in the included pouch, and use a soft cloth for polishing. Wood and mixed-material pieces benefit from occasional light oiling. Our blog has detailed care guides for each material.",
  },
  {
    question: "Do you offer engraving?",
    answer:
      "Yes — most rings and select necklaces can be engraved with up to 10 characters. You can choose text or a small graphic (heart, infinity symbol, etc.) during checkout. Engraving adds 2-3 business days to production time. Engraved pieces are final sale.",
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
