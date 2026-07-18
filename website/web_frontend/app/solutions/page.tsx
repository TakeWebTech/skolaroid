import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { roleSolutions } from '@/lib/site-data';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Skolaroid is built for every person in your institution — from owners to parents.',
  alternates: { canonical: 'https://skolaroid.com/solutions' },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Built for every person in your institution"
        description="From school owners to parents, each stakeholder gets the tools and information that matter to them."
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roleSolutions.map((r) => (
              <Link
                key={r.id}
                href={`/solutions/${r.id}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <r.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold font-display">{r.role}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  View solution <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalCtaSection />
    </>
  );
}
