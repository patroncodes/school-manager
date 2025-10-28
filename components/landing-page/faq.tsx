import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can parents have multiple wards?",
    answer:
      "Yes. A single parent account can be linked to multiple students. Each parent has a unified dashboard showing all their children with per-ward access control.",
  },
  {
    question: "Can I disable a user without deleting them?",
    answer:
      "Yes. School Manager uses Clerk's banUser/unbanUser functionality for soft deactivation. This preserves all historical data while preventing login access.",
  },
  {
    question: "How are grades created and managed?",
    answer:
      "During onboarding, administrators select grade names from a predefined list or create custom grades. The backend links them to programId using Prisma transactions to ensure atomicity and referential integrity.",
  },
  {
    question: "What happens if onboarding fails midway?",
    answer:
      "All database operations use Prisma transactions. If any step fails, the entire operation rolls back automatically, ensuring no partial or orphaned data.",
  },
  {
    question: "Can I customize the onboarding flow?",
    answer:
      "Yes. The onboarding wizard is built with React Hook Form and can be extended with custom steps. Contact our team for enterprise customization options.",
  },
  {
    question: "Is there an API for integrations?",
    answer:
      "Yes. School Manager provides a GraphQL API built with Pothos. Full API documentation and authentication guides are available in the developer portal.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">
            Everything you need to know about School Manager
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border bg-background px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
