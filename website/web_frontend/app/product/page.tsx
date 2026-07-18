import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { DashboardMockup } from '@/components/site/dashboard-mockup';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { ModulesSection } from '@/components/site/sections/modules';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { ShieldCheck, Workflow, BarChart3, Users, Cloud, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Overview',
  description: 'Skolaroid is one connected platform for school administration, academics, finance, communication and learning.',
  alternates: { canonical: 'https://skolaroid.com/product' },
};

const pillars = [
  { icon: Workflow, title: 'Unified operations', description: 'One platform replaces disconnected spreadsheets and multiple software tools.' },
  { icon: BarChart3, title: 'Real-time analytics', description: 'Role-based dashboards turn everyday data into decisions.' },
  { icon: Users, title: 'Every stakeholder', description: 'Management, principals, teachers, students, parents, accounts and HR — all connected.' },
  { icon: Cloud, title: 'Cloud-based', description: 'Access from any device, anywhere, with secure cloud infrastructure.' },
  { icon: Zap, title: 'Automated workflows', description: 'Reminders, approvals and reports run automatically.' },
  { icon: ShieldCheck, title: 'Secure by design', description: 'Role-based access, encryption and institution-level data separation.' },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product Overview"
        title="One connected platform for your entire institution"
        description="Skolaroid brings school administration, academics, finance, communication, learning, attendance, transportation, student safety and analytics into a single secure ecosystem."
      >
        <CtaButtons />
      </PageHero>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/15 to-secondary/15 blur-2xl" />
            <div className="relative animate-float-slow">
              <DashboardMockup variant="overview" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Platform architecture"
            title="Built on six connected pillars"
            description="Each pillar reinforces the others — so every part of your school works together."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 80}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold font-display">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ModulesSection />
      <FinalCtaSection />
    </>
  );
}
