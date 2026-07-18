'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle, ShieldCheck, Cloud, Building2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardMockup } from '@/components/site/dashboard-mockup';

const trust = [
  { icon: ShieldCheck, label: 'Secure and scalable' },
  { icon: Building2, label: 'Built for Indian schools' },
  { icon: Cloud, label: 'Cloud-based' },
  { icon: Headphones, label: 'Dedicated implementation support' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-12 pb-20 sm:pt-16 lg:pt-24">
      {/* Background grid + blobs */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-secondary/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      <div className="pointer-events-none absolute top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            The intelligent operating system for modern schools
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight font-display sm:text-5xl lg:text-6xl xl:text-7xl">
            One intelligent platform to{' '}
            <span className="text-gradient">run your entire school.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Skolaroid connects administration, academics, finance, communication and learning in one secure digital ecosystem — giving every school stakeholder the tools and visibility they need to succeed.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="shadow-glow w-full sm:w-auto">
              <Link href="/demo">
                Request a Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/product">Explore the Platform</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="w-full sm:w-auto">
              <Link href="/product">
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch Product Tour
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trust.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <t.icon className="h-4 w-4 text-primary" />
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 perspective-1000">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />
          <div className="relative animate-float-slow">
            <DashboardMockup variant="overview" />
          </div>

          {/* Floating cards */}
          <div className="absolute -left-4 top-1/4 hidden lg:block">
            <div className="glass animate-float rounded-2xl p-4 shadow-xl" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="text-sm font-bold">96.2% today</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 top-1/3 hidden lg:block">
            <div className="glass animate-float rounded-2xl p-4 shadow-xl" style={{ animationDelay: '2.5s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Fees collected</p>
                  <p className="text-sm font-bold">₹42.6L this month</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 bottom-1/4 hidden xl:block">
            <div className="glass animate-float rounded-2xl p-4 shadow-xl" style={{ animationDelay: '4s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Cloud className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Transport</p>
                  <p className="text-sm font-bold">24 buses on route</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
