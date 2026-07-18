import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { PricingPreviewSection } from '@/components/site/sections/pricing-preview';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { DemoForm } from '@/components/site/demo-form';
import { getPricingPlans } from '@/lib/cms-content';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Skolaroid is offered through customised quotations based on institution size, modules and usage.',
  alternates: { canonical: 'https://skolaroid.com/pricing' },
};

const faqs = [
  { q: 'Is pricing fixed or customised?', a: 'Skolaroid is offered through customised quotations based on institution size, modules and usage. Request a demo to receive a tailored quote.' },
  { q: 'Are SMS and payment gateway charges included?', a: 'SMS, email, WhatsApp, storage, payment gateway and custom integrations may be billed based on actual usage where applicable.' },
  { q: 'Can we add modules later?', a: 'Yes. You can start with one plan and add modules as your institution grows.' },
  { q: 'Do you offer implementation support?', a: 'Yes. TakeWeb India provides implementation assistance, training, migration support and ongoing maintenance.' },
];

export default async function PricingPage() {
  const plans = await getPricingPlans();

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Plans that grow with your institution"
        description="Skolaroid is offered through customised quotations based on institution size, modules and usage. Request a demo for a tailored quote."
      />
      <PricingPreviewSection plans={plans} />

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-center">Get a custom quote</h2>
          <p className="mt-2 text-center text-muted-foreground">Tell us about your institution and we’ll prepare a tailored quote.</p>
          <div className="mt-10">
            <DemoForm sourcePage="/pricing" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-center">Pricing FAQs</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
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
