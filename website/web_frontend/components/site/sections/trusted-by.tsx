'use client';

import { BrandLogo } from '@/components/site/brand-logo';

const placeholders = [
  'School Partner',
  'Educational Trust',
  'Technology Partner',
  'Payment Partner',
  'Communication Partner',
  'Cloud Partner',
  'School Group',
  'College Partner',
];

function LogoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-5 shadow-sm">
      <BrandLogo showText={false} markClassName="h-7 w-7 rounded-md" />
      <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}

export function TrustedBySection() {
  const doubled = [...placeholders, ...placeholders];
  return (
    <section className="border-y border-border bg-muted/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by forward-thinking educational institutions
        </p>
        <div className="mt-8 overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-4">
            {doubled.map((label, i) => (
              <LogoPlaceholder key={i} label={label} />
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Built in India by TakeWeb India. Designed for institutions everywhere.
        </p>
      </div>
    </section>
  );
}
