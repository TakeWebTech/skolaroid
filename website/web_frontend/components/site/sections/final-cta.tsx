'use client';

import Link from 'next/link';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: '5s' }} />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight font-display sm:text-4xl lg:text-5xl">
          Ready to build a smarter school?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          See how Skolaroid can connect your administration, teachers, students and parents in one intelligent platform.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-xl w-full sm:w-auto">
            <Link href="/demo">
              Request a Free Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/40 bg-white/5 text-white hover:bg-white/10 w-full sm:w-auto">
            <Link href="/contact">
              <PhoneCall className="mr-2 h-4 w-4" />
              Talk to Our Team
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
