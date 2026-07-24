import type { MetadataRoute } from 'next';
import { indexableSeoRoutes, siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableSeoRoutes.map((route) => ({
    url: siteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency ?? 'weekly',
    priority: route.priority ?? 0.7,
  }));
}
