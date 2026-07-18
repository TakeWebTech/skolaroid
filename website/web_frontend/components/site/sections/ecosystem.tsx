'use client';

import { useState } from 'react';
import {
  Building2, GraduationCap, BookOpen, Users, Wallet, UserCog, Bus, Library, DoorOpen,
} from 'lucide-react';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { cn } from '@/lib/utils';

const stakeholders = [
  { icon: Building2, label: 'Management', features: ['Strategic dashboards', 'Branch comparison', 'Revenue insights'] },
  { icon: GraduationCap, label: 'Principal', features: ['Academic monitoring', 'Teacher performance', 'Daily approvals'] },
  { icon: BookOpen, label: 'Teachers', features: ['Attendance', 'Lesson plans', 'Homework', 'Marks'] },
  { icon: Users, label: 'Students', features: ['Courses', 'Timetable', 'Results', 'Resources'] },
  { icon: Users, label: 'Parents', features: ['Alerts', 'Fee payments', 'Transport', 'Communication'] },
  { icon: Wallet, label: 'Accounts', features: ['Fee collection', 'Receipts', 'Reconciliation'] },
  { icon: UserCog, label: 'HR', features: ['Payroll', 'Leave', 'Performance'] },
  { icon: Bus, label: 'Transport', features: ['Live tracking', 'Routes', 'Alerts'] },
  { icon: Library, label: 'Library', features: ['Catalogue', 'Issue/return', 'Fines'] },
  { icon: DoorOpen, label: 'Admissions', features: ['Enquiries', 'Pipeline', 'Onboarding'] },
];

export function EcosystemSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="One connected ecosystem"
          title="The complete school ecosystem, around one platform"
          description="Skolaroid sits at the centre of your institution — connecting every stakeholder to the information and tools they need."
        />

        <Reveal className="mt-16">
          <div className="relative mx-auto max-w-4xl">
            {/* Connecting lines (SVG) */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="none">
              {stakeholders.map((_, i) => {
                const angle = (i / stakeholders.length) * Math.PI * 2 - Math.PI / 2;
                const cx = 400, cy = 300;
                const r = 230;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                return (
                  <line
                    key={i}
                    x1={cx} y1={cy} x2={x} y2={y}
                    stroke={active === i ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth={active === i ? 2 : 1}
                    className="transition-all duration-300"
                    strokeDasharray={active === i ? '0' : '4 4'}
                  />
                );
              })}
            </svg>

            {/* Central hub */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
                <div className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" />
                <div className="text-center">
                  <Building2 className="mx-auto h-7 w-7" />
                  <p className="mt-1 text-xs font-bold font-display">Skolaroid</p>
                </div>
              </div>
            </div>

            {/* Stakeholder nodes */}
            <div className="relative aspect-[4/3]">
              {stakeholders.map((s, i) => {
                const angle = (i / stakeholders.length) * Math.PI * 2 - Math.PI / 2;
                const left = 50 + Math.cos(angle) * 38;
                const top = 50 + Math.sin(angle) * 38;
                return (
                  <button
                    key={s.label}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <div
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-2xl border bg-card px-3 py-2.5 shadow-sm transition-all duration-300',
                        active === i ? 'border-primary shadow-glow scale-105' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl transition-colors', active === i ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                        <s.icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold">{s.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Active features */}
        <div className="mt-12 min-h-[64px]">
          {active !== null && (
            <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2">
              {stakeholders[active].features.map((f) => (
                <span key={f} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
