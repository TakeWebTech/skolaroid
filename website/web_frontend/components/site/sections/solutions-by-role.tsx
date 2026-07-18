'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { roleSolutions } from '@/lib/site-data';
import { DashboardMockup, type DashboardVariant } from '@/components/site/dashboard-mockup';
import { cn } from '@/lib/utils';

const variantMap: Record<string, DashboardVariant> = {
  owners: 'multi-school',
  principals: 'overview',
  administrators: 'admissions',
  teachers: 'lms',
  parents: 'communication',
  students: 'lms',
  accountants: 'fees',
  hr: 'overview',
};

export function SolutionsByRoleSection() {
  const [active, setActive] = useState(0);
  const current = roleSolutions[active];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Solutions by role"
          title="Built for every person in your institution"
          description="Each stakeholder gets the tools and information that matter to them."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {roleSolutions.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setActive(i)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                active === i
                  ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                  : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground'
              )}
            >
              {r.role}
            </button>
          ))}
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          <Reveal key={current.id}>
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <current.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-2xl font-bold font-display">{current.role}</h3>
              <p className="mt-2 text-base text-muted-foreground">{current.summary}</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {current.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal key={`dash-${current.id}`} delay={120}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-primary/15 to-secondary/15 blur-2xl" />
              <div className="relative">
                <DashboardMockup variant={variantMap[current.id] ?? 'overview'} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
