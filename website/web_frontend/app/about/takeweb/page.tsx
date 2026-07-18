import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { Reveal } from '@/components/site/reveal';
import { Code2, Cloud, Brain, Wrench, Headphones, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TakeWeb India',
  description: 'TakeWeb India is the technology company behind Skolaroid — product engineering, cloud, AI and support.',
  alternates: { canonical: 'https://skolaroid.com/about/takeweb' },
};

const capabilities = [
  { icon: Code2, title: 'Product engineering', description: 'Designing and building reliable software products end-to-end.' },
  { icon: Cloud, title: 'Cloud solutions', description: 'Secure, scalable cloud infrastructure for modern institutions.' },
  { icon: Brain, title: 'AI and automation', description: 'Intelligent automation that supports — not replaces — people.' },
  { icon: Wrench, title: 'Implementation', description: 'Hands-on setup, migration and customisation for every institution.' },
  { icon: Headphones, title: 'Support approach', description: 'Responsive, human support throughout the customer journey.' },
  { icon: Globe, title: 'India-first, global-ready', description: 'Built for Indian institutions, designed for global standards.' },
];

export default function AboutTakewebPage() {
  return (
    <>
      <PageHero
        eyebrow="About TakeWeb India"
        title="The technology company behind Skolaroid"
        description="TakeWeb India builds and maintains Skolaroid — with product engineering, cloud, AI and support capabilities."
      >
        <CtaButtons />
      </PageHero>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 80}>
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

      <FinalCtaSection />
    </>
  );
}
