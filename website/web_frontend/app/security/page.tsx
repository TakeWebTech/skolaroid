import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { Reveal } from '@/components/site/reveal';
import {
  ShieldCheck, Lock, KeyRound, ScrollText, DatabaseBackup, Building2,
  UserCog, Activity, Cloud, Download, Clock, LifeBuoy, Eye,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Skolaroid is designed with secure architecture and institution-level data separation.',
  alternates: { canonical: 'https://skolaroid.com/security' },
};

const sections = [
  { icon: KeyRound, title: 'Role-based access control', description: 'Every user sees only what their role permits — from super-admin down to parent.' },
  { icon: Lock, title: 'Data encryption', description: 'Data is encrypted in transit and at rest to protect sensitive information.' },
  { icon: ShieldCheck, title: 'Secure authentication', description: 'Strong authentication with session management protects user accounts.' },
  { icon: ScrollText, title: 'Audit logs', description: 'Activity is logged for accountability and institutional oversight.' },
  { icon: DatabaseBackup, title: 'Regular backups', description: 'Backups are taken regularly to support recovery and continuity.' },
  { icon: Building2, title: 'School-level data isolation', description: 'Each institution’s data is kept separate from others.' },
  { icon: UserCog, title: 'Permission controls', description: 'Granular permissions let administrators control access precisely.' },
  { icon: Activity, title: 'Activity monitoring', description: 'Monitoring helps detect unusual activity early.' },
  { icon: Cloud, title: 'Secure cloud infrastructure', description: 'Skolaroid runs on secure cloud infrastructure designed for reliability.' },
  { icon: Download, title: 'Data export controls', description: 'Institutions can export their data, with controls on who can do so.' },
  { icon: Clock, title: 'Session management', description: 'Sessions are managed to reduce the risk of unauthorised access.' },
  { icon: LifeBuoy, title: 'Disaster recovery planning', description: 'Recovery procedures are designed to minimise disruption.' },
  { icon: Eye, title: 'Privacy-focused architecture', description: 'Privacy is considered throughout the platform design.' },
  { icon: ShieldCheck, title: 'Compliance-ready processes', description: 'Processes are designed to support compliance — without claiming unverified certifications.' },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Built to protect the information your institution depends on"
        description="Designed with secure architecture and institution-level data separation."
      >
        <CtaButtons />
      </PageHero>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 80}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold font-display">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-muted-foreground">
            We do not display unverified certifications. Wording reflects design intent, not certified compliance. Please consult a qualified professional for formal compliance review.
          </p>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
