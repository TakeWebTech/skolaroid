import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { Heart, Users, Rocket } from 'lucide-react';
import { getCareerSections } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join TakeWeb India — engineering, design, sales and customer success roles.',
  alternates: { canonical: 'https://skolaroid.com/careers' },
};

const culture = [
  { icon: Rocket, title: 'Build things that matter', description: 'We build software that helps institutions run better.' },
  { icon: Users, title: 'Collaborative team', description: 'Small, capable teams that trust each other.' },
  { icon: Heart, title: 'Care for customers', description: 'We support institutions throughout their journey.' },
];

export default async function CareersPage() {
  const sections = await getCareerSections();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Help us build the future of education technology"
        description="Join TakeWeb India and help institutions transform through Skolaroid."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {culture.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold font-display">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold font-display">Open roles</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Roles are managed in Strapi for website display. Applications should flow to ERPNext/Frappe HR.</p>
          <div className="mt-10 space-y-3">
            {sections.length > 0 ? sections.map((section) => (
              <div key={section.slug} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
                <div>
                  <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{section.team}</span>
                  <h3 className="mt-2 text-base font-semibold">{section.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{section.body}</p>
                </div>
                <a href="/contact" className="shrink-0 text-sm font-semibold text-primary">Apply</a>
              </div>
            )) : (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <h3 className="text-lg font-semibold font-display">No open roles published yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Create Career Content Section entries in Strapi to publish roles.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
