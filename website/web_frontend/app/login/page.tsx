import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { GraduationCap, Users, BookOpen, UserCog, Shield, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Login & Portal Selection',
  description: 'Choose your Skolaroid portal — administrator, teacher, student, parent, employee or super admin.',
  alternates: { canonical: 'https://skolaroid.com/login' },
};

const portals = [
  { icon: Shield, label: 'School Administrator', desc: 'Run your institution', color: 'hsl(231 76% 56%)' },
  { icon: BookOpen, label: 'Teacher', desc: 'Classroom and admin', color: 'hsl(263 70% 60%)' },
  { icon: GraduationCap, label: 'Student', desc: 'Learning hub', color: 'hsl(189 90% 42%)' },
  { icon: Users, label: 'Parent', desc: 'Stay informed', color: 'hsl(152 65% 45%)' },
  { icon: UserCog, label: 'Employee', desc: 'HR self-service', color: 'hsl(38 95% 55%)' },
  { icon: Building2, label: 'Super Admin', desc: 'Group oversight', color: 'hsl(0 84% 60%)' },
];

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Login"
        title="Choose your portal"
        description="Select the portal that matches your role. You can sign in with your institution code or dedicated subdomain."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portals.map((p, i) => (
              <Reveal key={p.label} delay={(i % 3) * 80}>
                <button className="group flex w-full flex-col items-start rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:shadow-glow">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${p.color}1a`, color: p.color }}>
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold font-display">{p.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-semibold font-display">Sign in to your institution</h3>
            <p className="mt-1 text-sm text-muted-foreground">Enter your institution code or use your dedicated subdomain.</p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input className="h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm" placeholder="Institution code (e.g. riverdale)" />
              <button type="button" className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">Continue</button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              Don’t have an account yet? <a href="/demo" className="font-semibold text-primary">Request a demo</a> to get started.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
