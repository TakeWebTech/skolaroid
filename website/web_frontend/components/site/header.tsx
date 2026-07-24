'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Menu, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { navConfig } from '@/lib/site-data';
import { AnnouncementBar } from './announcement-bar';
import { BrandLogo } from './brand-logo';

const megaMenuCopy: Record<string, { eyebrow: string; title: string; description: string; cta: string }> = {
  Product: {
    eyebrow: 'Product suite',
    title: 'Explore the Skolaroid platform',
    description: 'A connected operating system for admissions, academics, finance, communication and analytics.',
    cta: 'View product overview',
  },
  Solutions: {
    eyebrow: 'Role-based workflows',
    title: 'Built for every school stakeholder',
    description: 'Give each team, parent and learner the exact workspace they need.',
    cta: 'Browse all solutions',
  },
  Modules: {
    eyebrow: 'Module library',
    title: 'Pick the capabilities your school needs',
    description: 'Start with core operations and expand into learning, transport, HR and analytics.',
    cta: 'See all modules',
  },
  Resources: {
    eyebrow: 'Learn and evaluate',
    title: 'Resources for confident decisions',
    description: 'Read guides, help articles, case studies and answers before rollout.',
    cta: 'Visit resources',
  },
  Company: {
    eyebrow: 'About us',
    title: 'Meet Skolaroid and TakeWeb India',
    description: 'Learn about the company, careers, partnerships and security approach behind the product.',
    cta: 'Know the company',
  },
};

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
            <BrandLogo priority markClassName="h-12 w-12" textClassName="text-xl" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navConfig.map((item) => (
              <div
                key={item.label}
                className="group"
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
                  <div className="absolute left-0 right-0 top-full z-50 pt-3">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                      <div className="grid overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-[0.85fr_1.65fr]">
                        <div className="relative border-r border-border/70 bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-6">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                            {megaMenuCopy[item.label]?.eyebrow ?? item.label}
                          </p>
                          <h3 className="mt-2 text-2xl font-bold tracking-tight font-display">
                            {megaMenuCopy[item.label]?.title ?? item.label}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {megaMenuCopy[item.label]?.description}
                          </p>
                          <Button asChild className="mt-6 shadow-glow" size="sm">
                            <Link href={item.href}>
                              {megaMenuCopy[item.label]?.cta ?? `Open ${item.label}`}
                              <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>

                        <div className="p-4">
                          <div
                            className={cn(
                              'grid gap-2',
                              item.children.length > 12
                                ? 'grid-cols-3'
                                : item.children.length > 6
                                  ? 'grid-cols-2'
                                  : 'grid-cols-2'
                            )}
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="group/item rounded-xl border border-transparent p-3 transition-all hover:border-primary/15 hover:bg-primary/5"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-sm font-semibold text-foreground">
                                      {child.label}
                                    </div>
                                    {child.description && (
                                      <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                        {child.description}
                                      </div>
                                    )}
                                  </div>
                                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
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
                    <BrandLogo markClassName="h-11 w-11" textClassName="text-lg" />
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
