'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { Quote, Star } from 'lucide-react';
import type { TestimonialCard } from '@/lib/cms-content';

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialCard[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials and case studies"
          title="What institutions say about Skolaroid"
          description="Verified stories from institutions using Skolaroid."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
                <Quote className="h-8 w-8 text-primary/30" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                  “{t.quote}”
                </blockquote>
                <div className="mt-4 flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-bold">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.org}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
