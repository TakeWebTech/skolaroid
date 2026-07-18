'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { Search, Settings, GraduationCap, Users, LifeBuoy } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Discovery & requirement analysis', description: 'We understand your institution, workflows, current systems and goals before anything is configured.' },
  { icon: Settings, title: 'School data & workflow configuration', description: 'Your fee structures, classes, subjects, roles and academic calendar are set up in Skolaroid.' },
  { icon: GraduationCap, title: 'Platform setup & customisation', description: 'We tailor modules, templates and permissions to match how your school actually works.' },
  { icon: Users, title: 'Training & onboarding', description: 'Administrators, teachers and parents are trained through structured onboarding sessions.' },
  { icon: LifeBuoy, title: 'Launch & continuous support', description: 'Go live with confidence, backed by ongoing maintenance and a responsive support team.' },
];

export function ImplementationSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Implementation journey"
          title="From first conversation to a live school — in five steps"
          description="TakeWeb India provides implementation assistance, training, migration support and ongoing maintenance."
        />

        <div className="mt-16 relative">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-primary via-secondary to-accent lg:block" />

          <div className="grid gap-8 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs font-bold text-primary border border-primary/30">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-base font-semibold font-display">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
