'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StickyDemoButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/demo')) return null;

  return (
    <>
      <Link
        href="/demo"
        aria-label="Request a demo"
        className={cn(
          'fixed bottom-5 right-5 z-40 hidden lg:flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105'
        )}
      >
        <CalendarCheck className="h-4 w-4" />
        Request a Demo
      </Link>
      <Link
        href="/demo"
        aria-label="Request a demo"
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow lg:hidden"
      >
        <CalendarCheck className="h-5 w-5" />
      </Link>
    </>
  );
}
