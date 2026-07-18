'use client';

import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import {
  FileSpreadsheet, Layers, CalendarX, Clock, MessageSquareOff, FileText,
  Repeat, EyeOff,
  LayoutDashboard, Workflow, Zap, Megaphone, FolderOpen, Laptop, BarChart3, Users,
} from 'lucide-react';

const before = [
  { icon: FileSpreadsheet, label: 'Disconnected spreadsheets' },
  { icon: Layers, label: 'Multiple software systems' },
  { icon: CalendarX, label: 'Paper attendance' },
  { icon: Clock, label: 'Delayed fee updates' },
  { icon: MessageSquareOff, label: 'Communication gaps' },
  { icon: FileText, label: 'Manual report preparation' },
  { icon: Repeat, label: 'Repetitive administrative work' },
  { icon: EyeOff, label: 'Limited visibility for management' },
];

const after = [
  { icon: LayoutDashboard, label: 'One connected platform' },
  { icon: BarChart3, label: 'Real-time dashboards' },
  { icon: Workflow, label: 'Automated workflows' },
  { icon: Zap, label: 'Instant communication' },
  { icon: FolderOpen, label: 'Centralised student records' },
  { icon: Laptop, label: 'Digital learning' },
  { icon: FileText, label: 'Actionable reports' },
  { icon: Users, label: 'Better parent engagement' },
];

export function TransformationSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Problem and transformation"
          title="From scattered systems to one connected platform"
          description="See how Skolaroid transforms the everyday reality of running a school."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-red-200/60 bg-red-50/40 p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-600">
                  <EyeOff className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Before Skolaroid</p>
                  <p className="text-sm text-muted-foreground">The old way of working</p>
                </div>
              </div>
              <ul className="space-y-3">
                {before.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm text-foreground/80">
                    <item.icon className="h-4 w-4 text-red-500/70" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="h-full rounded-3xl border border-emerald-200/60 bg-emerald-50/40 p-8 shadow-glow">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <LayoutDashboard className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">With Skolaroid</p>
                  <p className="text-sm text-muted-foreground">The connected way</p>
                </div>
              </div>
              <ul className="space-y-3">
                {after.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <item.icon className="h-4 w-4 text-emerald-600" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
