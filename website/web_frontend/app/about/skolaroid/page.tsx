import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { Reveal } from '@/components/site/reveal';
import { Target, Eye, Compass, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Skolaroid',
  description: 'Skolaroid is the intelligent operating system for modern schools — built in India by TakeWeb India.',
  alternates: { canonical: 'https://skolaroid.com/about/skolaroid' },
};

const values = [
  { icon: Target, title: 'Vision', description: 'A connected digital ecosystem for every educational institution — from admission to alumni.' },
  { icon: Eye, title: 'Mission', description: 'To reduce manual work, improve visibility and strengthen communication across every stakeholder in a school.' },
  { icon: Compass, title: 'Philosophy', description: 'Built for schools. Powered by intelligence. Supported by TakeWeb India.' },
  { icon: Heart, title: 'India-first, global standards', description: 'Designed for Indian schools first, with the quality expected by institutions everywhere.' },
];

const timeline = [
  { year: 'Foundation', title: 'The idea', description: 'TakeWeb India set out to build one platform for the entire school ecosystem.' },
  { year: 'Build', title: 'Engineering the platform', description: 'Modules were designed around real school workflows — admissions to analytics.' },
  { year: 'Today', title: 'A connected product', description: 'Skolaroid brings administration, academics, finance, communication and learning together.' },
  { year: 'Next', title: 'Intelligence and scale', description: 'AI capabilities and multi-school management are on the roadmap.' },
];

export default function AboutSkolaroidPage() {
  return (
    <>
      <PageHero
        eyebrow="About Skolaroid"
        title="The intelligent operating system for modern schools"
        description="Skolaroid is a product of TakeWeb India — built to connect administration, academics, finance, communication and learning in one secure platform."
      >
        <CtaButtons />
      </PageHero>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 80}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold font-display">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-center">Our journey</h2>
          <div className="mt-12 space-y-8">
            {timeline.map((t, i) => (
              <Reveal key={t.title} delay={i * 100}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">{i + 1}</span>
                    {i < timeline.length - 1 && <div className="mt-2 h-full w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.year}</p>
                    <h3 className="mt-1 text-lg font-semibold font-display">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
