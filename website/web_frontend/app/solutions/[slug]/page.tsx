import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { roleSolutions } from '@/lib/site-data';
import { siteUrl } from '@/lib/seo';
import { Check } from 'lucide-react';

const roleMap = Object.fromEntries(roleSolutions.map((r) => [r.id, r]));

export function generateStaticParams() {
  return roleSolutions.map((r) => ({ slug: r.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = roleMap[params.slug];
  if (!r) return { title: 'Solution not found' };
  return {
    title: `For ${r.role}`,
    description: r.summary,
    alternates: { canonical: siteUrl(`/solutions/${r.id}`) },
  };
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const r = roleMap[params.slug];
  if (!r) notFound();

  return (
    <>
      <PageHero
        eyebrow="Solution"
        title={`For ${r.role}`}
        description={r.summary}
      >
        <CtaButtons />
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-bold font-display">What you get</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {r.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
