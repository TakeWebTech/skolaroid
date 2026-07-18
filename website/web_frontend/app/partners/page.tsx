import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { Reveal } from '@/components/site/reveal';
import { Handshake, Wrench, RefreshCw, GraduationCap, Check } from 'lucide-react';
import { getPartners } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Partner with TakeWeb India and Skolaroid — technology, implementation, referral, reseller and education consultant partnerships.',
  alternates: { canonical: 'https://skolaroid.com/partners' },
};

const types = [
  { icon: Wrench, title: 'Technology partnerships', description: 'Integrate your product or hardware with Skolaroid.' },
  { icon: Handshake, title: 'Implementation partnerships', description: 'Help schools deploy and adopt Skolaroid in their region.' },
  { icon: RefreshCw, title: 'Referral partnerships', description: 'Introduce institutions to Skolaroid and earn referral benefits.' },
  { icon: GraduationCap, title: 'Education consultant partnerships', description: 'Guide institutions through digital transformation with Skolaroid.' },
];

const benefits = ['Revenue share', 'Co-marketing opportunities', 'Training and certification', 'Dedicated partner portal', 'Priority support', 'Sales enablement'];
const onboarding = ['Submit partner application', 'Review and conversation', 'Agreement and onboarding', 'Training and go-to-market'];

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Grow with Skolaroid"
        description="Partner with TakeWeb India to bring Skolaroid to more institutions — through technology, implementation, referral, reseller and education consultant partnerships."
      >
        <CtaButtons />
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t, i) => (
              <Reveal key={t.title} delay={(i % 4) * 80}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold font-display">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold font-display">Partner benefits</h2>
              <ul className="mt-6 space-y-2.5">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display">Onboarding process</h2>
              <ol className="mt-6 space-y-4">
                {onboarding.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <span className="text-sm font-medium pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold font-display">Partner directory</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Approved partners published from Strapi.</p>
          {partners.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {partners.map((partner, i) => (
                <Reveal key={partner.slug} delay={(i % 2) * 80}>
                  <article className="rounded-2xl border border-border bg-card p-5">
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{partner.type}</span>
                    <h3 className="mt-3 text-lg font-semibold font-display">{partner.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
                    {partner.website && <a className="mt-3 inline-block text-sm font-semibold text-primary" href={partner.website}>Visit website</a>}
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
              <h3 className="text-lg font-semibold font-display">No partners published yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create Partner entries in Strapi to populate this directory.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-center">Become a Partner</h2>
          <p className="mt-2 text-center text-muted-foreground">Tell us about your organisation and how you’d like to partner.</p>
          <div className="mt-10">
            <PartnerFormStub />
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}

function PartnerFormStub() {
  return (
    <form className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="Organisation name" />
        <input className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="Contact name" />
        <input className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="Email" />
        <input className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="Phone" />
      </div>
      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option>Technology partnership</option>
        <option>Implementation partnership</option>
        <option>Referral partnership</option>
        <option>Education consultant partnership</option>
      </select>
      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={4} placeholder="Tell us about your organisation and goals" />
      <button type="button" className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground">Submit Application</button>
    </form>
  );
}
