'use client';

import Link from 'next/link';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { pricingPlans as fallbackPricingPlans, type PricingPlan } from '@/lib/site-data';
import { cn } from '@/lib/utils';

export function PricingPreviewSection({ plans = fallbackPricingPlans }: { plans?: PricingPlan[] }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans that grow with your institution"
          description="Skolaroid is offered through customised quotations based on institution size, modules and usage. Request a demo for a tailored quote."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-3xl border bg-card p-7 transition-all duration-300',
                  plan.highlight
                    ? 'border-primary shadow-glow lg:-translate-y-3'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white shadow-glow">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold font-display">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                  {plan.audience}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8"
                  variant={plan.highlight ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/demo">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            SMS, email, WhatsApp, storage, payment gateway and custom integrations may be billed based on actual usage where applicable.
          </p>
          <Button variant="outline" asChild>
            <Link href="/pricing">Compare Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
