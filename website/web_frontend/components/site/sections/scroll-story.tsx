'use client';

import { useEffect, useRef, useState } from 'react';
import { DashboardMockup, type DashboardVariant } from '@/components/site/dashboard-mockup';
import { SectionHeading } from '@/components/site/section-heading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps: { id: DashboardVariant; title: string; description: string; bullets: string[] }[] = [
  { id: 'overview', title: 'Dashboard overview', description: 'A single screen for the health of your school — attendance, fees, academics and activity in one view.', bullets: ['Live student statistics', 'Attendance percentage', 'Fee collection chart', 'Pending tasks'] },
  { id: 'attendance', title: 'Attendance management', description: 'Period-wise attendance with instant parent alerts and consolidated reports.', bullets: ['Student & staff attendance', 'Biometric and RFID integration', 'Late entry tracking', 'Automatic parent alerts'] },
  { id: 'admissions', title: 'Admission management', description: 'Guide every enquiry through a structured pipeline to enrolment.', bullets: ['Online enquiry forms', 'Visual admission pipeline', 'Document submission', 'Automated follow-ups'] },
  { id: 'fees', title: 'Fees and finance', description: 'Collect fees online, automate reminders and see live collection dashboards.', bullets: ['Online fee collection', 'Instalments and scholarships', 'Automated reminders', 'Collection reports'] },
  { id: 'exams', title: 'Examination analytics', description: 'Plan exams, enter marks and publish report cards with performance analytics.', bullets: ['Mark entry with validation', 'Report card generation', 'Subject performance', 'Student performance trends'] },
  { id: 'lms', title: 'Learning management', description: 'Courses, lessons, quizzes and progress tracking in one learning hub.', bullets: ['Online courses', 'Video and document lessons', 'Quizzes and assignments', 'Completion tracking'] },
  { id: 'communication', title: 'Parent communication', description: 'Reach every parent instantly through push, SMS, email and in-app messages.', bullets: ['Announcements and circulars', 'Emergency alerts', 'Delivery tracking', 'Class-specific messaging'] },
  { id: 'transport', title: 'Transport tracking', description: 'Plan routes, track vehicles live and alert parents on pickup and drop.', bullets: ['GPS live tracking', 'Route and stop management', 'Pickup and drop alerts', 'Transport attendance'] },
  { id: 'analytics', title: 'Reports and AI insights', description: 'Role-based dashboards and intelligent insights from everyday school data.', bullets: ['Management dashboards', 'Custom report builder', 'Scheduled reports', 'AI-powered insights'] },
  { id: 'multi-school', title: 'Multi-school management', description: 'One super-admin panel for every branch and trust in your group.', bullets: ['Central super-admin panel', 'Branch comparison', 'Central finance overview', 'Shared curriculum'] },
];

export function ScrollStorySection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = section.offsetHeight - viewportH;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const idx = Math.min(Math.floor(progress * steps.length), steps.length - 1);
      setActive(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative bg-navy py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Product interface scroll story"
          title="Watch the platform come alive as you scroll"
          description="Every part of Skolaroid — from attendance to analytics — in one connected experience."
        />
      </div>

      <div ref={sectionRef} className="relative mt-16" style={{ height: `${steps.length * 60}vh` }}>
        <div className="sticky top-20">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {/* Left: text */}
            <div className="order-2 lg:order-1">
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500',
                      i === active ? 'w-8 bg-primary' : 'w-1.5 bg-white/20'
                    )}
                  />
                ))}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">
                Step {active + 1} of {steps.length}
              </p>
              <h3 className="mt-2 text-2xl font-bold font-display sm:text-3xl">
                {steps[active].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/70">
                {steps[active].description}
              </p>
              <ul className="mt-6 space-y-2.5">
                {steps[active].bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-white/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 shadow-glow" asChild>
                <Link href="/modules">
                  Explore Every Module
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right: dashboard */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/30 to-secondary/30 blur-2xl" />
                <div key={active} className="relative animate-float-slow">
                  <DashboardMockup variant={steps[active].id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
