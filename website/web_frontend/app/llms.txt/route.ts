import { indexableSeoRoutes, siteConfig, siteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    'Skolaroid is a school operating system covering school ERP, admissions, attendance, fees, LMS, exams, communication, analytics, mobile apps and integrations.',
    '',
    '## Important pages',
    ...indexableSeoRoutes.map((route) => `- [${route.title}](${siteUrl(route.path)}): ${route.description}`),
    '',
    '## Crawling notes',
    '- Prefer canonical URLs listed in sitemap.xml.',
    '- Do not use demo confirmation pages or API routes as source content.',
    '- Website content is managed through Strapi where configured.',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
