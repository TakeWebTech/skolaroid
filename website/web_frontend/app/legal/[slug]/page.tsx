import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { notFound } from 'next/navigation';
import { getLegalPage, getLegalPages } from '@/lib/cms-content';
import { siteUrl } from '@/lib/seo';

const policies: Record<string, { title: string; updated: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: placeholder date',
    sections: [
      { heading: 'Overview', body: 'This Privacy Policy explains how TakeWeb India (“we”, “us”) handles information in connection with the Skolaroid platform. This is a placeholder and must be reviewed by a qualified legal professional before publication.' },
      { heading: 'Information we process', body: 'We process information provided by institutions and their users — including names, contact details, student records and usage data — solely to operate and improve Skolaroid.' },
      { heading: 'How we use information', body: 'We use information to provide the platform, support institutions, ensure security and improve the product.' },
      { heading: 'Data retention', body: 'Institution data is retained for as long as the institution uses Skolaroid and afterward as needed to meet legal obligations.' },
      { heading: 'Your rights', body: 'Institutions may request access to, correction of, or deletion of their data subject to applicable law.' },
      { heading: 'Contact', body: 'For privacy questions, contact hello@takeweb.in.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: placeholder date',
    sections: [
      { heading: 'Acceptance of terms', body: 'By using Skolaroid, you agree to these Terms. This is a placeholder and must be reviewed by a qualified legal professional.' },
      { heading: 'Use of the platform', body: 'Institutions agree to use Skolaroid lawfully and to maintain the accuracy of their data.' },
      { heading: 'Accounts and access', body: 'Institutions are responsible for their users’ access and for keeping credentials secure.' },
      { heading: 'Fees and usage', body: 'SMS, email, WhatsApp, storage, payment gateway and custom integrations may be billed based on actual usage where applicable.' },
      { heading: 'Termination', body: 'Either party may terminate per the agreement. Data export is available before termination.' },
      { heading: 'Contact', body: 'For terms questions, contact hello@takeweb.in.' },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    updated: 'Last updated: placeholder date',
    sections: [
      { heading: 'What are cookies', body: 'Cookies are small files stored on your device. Skolaroid uses cookies for essential functionality and analytics. This is a placeholder and must be reviewed by a qualified legal professional.' },
      { heading: 'Types of cookies', body: 'Essential cookies enable core features. Analytics cookies help us understand usage. You can manage preferences through your browser.' },
      { heading: 'Third parties', body: 'Some third-party tools may set cookies. We limit these to trusted providers.' },
      { heading: 'Contact', body: 'For cookie questions, contact hello@takeweb.in.' },
    ],
  },
  'data-processing': {
    title: 'Data Processing Policy',
    updated: 'Last updated: placeholder date',
    sections: [
      { heading: 'Role', body: 'TakeWeb India acts as a processor of institution data on behalf of the institution (the controller). This is a placeholder and must be reviewed by a qualified legal professional.' },
      { heading: 'Processing purposes', body: 'We process data only to provide Skolaroid and related services as instructed by the institution.' },
      { heading: 'Security measures', body: 'We apply encryption, access controls and audit logs to protect data.' },
      { heading: 'Sub-processors', body: 'We use trusted cloud infrastructure providers. A list is available on request.' },
      { heading: 'Contact', body: 'For DPA questions, contact hello@takeweb.in.' },
    ],
  },
  refund: {
    title: 'Refund and Cancellation Policy',
    updated: 'Last updated: placeholder date',
    sections: [
      { heading: 'Cancellations', body: 'Institutions may cancel per their agreement. This is a placeholder and must be reviewed by a qualified legal professional.' },
      { heading: 'Refunds', body: 'Refund eligibility depends on the terms of your agreement and applicable law.' },
      { heading: 'Usage-based charges', body: 'SMS, email, WhatsApp, payment gateway and similar usage-based charges are non-refundable once incurred.' },
      { heading: 'Contact', body: 'For refund questions, contact hello@takeweb.in.' },
    ],
  },
};

export async function generateStaticParams() {
  const pages = await getLegalPages();
  const cmsSlugs = pages.map((page) => ({ slug: page.slug }));
  const fallbackSlugs = Object.keys(policies).map((slug) => ({ slug }));
  return cmsSlugs.length ? cmsSlugs : fallbackSlugs;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getLegalPage(params.slug) ?? policies[params.slug];
  if (!p) return { title: 'Policy not found' };
  return {
    title: p.title,
    description: `${p.title} for Skolaroid.`,
    alternates: { canonical: siteUrl(`/legal/${params.slug}`) },
  };
}

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const cmsPolicy = await getLegalPage(params.slug);
  const policy = cmsPolicy ?? policies[params.slug];
  if (!policy) notFound();

  return (
    <>
      <PageHero eyebrow="Legal" title={policy.title} description={policy.updated} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {policy.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-semibold font-display">{s.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
          {!cmsPolicy && (
            <p className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700">
              This fallback policy must be reviewed by a qualified legal professional before publication.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
