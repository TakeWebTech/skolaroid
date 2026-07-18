'use client';

import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementBar() {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  return (
    <div className="relative z-[60] bg-gradient-to-r from-primary via-secondary to-accent text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
        <span className="font-medium">
          Introducing Skolaroid Intelligence — smarter insights for modern schools.
        </span>
        <Link
          href="/#ai"
          className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
        >
          Explore what’s new
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          onClick={() => setClosed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 opacity-80 hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
