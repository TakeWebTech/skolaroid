import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { ModulesSection } from '@/components/site/sections/modules';
import { FinalCtaSection } from '@/components/site/sections/final-cta';
import { getProductModules } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Modules',
  description: 'Twenty-one connected modules covering school administration, academics, learning, operations and platform management.',
  alternates: { canonical: 'https://skolaroid.com/modules' },
};

export default async function ModulesPage() {
  const productModules = await getProductModules();
  const moduleCards = productModules.map(({ icon: _icon, ...module }) => module);

  return (
    <>
      <PageHero
        eyebrow="Modules"
        title="Every module your institution needs"
        description="Twenty-one connected modules covering admissions, attendance, fees, academics, learning, exams, communication, HR, transport, library, hostel, inventory, certificates, analytics, multi-school management and platform operations."
      />
      <ModulesSection modules={moduleCards} />
      <FinalCtaSection />
    </>
  );
}
