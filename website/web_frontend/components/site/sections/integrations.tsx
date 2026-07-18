'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { type IntegrationDef } from '@/lib/site-data';
import { GraduationCap, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusStyles: Record<IntegrationDef['status'], string> = {
  available: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600',
  planned: 'border-amber-500/30 bg-amber-500/10 text-amber-600',
  custom: 'border-primary/30 bg-primary/10 text-primary',
};
const statusLabel: Record<IntegrationDef['status'], string> = {
  available: 'Integration available',
  planned: 'Planned',
  custom: 'Custom integration',
};

export function IntegrationsSection({ integrations }: { integrations: IntegrationDef[] }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Integrations"
          title="Connect the tools your institution already uses"
          description="Skolaroid integrates with payment gateways, communication providers, hardware and productivity platforms."
        />

        {/* Orbit visual */}
        <Reveal className="mt-16">
          <div className="relative mx-auto flex h-72 w-full max-w-2xl items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full border border-dashed border-border" />
            <div className="absolute h-52 w-52 rounded-full border border-dashed border-border" />
            <div className="absolute h-32 w-32 rounded-full border border-dashed border-border" />
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
              <GraduationCap className="h-8 w-8" />
            </div>
            {/* Orbiting icons */}
            {['P', 'S', 'B', 'G', 'C', 'A'].map((label, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const r = 130;
              return (
                <div
                  key={label}
                  className="absolute flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-sm font-bold text-primary shadow-sm"
                  style={{
                    transform: `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, i) => (
            <Reveal key={integration.name} delay={(i % 3) * 60}>
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Plug className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                </div>
                <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold', statusStyles[integration.status])}>
                  {statusLabel[integration.status]}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
