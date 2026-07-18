import type { Metadata } from 'next';
import { PageHero, CtaButtons } from '@/components/site/page-hero';
import { MobileSection } from '@/components/site/sections/mobile';
import { FinalCtaSection } from '@/components/site/sections/final-cta';

export const metadata: Metadata = {
  title: 'Mobile Applications',
  description: 'Dedicated apps for parents, teachers, students and school administrators.',
  alternates: { canonical: 'https://skolaroid.com/mobile-apps' },
};

export default function MobileAppsPage() {
  return (
    <>
      <PageHero
        eyebrow="Mobile Applications"
        title="Your entire school, always within reach"
        description="Dedicated apps for parents, teachers, students and administrators — with real-time notifications, payments, attendance and more."
      >
        <CtaButtons />
      </PageHero>
      <MobileSection />
      <FinalCtaSection />
    </>
  );
}
