import { HeroSection } from '@/components/site/sections/hero';
import { TrustedBySection } from '@/components/site/sections/trusted-by';
import { EcosystemSection } from '@/components/site/sections/ecosystem';
import { TransformationSection } from '@/components/site/sections/transformation';
import { ScrollStorySection } from '@/components/site/sections/scroll-story';
import { ModulesSection } from '@/components/site/sections/modules';
import { AiSection } from '@/components/site/sections/ai';
import { SolutionsByRoleSection } from '@/components/site/sections/solutions-by-role';
import { MobileSection } from '@/components/site/sections/mobile';
import { IntegrationsSection } from '@/components/site/sections/integrations';
import { SecuritySection } from '@/components/site/sections/security';
import { ImplementationSection } from '@/components/site/sections/implementation';
import { TestimonialsSection } from '@/components/site/sections/testimonials';
import { StatsSection } from '@/components/site/sections/stats';
import { PricingPreviewSection } from '@/components/site/sections/pricing-preview';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { getIntegrations, getPricingPlans, getProductModules, getTestimonials } from '@/lib/cms-content';

export default async function Home() {
  const [productModules, pricingPlans, integrations, testimonials] = await Promise.all([
    getProductModules(),
    getPricingPlans(),
    getIntegrations(),
    getTestimonials(),
  ]);
  const moduleCards = productModules.map(({ icon: _icon, ...module }) => module);

  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <EcosystemSection />
      <TransformationSection />
      <ScrollStorySection />
      <ModulesSection modules={moduleCards} />
      <AiSection />
      <SolutionsByRoleSection />
      <MobileSection />
      <IntegrationsSection integrations={integrations} />
      <SecuritySection />
      <ImplementationSection />
      <TestimonialsSection testimonials={testimonials} />
      <StatsSection />
      <PricingPreviewSection plans={pricingPlans} />
      <FinalCtaSection />
    </>
  );
}
