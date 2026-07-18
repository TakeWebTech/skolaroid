'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { modules as fallbackModules, type ModuleDef } from '@/lib/site-data';
import { cn } from '@/lib/utils';

type ModuleCard = Omit<ModuleDef, 'icon'> & { icon?: ModuleDef['icon'] };

export function ModulesSection({ modules = fallbackModules }: { modules?: ModuleCard[] }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core product modules"
          title="Everything your institution needs. Connected in one place."
          description="Twenty-one modules covering school administration, academics, learning, operations and platform management."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((m, i) => (
            (() => {
              const Icon = m.icon ?? fallbackModules.find((item) => item.id === m.id)?.icon ?? fallbackModules[0].icon;
              return (
            <Reveal key={m.id} delay={(i % 4) * 80}>
              <Link
                href={`/modules/${m.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: m.accent }}
                />
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${m.accent}1a`, color: m.accent }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold font-display">{m.short}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {m.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Explore module
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </Reveal>
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
}
