'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { AnimatedCounter } from '@/components/site/animated-counter';

const stats = [
  { value: 50, suffix: '+', label: 'Institutions supported', placeholder: true },
  { value: 25000, suffix: '+', label: 'Students connected', placeholder: true },
  { value: 10000, suffix: '+', label: 'Administrative hours saved', placeholder: true },
  { value: 40, suffix: '%', label: 'Improvement in fee follow-up', placeholder: true },
  { value: 60, suffix: '%', label: 'Faster report preparation', placeholder: true },
  { value: 21, suffix: '', label: 'Platform modules', placeholder: false },
];

export function StatsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Impact statistics"
          title="Built to make a measurable difference"
          description="Placeholder figures shown below will be replaced with verified values from real institutions."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={(i % 3) * 80}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <p className="text-4xl font-bold font-display text-gradient sm:text-5xl">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">{s.label}</p>
                {s.placeholder && (
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/60">
                    Placeholder
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
