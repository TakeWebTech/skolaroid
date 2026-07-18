'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import {
  Bell, Wallet, CalendarCheck, BookOpen, ClipboardCheck, Bus, Megaphone,
  CalendarDays, User,
} from 'lucide-react';

const apps = [
  { name: 'Parent App', color: 'hsl(231 76% 56%)', features: [
    { icon: Bell, label: 'Real-time notifications' },
    { icon: Wallet, label: 'Fee payments' },
    { icon: CalendarCheck, label: 'Attendance alerts' },
    { icon: Bus, label: 'Transport tracking' },
  ]},
  { name: 'Teacher App', color: 'hsl(263 70% 60%)', features: [
    { icon: CalendarCheck, label: 'Attendance' },
    { icon: BookOpen, label: 'Lesson plans' },
    { icon: ClipboardCheck, label: 'Marks entry' },
    { icon: Megaphone, label: 'Parent communication' },
  ]},
  { name: 'Student App', color: 'hsl(189 90% 42%)', features: [
    { icon: BookOpen, label: 'Homework' },
    { icon: CalendarDays, label: 'Timetable' },
    { icon: ClipboardCheck, label: 'Results' },
    { icon: BookOpen, label: 'Digital resources' },
  ]},
  { name: 'Admin App', color: 'hsl(152 65% 45%)', features: [
    { icon: Bell, label: 'Announcements' },
    { icon: User, label: 'Profile management' },
    { icon: CalendarCheck, label: 'Approvals' },
    { icon: Wallet, label: 'Finance overview' },
  ]},
];

function PhoneMockup({ app, index }: { app: typeof apps[number]; index: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[460px] w-[230px] rounded-[2.5rem] border-[6px] border-navy bg-navy p-2 shadow-2xl">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-navy" />
        <div className="h-full w-full overflow-hidden rounded-[2rem] bg-background">
          {/* App header */}
          <div className="flex flex-col items-center justify-center p-5 text-white" style={{ background: `linear-gradient(135deg, ${app.color}, hsl(var(--secondary)))` }}>
            <div className="mt-4 h-12 w-12 rounded-2xl bg-white/20 backdrop-blur" />
            <p className="mt-3 text-sm font-bold">{app.name}</p>
            <p className="text-[10px] opacity-80">Skolaroid</p>
          </div>
          {/* App content */}
          <div className="p-4">
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-[10px] text-muted-foreground">Today</p>
              <p className="text-sm font-bold">Good morning!</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {app.features.map((f) => (
                <div key={f.label} className="rounded-xl border border-border bg-card p-2.5">
                  <f.icon className="h-4 w-4" style={{ color: app.color }} />
                  <p className="mt-1.5 text-[10px] font-medium leading-tight">{f.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl p-3 text-white" style={{ background: app.color }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">Latest</p>
              <p className="mt-0.5 text-xs font-bold">School circular published</p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold">{app.name}</p>
    </div>
  );
}

export function MobileSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Mobile applications"
          title="Your entire school, always within reach"
          description="Dedicated apps for parents, teachers, students and administrators — with real-time notifications, payments, attendance and more."
        />

        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 mask-fade-x lg:justify-center">
          {apps.map((app, i) => (
            <Reveal key={app.name} delay={i * 100} className="shrink-0 snap-center">
              <PhoneMockup app={app} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 opacity-60">
            <span className="text-sm font-medium">Download on the App Store</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 opacity-60">
            <span className="text-sm font-medium">Get it on Google Play</span>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Store links will be enabled once applications are officially published.
        </p>
      </div>
    </section>
  );
}
