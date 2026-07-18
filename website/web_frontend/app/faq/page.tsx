import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { getFaqItems } from '@/lib/cms-content';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Skolaroid — product, implementation, pricing, security and more.',
  alternates: { canonical: 'https://skolaroid.com/faq' },
};

export default async function FaqPage() {
  const faqItems = await getFaqItems();
  const categories = ['All', ...Array.from(new Set(faqItems.map((f) => f.category)))];

  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Frequently asked questions"
        description="Answers to common questions about Skolaroid. Can’t find what you’re looking for? Contact us."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <span key={c} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${i === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}>{c}</span>
            ))}
          </div>

          <Accordion type="single" collapsible>
            {faqItems.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
