import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { getCaseStudies } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'How institutions use Skolaroid to transform administration, academics and communication.',
  alternates: { canonical: 'https://skolaroid.com/case-studies' },
};

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="How institutions transform with Skolaroid"
        description="Verified implementation stories from institutions using Skolaroid."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {studies.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {studies.map((s, i) => (
                <Reveal key={s.slug} delay={i * 100}>
                  <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 font-semibold text-primary">{s.institutionType}</span>
                      <span className="text-muted-foreground">{s.region}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold font-display">{s.title}</h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Challenge</p><p className="mt-1 text-foreground/80">{s.challenge}</p></div>
                      <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solution</p><p className="mt-1 text-foreground/80">{s.solution}</p></div>
                      <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Results</p><p className="mt-1 text-foreground/80">{s.results}</p></div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold font-display">No case studies published yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Publish Customer and Case Study entries in Strapi when verified stories are ready.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
