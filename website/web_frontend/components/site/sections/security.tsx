'use client';

import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ShieldCheck, Lock, KeyRound, ScrollText, DatabaseBackup, Building2,
  UserCog, Activity, Cloud, Download, Clock, LifeBuoy, Eye,
} from 'lucide-react';

const securityPoints = [
  { icon: KeyRound, label: 'Role-based access control' },
  { icon: Lock, label: 'Data encryption' },
  { icon: ShieldCheck, label: 'Secure authentication' },
  { icon: ScrollText, label: 'Audit logs' },
  { icon: DatabaseBackup, label: 'Regular backups' },
  { icon: Building2, label: 'School-level data isolation' },
  { icon: UserCog, label: 'Permission controls' },
  { icon: Activity, label: 'Activity monitoring' },
  { icon: Cloud, label: 'Secure cloud infrastructure' },
  { icon: Download, label: 'Data export controls' },
  { icon: Clock, label: 'Session management' },
  { icon: LifeBuoy, label: 'Disaster recovery planning' },
  { icon: Eye, label: 'Privacy-focused architecture' },
  { icon: ShieldCheck, label: 'Compliance-ready processes' },
];

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-accent/15 blur-3xl animate-blob" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Security and privacy"
          title="Built to protect the information your institution depends on"
          description="Designed with secure architecture and institution-level data separation."
        />

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {securityPoints.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) * 60}>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <s.icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Button size="lg" variant="outline" asChild className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            <Link href="/security">Explore Security</Link>
          </Button>
          <p className="text-xs text-white/40">
            We do not display unverified certifications. Wording reflects design intent, not certified compliance.
          </p>
        </div>
      </div>
    </section>
  );
}
