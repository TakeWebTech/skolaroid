import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn('relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-14 sm:pt-20', className)}>
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {eyebrow && (
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 text-4xl font-bold tracking-tight font-display sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function CtaButtons() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href="/demo"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
      >
        Request a Free Demo
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
      >
        Talk to Our Team
      </Link>
    </div>
  );
}
