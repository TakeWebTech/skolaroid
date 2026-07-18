import type { MetadataRoute } from 'next';
import { modules, roleSolutions } from '@/lib/site-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://skolaroid.com';
  const staticRoutes = [
    '', '/product', '/modules', '/solutions', '/partners', '/blog', '/case-studies',
    '/help', '/faq', '/about/skolaroid', '/about/takeweb', '/careers', '/pricing',
    '/security', '/integrations', '/mobile-apps', '/contact', '/demo', '/login',
    '/legal/privacy', '/legal/terms', '/legal/cookies', '/legal/data-processing', '/legal/refund',
  ];
  const moduleRoutes = modules.map((m) => `/modules/${m.id}`);
  const solutionRoutes = roleSolutions.map((r) => `/solutions/${r.id}`);
  const all = [...staticRoutes, ...moduleRoutes, ...solutionRoutes];
  return all.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.7,
  }));
}
