import { modules, roleSolutions } from '@/lib/site-data';

export const siteConfig = {
  name: 'Skolaroid',
  legalName: 'Skolaroid by TakeWeb India',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://skolaroid.com',
  description:
    'Skolaroid connects administration, academics, finance, communication and learning in one secure school operating system.',
  email: 'hello@takeweb.in',
  logoPath: '/brand/skolaroid-logo.webp',
};

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  index?: boolean;
};

export function siteUrl(path = '/') {
  const base = siteConfig.url.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath === '/' ? '' : normalizedPath}`;
}

export const staticSeoRoutes: SeoRoute[] = [
  {
    path: '/',
    title: 'Skolaroid - The Intelligent Operating System for Modern Schools',
    description: siteConfig.description,
    changeFrequency: 'weekly',
    priority: 1,
  },
  { path: '/product', title: 'Product Overview', description: 'Explore the connected Skolaroid school platform.', priority: 0.9 },
  { path: '/modules', title: 'School ERP Modules', description: 'Browse Skolaroid modules for school operations.', priority: 0.9 },
  { path: '/solutions', title: 'Solutions', description: 'Role-based Skolaroid solutions for schools.', priority: 0.85 },
  { path: '/pricing', title: 'Pricing', description: 'Explore Skolaroid pricing plans and module availability.', priority: 0.85 },
  { path: '/integrations', title: 'Integrations', description: 'Connect Skolaroid with ERPNext, Strapi and other systems.', priority: 0.75 },
  { path: '/mobile-apps', title: 'Mobile Apps', description: 'Skolaroid mobile apps for teachers, parents and students.', priority: 0.75 },
  { path: '/security', title: 'Security', description: 'Skolaroid security, privacy and data protection practices.', priority: 0.75 },
  { path: '/partners', title: 'Partners', description: 'Skolaroid partner programme and implementation ecosystem.', priority: 0.7 },
  { path: '/blog', title: 'Blog', description: 'Skolaroid articles, product updates and school digitisation guides.', priority: 0.7 },
  { path: '/case-studies', title: 'Case Studies', description: 'Stories from Skolaroid implementations.', priority: 0.7 },
  { path: '/help', title: 'Help Centre', description: 'Skolaroid help articles and product documentation.', priority: 0.7 },
  { path: '/faq', title: 'FAQ', description: 'Answers to common questions about Skolaroid.', priority: 0.7 },
  { path: '/careers', title: 'Careers', description: 'Join the team building Skolaroid.', priority: 0.55 },
  { path: '/about/skolaroid', title: 'About Skolaroid', description: 'Learn about Skolaroid and the product vision.', priority: 0.65 },
  { path: '/about/takeweb', title: 'About TakeWeb India', description: 'Learn about TakeWeb India, the company behind Skolaroid.', priority: 0.6 },
  { path: '/contact', title: 'Contact', description: 'Contact the Skolaroid team.', priority: 0.8 },
  { path: '/demo', title: 'Request a Demo', description: 'Request a personalised Skolaroid demo.', priority: 0.9 },
  { path: '/legal/privacy', title: 'Privacy Policy', description: 'Skolaroid privacy policy.', priority: 0.35 },
  { path: '/legal/terms', title: 'Terms of Service', description: 'Skolaroid terms of service.', priority: 0.35 },
  { path: '/legal/cookies', title: 'Cookie Policy', description: 'Skolaroid cookie policy.', priority: 0.3 },
  { path: '/legal/data-processing', title: 'Data Processing Policy', description: 'Skolaroid data processing policy.', priority: 0.3 },
  { path: '/legal/refund', title: 'Refund and Cancellation Policy', description: 'Skolaroid refund and cancellation policy.', priority: 0.3 },
  { path: '/login', title: 'Login', description: 'Skolaroid login page.', priority: 0.2, index: false },
  { path: '/demo/thank-you', title: 'Demo Request Received', description: 'Skolaroid demo request confirmation.', priority: 0.1, index: false },
];

export const moduleSeoRoutes: SeoRoute[] = modules.map((module) => ({
  path: `/modules/${module.id}`,
  title: `${module.name} Module`,
  description: module.tagline,
  priority: 0.75,
}));

export const solutionSeoRoutes: SeoRoute[] = roleSolutions.map((solution) => ({
  path: `/solutions/${solution.id}`,
  title: `Skolaroid for ${solution.role}`,
  description: solution.summary,
  priority: 0.7,
}));

export const seoRoutes = [...staticSeoRoutes, ...moduleSeoRoutes, ...solutionSeoRoutes];

export const indexableSeoRoutes = seoRoutes.filter((route) => route.index !== false);

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteUrl('/'),
    logo: siteUrl(siteConfig.logoPath),
    email: siteConfig.email,
    sameAs: [siteUrl('/')],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteUrl('/'),
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteUrl('/'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl('/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
