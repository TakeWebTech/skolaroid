'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Menu, ChevronDown, GraduationCap, ArrowRight } from 'lucide-react';
import { navConfig } from '@/lib/site-data';
import { AnnouncementBar } from './announcement-bar';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'glass border-b border-border/60 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Skolaroid home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight font-display">
              Skolaroid
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navConfig.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'text-foreground/70 hover:text-foreground',
                    pathname === item.href && 'text-foreground'
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        openMenu === item.label && 'rotate-180'
                      )}
                    />
                  )}
                </Link>
                {item.children && openMenu === item.label && (
                  <div className="absolute left-0 top-full pt-2 w-72">
                    <div className="glass rounded-2xl border border-border/60 p-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5"
                        >
                          <div className="text-sm font-medium text-foreground">
                            {child.label}
                          </div>
                          {child.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {child.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="shadow-glow">
              <Link href="/demo">
                Request a Demo
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <span className="font-bold font-display">Skolaroid</span>
                  </Link>
                  <SheetClose asChild />
                </div>
                <div className="px-3 py-4 space-y-1">
                  {navConfig.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <Link
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="ml-3 border-l border-border pl-3 space-y-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="w-full shadow-glow" asChild>
                      <Link href="/demo">Request a Demo</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
