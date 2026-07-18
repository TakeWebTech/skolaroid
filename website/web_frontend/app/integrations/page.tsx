import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { IntegrationsSection } from '@/components/site/sections/integrations';
import { getIntegrations } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Skolaroid integrates with payment gateways, communication providers, hardware and productivity platforms.',
  alternates: { canonical: 'https://skolaroid.com/integrations' },
};

export default async function IntegrationsPage() {
  const integrations = await getIntegrations();

  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title="Connect the tools your institution already uses"
        description="Skolaroid integrates with payment gateways, communication providers, hardware and productivity platforms — with clear status indicators for each."
      >
        <CtaButtons />
      </PageHero>
      <IntegrationsSection integrations={integrations} />
      <FinalCtaSection />
    </>
  );
}
