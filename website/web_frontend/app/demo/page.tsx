import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { DemoForm } from '@/components/site/demo-form';
import { ShieldCheck, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Demo',
  description:
    'See Skolaroid in action. Book a personalised demo for your school, college or institution.',
  alternates: { canonical: 'https://skolaroid.com/demo' },
};

const perks = [
  { icon: Clock, label: '30-minute personalised walkthrough' },
  { icon: Users, label: 'Tailored to your institution size' },
  { icon: ShieldCheck, label: 'No obligation, no commitment' },
];

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Demo"
        title="See Skolaroid in action"
        description="Book a personalised walkthrough tailored to your institution. Our team will reach out within one business day."
      >
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {perks.map((p) => (
            <span key={p.label} className="flex items-center gap-2">
              <p.icon className="h-4 w-4 text-primary" />
              {p.label}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <DemoForm sourcePage="/demo" />
        </div>
      </section>
    </>
  );
}
