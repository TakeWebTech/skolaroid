'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { aiCapabilities } from '@/lib/site-data';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiSection() {
  return (
    <section id="ai" className="relative overflow-hidden bg-navy py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl animate-blob" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="AI and intelligent automation"
          title="Intelligence built into every part of your institution"
          description="Skolaroid turns everyday school data into meaningful decisions — with AI capabilities designed to support, not replace, your team."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {/* Insight panel */}
          <Reveal className="lg:col-span-1">
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Live insight panel</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'Attendance risk', value: '17 students flagged', tone: 'text-amber-400' },
                  { label: 'Fee forecast', value: '92% collection expected', tone: 'text-emerald-400' },
                  { label: 'Workload balance', value: '2 teachers over-allocated', tone: 'text-accent' },
                  { label: 'Performance trend', value: 'Class 8-B improving in Maths', tone: 'text-emerald-400' },
                ].map((insight, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <p className="text-xs text-white/50">{insight.label}</p>
                    <p className={cn('mt-1 text-sm font-semibold', insight.tone)}>{insight.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-white/40">Illustrative insights. AI features are marked as Coming Soon.</p>
            </div>
          </Reveal>

          {/* Capabilities grid */}
          <div className="lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {aiCapabilities.map((c, i) => (
                <Reveal key={c.title} delay={(i % 2) * 80}>
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground">
                      <c.icon className="h-4 w-4 text-accent" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white">{c.title}</p>
                        {c.status === 'soon' && (
                          <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
