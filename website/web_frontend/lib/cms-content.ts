import {
  ModuleDef,
  PricingPlan,
  FaqItem,
  IntegrationDef,
  modules,
  moduleMap,
  pricingPlans,
  faqItems,
  integrations,
} from '@/lib/site-data';
import { fetchStrapi } from '@/lib/strapi';

type StrapiEntity<T> = {
  id: number;
  documentId?: string;
  attributes?: T;
} & Partial<T>;

function entityFields<T>(entry: StrapiEntity<T>): T {
  return (entry.attributes ?? entry) as T;
}

type StrapiModule = {
  title: string;
  shortName?: string;
  slug: string;
  tagline?: string;
  description?: string;
  features?: string[];
  problems?: string[];
  benefits?: string[];
  roles?: string[];
  integrations?: string[];
  faqs?: { q: string; a: string }[];
  accentColor?: string;
  order?: number;
};

type StrapiPricingPlan = {
  title: string;
  slug: string;
  tagline?: string;
  audience?: string;
  highlight?: boolean;
  features?: { label: string; included?: boolean; note?: string }[];
  ctaLabel?: string;
};

type StrapiFaq = {
  question: string;
  answer?: string;
  category?: string;
  order?: number;
};

type StrapiIntegration = {
  title: string;
  category?: string;
  availabilityStatus?: IntegrationDef['status'];
  description?: string;
};

type StrapiBlogCategory = {
  title: string;
  slug: string;
};

type StrapiAuthor = {
  name: string;
  slug: string;
};

type StrapiBlogPost = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  publishedDate?: string;
  category?: StrapiEntity<StrapiBlogCategory> | StrapiBlogCategory | null;
  author?: StrapiEntity<StrapiAuthor> | StrapiAuthor | null;
};

type StrapiHelpCategory = {
  title: string;
  slug: string;
};

type StrapiHelpArticle = {
  title: string;
  slug: string;
  body?: string;
  order?: number;
  category?: StrapiEntity<StrapiHelpCategory> | StrapiHelpCategory | null;
};

type StrapiCaseStudy = {
  title: string;
  slug: string;
  challenge?: string;
  solution?: string;
  results?: string;
  customer?: StrapiEntity<{
    name: string;
    institutionType?: string;
    region?: string;
  }> | {
    name: string;
    institutionType?: string;
    region?: string;
  } | null;
};

type StrapiTestimonial = {
  quote: string;
  personName: string;
  personRole?: string;
  organisation?: string;
  approved?: boolean;
};

type StrapiPartner = {
  name: string;
  slug: string;
  partnerType?: string;
  website?: string;
  description?: string;
};

type StrapiCareerSection = {
  title: string;
  slug: string;
  body?: string;
  team?: string;
  order?: number;
};

type StrapiLegalPage = {
  title: string;
  slug: string;
  body?: string;
  effectiveDate?: string;
};

export type BlogPostCard = {
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  author?: string;
};

export type HelpArticleCard = {
  title: string;
  slug: string;
  category: string;
  body: string;
};

export type CaseStudyCard = {
  title: string;
  slug: string;
  institutionType: string;
  region: string;
  challenge: string;
  solution: string;
  results: string;
};

export type TestimonialCard = {
  name: string;
  role: string;
  org: string;
  quote: string;
};

export type PartnerCard = {
  name: string;
  slug: string;
  type: string;
  website?: string;
  description: string;
};

export type CareerSectionCard = {
  title: string;
  slug: string;
  body: string;
  team: string;
};

export type LegalPageContent = {
  title: string;
  slug: string;
  updated: string;
  sections: { heading: string; body: string }[];
};

export async function getProductModules(): Promise<ModuleDef[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiModule>[]>(
    '/api/product-modules?sort=order:asc&pagination[pageSize]=100&populate=*'
  );
  if (!data?.length) return modules;

  return data.map((entry) => {
    const item = entityFields(entry);
    const fallback = moduleMap[item.slug] ?? modules[0];
    return {
      ...fallback,
      id: item.slug as ModuleDef['id'],
      name: item.title,
      short: item.shortName || item.title,
      tagline: item.tagline || fallback.tagline,
      description: item.description || fallback.description,
      features: item.features?.length ? item.features : fallback.features,
      problems: item.problems?.length ? item.problems : fallback.problems,
      benefits: item.benefits?.length ? item.benefits : fallback.benefits,
      roles: item.roles?.length ? item.roles : fallback.roles,
      integrations: item.integrations?.length ? item.integrations : fallback.integrations,
      faqs: item.faqs?.length ? item.faqs : fallback.faqs,
      accent: item.accentColor || fallback.accent,
    };
  });
}

export async function getProductModule(slug: string): Promise<ModuleDef | null> {
  const all = await getProductModules();
  return all.find((item) => item.id === slug) ?? null;
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiPricingPlan>[]>(
    '/api/pricing-plans?sort=basePrice:asc&pagination[pageSize]=20&populate=*'
  );
  if (!data?.length) return pricingPlans;

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      name: item.title,
      tagline: item.tagline || '',
      audience: item.audience || '',
      highlight: item.highlight,
      features: item.features?.map((feature) => feature.note ? `${feature.label} - ${feature.note}` : feature.label) ?? [],
      cta: item.ctaLabel || 'Get a Custom Quote',
    };
  });
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiFaq>[]>(
    '/api/faqs?sort=order:asc&pagination[pageSize]=100'
  );
  if (!data?.length) return faqItems;

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      category: item.category || 'General',
      q: item.question,
      a: item.answer || '',
    };
  });
}

export async function getIntegrations(): Promise<IntegrationDef[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiIntegration>[]>(
    '/api/integrations?sort=title:asc&pagination[pageSize]=100'
  );
  if (!data?.length) return integrations;

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      name: item.title,
      category: item.category || 'Integration',
      status: item.availabilityStatus || 'planned',
    };
  });
}

export async function getBlogPosts(): Promise<BlogPostCard[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiBlogPost>[]>(
    '/api/blog-posts?sort=publishedDate:desc&pagination[pageSize]=100&populate=*'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    const category = item.category ? entityFields(item.category as StrapiEntity<StrapiBlogCategory>) : null;
    const author = item.author ? entityFields(item.author as StrapiEntity<StrapiAuthor>) : null;
    return {
      title: item.title,
      slug: item.slug,
      category: category?.title || 'Blog',
      date: item.publishedDate || 'Draft date',
      excerpt: item.excerpt || '',
      author: author?.name,
    };
  });
}

export async function getHelpArticles(): Promise<HelpArticleCard[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiHelpArticle>[]>(
    '/api/help-articles?sort=order:asc&pagination[pageSize]=100&populate=*'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    const category = item.category ? entityFields(item.category as StrapiEntity<StrapiHelpCategory>) : null;
    return {
      title: item.title,
      slug: item.slug,
      category: category?.title || 'General',
      body: item.body || '',
    };
  });
}

export async function getCaseStudies(): Promise<CaseStudyCard[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiCaseStudy>[]>(
    '/api/case-studies?sort=title:asc&pagination[pageSize]=100&populate=*'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    const customer = item.customer ? entityFields(item.customer as StrapiEntity<{ name: string; institutionType?: string; region?: string }>) : null;
    return {
      title: item.title,
      slug: item.slug,
      institutionType: customer?.institutionType || 'Institution',
      region: customer?.region || 'India',
      challenge: item.challenge || '',
      solution: item.solution || '',
      results: item.results || '',
    };
  });
}

export async function getTestimonials(): Promise<TestimonialCard[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiTestimonial>[]>(
    '/api/testimonials?filters[approved][$eq]=true&pagination[pageSize]=20'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      name: item.personName,
      role: item.personRole || 'Customer',
      org: item.organisation || 'Verified institution',
      quote: item.quote,
    };
  });
}

export async function getPartners(): Promise<PartnerCard[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiPartner>[]>(
    '/api/partners?sort=name:asc&pagination[pageSize]=100'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      name: item.name,
      slug: item.slug,
      type: item.partnerType || 'technology',
      website: item.website,
      description: item.description || '',
    };
  });
}

export async function getCareerSections(): Promise<CareerSectionCard[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiCareerSection>[]>(
    '/api/career-content-sections?sort=order:asc&pagination[pageSize]=100'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      title: item.title,
      slug: item.slug,
      body: item.body || '',
      team: item.team || 'Team',
    };
  });
}

function legalSectionsFromBody(body: string | undefined): LegalPageContent['sections'] {
  if (!body) return [];
  const chunks = body.split(/\n##\s+/).map((chunk) => chunk.trim()).filter(Boolean);
  return chunks.map((chunk) => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    const heading = lines[0]?.replace(/^##\s+/, '') || 'Overview';
    return {
      heading,
      body: lines.slice(1).join('\n\n') || '',
    };
  });
}

export async function getLegalPages(): Promise<LegalPageContent[]> {
  const data = await fetchStrapi<StrapiEntity<StrapiLegalPage>[]>(
    '/api/legal-pages?sort=title:asc&pagination[pageSize]=100'
  );
  if (!data?.length) return [];

  return data.map((entry) => {
    const item = entityFields(entry);
    return {
      title: item.title,
      slug: item.slug,
      updated: item.effectiveDate ? `Effective ${item.effectiveDate}` : 'Review before publication',
      sections: legalSectionsFromBody(item.body),
    };
  });
}

export async function getLegalPage(slug: string): Promise<LegalPageContent | null> {
  const data = await fetchStrapi<StrapiEntity<StrapiLegalPage>[]>(
    `/api/legal-pages?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`
  );
  const entry = data?.[0];
  if (!entry) return null;
  const item = entityFields(entry);
  return {
    title: item.title,
    slug: item.slug,
    updated: item.effectiveDate ? `Effective ${item.effectiveDate}` : 'Review before publication',
    sections: legalSectionsFromBody(item.body),
  };
}
