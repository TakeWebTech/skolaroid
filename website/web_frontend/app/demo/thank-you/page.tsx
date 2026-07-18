import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Thank You',
  description: 'Your demo request has been received.',
};

export default function ThankYouPage() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-bold font-display sm:text-4xl">Thank you — we’ll be in touch</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Your demo request has been received. A member of the TakeWeb India team will reach out within one business day to schedule your personalised walkthrough.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/product">Explore the Platform</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
