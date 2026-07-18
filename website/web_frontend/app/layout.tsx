import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { StickyDemoButton } from '@/components/site/sticky-demo-button';
import { Toaster } from '@/components/ui/sonner';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://skolaroid.com'),
  title: {
    default: 'Skolaroid — The Intelligent Operating System for Modern Schools',
    template: '%s · Skolaroid',
  },
  description:
    'Skolaroid connects administration, academics, finance, communication and learning in one secure platform — giving every school stakeholder the tools and visibility they need to succeed.',
  keywords: [
    'school management software',
    'school ERP software',
    'school management system India',
    'learning management system for schools',
    'student information system',
    'school fee management software',
    'school attendance software',
    'parent communication app',
    'multi-school management software',
    'education ERP',
  ],
  openGraph: {
    type: 'website',
    url: 'https://skolaroid.com',
    siteName: 'Skolaroid',
    title: 'Skolaroid — The Intelligent Operating System for Modern Schools',
    description:
      'One intelligent platform to run your entire school. Administration, academics, finance, communication and learning — connected.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skolaroid — The Intelligent Operating System for Modern Schools',
    description:
      'One intelligent platform to run your entire school. Administration, academics, finance, communication and learning — connected.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://skolaroid.com' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <StickyDemoButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
