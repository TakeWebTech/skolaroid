import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { modules, moduleMap } from '@/lib/site-data';
import { getProductModule } from '@/lib/cms-content';
import { siteUrl } from '@/lib/seo';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = moduleMap[params.slug];
  if (!m) return { title: 'Module not found' };
  return {
    title: m.name,
    description: m.tagline,
    alternates: { canonical: siteUrl(`/modules/${m.id}`) },
  };
}

export default async function ModulePage({ params }: { params: { slug: string } }) {
  const m = await getProductModule(params.slug) ?? moduleMap[params.slug];
  if (!m) notFound();

  return (
    <>
      <PageHero
        eyebrow="Module"
        title={m.name}
        description={m.tagline}
      >
        <CtaButtons />
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold font-display">Overview</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{m.description}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Problems solved</h3>
              <ul className="mt-4 space-y-2.5">
                {m.problems.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold font-display">Features</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {m.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display">Benefits</h2>
              <ul className="mt-4 space-y-2.5">
                {m.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Role-specific value</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.roles.map((r) => (
                  <span key={r} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">{r}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Integration possibilities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.integrations.map((i) => (
                  <span key={i} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">{i}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold font-display">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-6">
              {m.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-6">
            <div>
              <p className="text-sm font-semibold">Explore other modules</p>
              <p className="text-xs text-muted-foreground">Every module connects to the rest of the platform.</p>
            </div>
            <Link href="/modules" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              All modules <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
