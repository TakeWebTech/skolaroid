import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { footerNav } from '@/lib/site-data';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-white font-display">Skolaroid</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">
              The intelligent operating system for modern schools. Built in India by TakeWeb India, designed for institutions everywhere.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/60">
              <a href="mailto:hello@takeweb.in" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" /> hello@takeweb.in
              </a>
              <a href="tel:+910000000000" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" /> +91 00 0000 0000
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> India
              </p>
            </div>
          </div>

          {Object.entries(footerNav).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Skolaroid — a product of TakeWeb India. Proudly built in India.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="rounded-full border border-white/20 px-2.5 py-1">Proudly built in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
