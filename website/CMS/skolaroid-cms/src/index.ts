import type { Core } from '@strapi/strapi';

type StrapiApp = Core.Strapi;

const productModules = [
  {
    title: 'Admissions & Enquiry Management',
    shortName: 'Admissions',
    slug: 'admissions',
    tagline: 'Turn enquiries into enrolled students without the paperwork chase.',
    description: 'Capture enquiries, guide applicants through a structured pipeline, collect documents and onboard students with clear follow-ups.',
    features: ['Online enquiry forms', 'Admission pipeline', 'Document verification', 'Student onboarding', 'Admission reports'],
    roles: ['Administrators', 'Admission teams', 'Principals'],
    integrations: ['ERPNext CRM', 'Payment gateway', 'Email', 'MSG91'],
    accentColor: 'hsl(231 76% 56%)',
    order: 10,
  },
  {
    title: 'Student Information System',
    shortName: 'Student SIS',
    slug: 'student-information',
    tagline: 'Every student record in one secure place.',
    description: 'Maintain complete student profiles, guardians, documents, class allocation, promotion history and sensitive records with permissions.',
    features: ['Student profiles', 'Guardian records', 'Documents', 'Class allocation', 'Promotion history'],
    roles: ['Administrators', 'Principals', 'Teachers'],
    integrations: ['Certificates', 'Analytics'],
    accentColor: 'hsl(263 70% 60%)',
    order: 20,
  },
  {
    title: 'Attendance Management',
    shortName: 'Attendance',
    slug: 'attendance',
    tagline: 'Accurate attendance for students, teachers and staff.',
    description: 'Record period-wise attendance, handle leave requests and notify families through configured communication channels.',
    features: ['Student attendance', 'Period-wise attendance', 'Leave requests', 'Parent alerts', 'Attendance reports'],
    roles: ['Teachers', 'Administrators', 'Parents', 'Principals'],
    integrations: ['Biometric devices', 'RFID', 'MSG91', 'Push notifications'],
    accentColor: 'hsl(189 90% 42%)',
    order: 30,
  },
  {
    title: 'Fees & Finance',
    shortName: 'Fees',
    slug: 'fees-finance',
    tagline: 'Collect fees online and see dues clearly.',
    description: 'Create flexible fee structures, collect payments, manage concessions and sync commercial workflows with ERPNext.',
    features: ['Fee structures', 'Online collection', 'Digital receipts', 'Dues tracking', 'Finance dashboards'],
    roles: ['Accountants', 'Administrators', 'Parents'],
    integrations: ['ERPNext Accounting', 'Payment gateways', 'MSG91'],
    accentColor: 'hsl(150 60% 40%)',
    order: 40,
  },
  {
    title: 'Learning Management System',
    shortName: 'LMS',
    slug: 'lms',
    tagline: 'Assignments, lessons and learning resources in one flow.',
    description: 'Publish lessons, homework, resources and learning plans for teachers, students and parents.',
    features: ['Lessons', 'Homework', 'Resources', 'Student submissions', 'Progress visibility'],
    roles: ['Teachers', 'Students', 'Parents'],
    integrations: ['Video conferencing', 'Cloud storage'],
    accentColor: 'hsl(217 85% 56%)',
    order: 50,
  },
  {
    title: 'Examinations & Results',
    shortName: 'Exams',
    slug: 'examinations',
    tagline: 'Plan exams, enter marks and publish results safely.',
    description: 'Manage assessment schedules, marks entry, report cards, approval flows and result publication.',
    features: ['Exam schedules', 'Marks entry', 'Grade rules', 'Report cards', 'Result approval'],
    roles: ['Teachers', 'Exam cells', 'Principals'],
    integrations: ['Analytics', 'Parent communication'],
    accentColor: 'hsl(336 80% 55%)',
    order: 60,
  },
  {
    title: 'Communication & Announcements',
    shortName: 'Communication',
    slug: 'communication',
    tagline: 'Role-aware messaging for the school community.',
    description: 'Send announcements and messages to targeted audiences with audit visibility.',
    features: ['Announcements', 'Direct messages', 'Role targeting', 'Read tracking', 'Audit log'],
    roles: ['Administrators', 'Teachers', 'Parents', 'Students'],
    integrations: ['MSG91', 'Email providers', 'WhatsApp Communication'],
    accentColor: 'hsl(28 88% 52%)',
    order: 70,
  },
  {
    title: 'Platform Administration',
    shortName: 'Platform Admin',
    slug: 'platform-administration',
    tagline: 'Run Skolaroid tenants without becoming a school user.',
    description: 'Manage school tenants, platform users, tenant health, access, support workflows and governance from the platform side.',
    features: ['Tenant directory', 'School profiles', 'Platform roles', 'Support access keys', 'Tenant audit review'],
    roles: ['Platform admins', 'Support teams', 'Implementation teams'],
    integrations: ['ERPNext CRM', 'ERPNext Accounting', 'Strapi CMS'],
    accentColor: 'hsl(224 80% 55%)',
    order: 80,
  },
  {
    title: 'Tenant Provisioning',
    shortName: 'Provisioning',
    slug: 'tenant-provisioning',
    tagline: 'Create school workspaces with proper organization structure.',
    description: 'Capture school identity, domains, branches, owners, plan, implementation context and support keys before onboarding.',
    features: ['Organization IDs', 'Branch setup', 'Domain capture', 'Owner details', 'Implementation handoff'],
    roles: ['Platform admins', 'Implementation managers'],
    integrations: ['ERPNext CRM', 'ERPNext Customers'],
    accentColor: 'hsl(197 82% 45%)',
    order: 90,
  },
  {
    title: 'Plans & Entitlements',
    shortName: 'Plans',
    slug: 'plans-entitlements',
    tagline: 'Control plan access, add-ons and school-specific entitlements.',
    description: 'Create product plans, attach module entitlements, handle subscriptions, add-ons and custom school-level access.',
    features: ['Plan catalog', 'Module entitlements', 'School overrides', 'Subscription history', 'Invoice references'],
    roles: ['Platform admins', 'Billing teams'],
    integrations: ['ERPNext Accounting', 'Payment gateways'],
    accentColor: 'hsl(259 74% 58%)',
    order: 100,
  },
  {
    title: 'Support Operations',
    shortName: 'Support',
    slug: 'support-operations',
    tagline: 'Resolve tenant issues with traceable support actions.',
    description: 'Manage support conversations, website-down alerts, tenant actions, support keys and service audit trails.',
    features: ['Support cases', 'Dedicated tenant messaging', 'Support key rotation', 'Action audit', 'Incident tracking'],
    roles: ['Support teams', 'School admins', 'Principals'],
    integrations: ['ERPNext CRM', 'Email providers'],
    accentColor: 'hsl(0 82% 57%)',
    order: 110,
  },
];

const pricingPlans = [
  {
    title: 'Foundation',
    slug: 'foundation',
    tagline: 'For small schools beginning digital transformation.',
    audience: 'Up to 500 students',
    basePrice: 0,
    billingCycle: 'custom',
    ctaLabel: 'Get a Custom Quote',
    features: [
      { label: 'Core administration modules', included: true },
      { label: 'Student information, attendance and fees', included: true },
      { label: 'Parent communication', included: true },
    ],
  },
  {
    title: 'Growth',
    slug: 'growth',
    tagline: 'For established schools needing advanced operations.',
    audience: '500 to 2,500 students',
    highlight: true,
    basePrice: 0,
    billingCycle: 'custom',
    ctaLabel: 'Get a Custom Quote',
    features: [
      { label: 'All Foundation modules', included: true },
      { label: 'LMS, examinations and HR', included: true },
      { label: 'Priority support', included: true },
    ],
  },
  {
    title: 'Enterprise',
    slug: 'enterprise',
    tagline: 'For school groups, trusts and multi-branch institutions.',
    audience: '2,500+ students or multiple branches',
    basePrice: 0,
    billingCycle: 'custom',
    ctaLabel: 'Talk to Sales',
    features: [
      { label: 'All Growth modules', included: true },
      { label: 'Multi-school governance', included: true },
      { label: 'Custom integrations and SLA', included: true },
    ],
  },
];

const faqs = [
  ['Product', 'What is Skolaroid?', 'Skolaroid is a unified school management platform for administration, academics, finance, communication and learning.'],
  ['Implementation', 'Do you help with data migration?', 'Yes. Implementation includes migration planning for student, staff, finance and academic data.'],
  ['Pricing', 'Is pricing fixed or customised?', 'Pricing is quotation-based and depends on institution size, modules, add-ons and implementation scope.'],
  ['Integrations', 'How does ERPNext fit in?', 'ERPNext manages demo enquiries, leads, quotations, customers, hiring workflows, accounting and invoices.'],
  ['CMS', 'What does Strapi manage?', 'Strapi manages website pages, blogs, help articles, testimonials, case studies, modules, pricing presentation and SEO metadata.'],
  ['Communication', 'Can MSG91 be used later?', 'Yes. MSG91 is planned for production OTP, email, SMS and WhatsApp communication flows.'],
  ['Security', 'How is tenant data separated?', 'The product is designed around tenant context, role permissions, audit logs and platform access that stays separate from school membership.'],
];

const integrations = [
  ['Strapi CMS', 'Website Content', 'available', 'Website pages, blog, help centre, SEO, testimonials, case studies and product content.'],
  ['ERPNext CRM', 'Sales & CRM', 'available', 'Demo enquiries, sales leads, follow-ups, quotations and customer records.'],
  ['ERPNext Accounting', 'Finance', 'available', 'Invoices, payments, accounting and commercial history.'],
  ['Frappe HR', 'Hiring & HR', 'available', 'Job openings and hiring applications.'],
  ['MSG91', 'Communication', 'planned', 'Production OTP, SMS, email and WhatsApp communication provider.'],
  ['Payment Gateways', 'Payments', 'available', 'Online fee and subscription payment collection.'],
];

const userRoles = [
  ['Platform Admin', 'Company staff who manage Skolaroid tenants, plans, support and platform operations.'],
  ['School Admin', 'School-side administrator with tenant-level operational control.'],
  ['Principal', 'School leadership role for approvals, reports, announcements and oversight.'],
  ['Teacher', 'Classroom role for attendance, homework, learning, marks and communication.'],
  ['Student', 'Learner portal role for homework, lessons, exams, messages and notices.'],
  ['Parent', 'Guardian role for fees, notices, attendance alerts and communication.'],
  ['Accountant', 'Finance role for fee setup, collection, reconciliation and reports.'],
];

const blogPosts = [
  {
    title: 'How to plan a school ERP rollout without disrupting daily operations',
    slug: 'school-erp-rollout-plan',
    excerpt: 'A practical rollout plan for moving school operations from spreadsheets and disconnected tools into one platform.',
    body: 'Start with core records, permissions and data quality. Then phase admissions, attendance, fees, academics and communication so each team can adopt the system without losing daily rhythm.',
    publishedDate: '2026-07-18',
  },
  {
    title: 'Why tenant structure matters in school management software',
    slug: 'tenant-structure-school-management',
    excerpt: 'Tenant, branch and platform access decisions decide whether a school ERP remains clean as it grows.',
    body: 'Platform staff should manage school tenants from outside the school membership model. School users should belong to their tenant and branch, while platform access stays permission controlled.',
    publishedDate: '2026-07-18',
  },
  {
    title: 'What should live in Strapi and what should live in ERPNext',
    slug: 'strapi-erpnext-school-website',
    excerpt: 'Use Strapi for website content and ERPNext for commercial operations, hiring and accounting.',
    body: 'Strapi should manage website pages, blog, help centre, SEO, testimonials, case studies, modules and pricing presentation. ERPNext should manage demo enquiries, sales leads, follow-ups, quotations, customers, hiring and invoices.',
    publishedDate: '2026-07-18',
  },
];

const helpArticles = [
  {
    title: 'Request a Skolaroid demo',
    slug: 'request-a-demo',
    body: 'Open the demo page, share your school details, modules of interest and preferred meeting time. The enquiry is designed to flow into ERPNext for sales follow-up.',
    order: 10,
  },
  {
    title: 'Understand product modules',
    slug: 'understand-product-modules',
    body: 'The Modules page lists the operating areas Skolaroid supports, including admissions, students, attendance, fees, learning, exams, communication and platform administration.',
    order: 20,
  },
  {
    title: 'Understand pricing and entitlements',
    slug: 'understand-pricing-entitlements',
    body: 'Pricing plans control module availability. Entitlements define which product areas and add-ons are enabled for a school.',
    order: 30,
  },
];

const careerSections = [
  {
    title: 'Full-stack Engineer',
    slug: 'full-stack-engineer',
    team: 'Engineering',
    body: 'Build production-grade school ERP workflows across frontend, backend and integrations.',
    order: 10,
  },
  {
    title: 'Implementation Manager',
    slug: 'implementation-manager',
    team: 'Customer Success',
    body: 'Guide schools through onboarding, data migration, training and go-live planning.',
    order: 20,
  },
  {
    title: 'Account Executive',
    slug: 'account-executive',
    team: 'Sales',
    body: 'Work with institutions to understand requirements and coordinate ERPNext-backed sales workflows.',
    order: 30,
  },
];

const legalPages = [
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    effectiveDate: '2026-07-18',
    body: '## Overview\nThis Privacy Policy explains how TakeWeb India handles information in connection with Skolaroid.\n\n## Information we process\nWe process information provided by institutions and their users to operate, secure and improve the platform.\n\n## Contact\nFor privacy questions, contact the Skolaroid team.',
  },
  {
    title: 'Terms of Service',
    slug: 'terms',
    effectiveDate: '2026-07-18',
    body: '## Acceptance\nBy using Skolaroid, institutions agree to the applicable commercial and service terms.\n\n## Platform use\nInstitutions are responsible for user access, data accuracy and lawful use.\n\n## Contact\nFor terms questions, contact the Skolaroid team.',
  },
  {
    title: 'Cookie Policy',
    slug: 'cookies',
    effectiveDate: '2026-07-18',
    body: '## Overview\nSkolaroid may use cookies for essential website functionality, analytics and security.\n\n## Managing cookies\nVisitors can manage cookie preferences through browser settings.',
  },
  {
    title: 'Data Processing Policy',
    slug: 'data-processing',
    effectiveDate: '2026-07-18',
    body: '## Role\nTakeWeb India processes institution data to provide Skolaroid services.\n\n## Security\nAccess controls, tenant separation and audit logs are core design requirements.',
  },
  {
    title: 'Refund and Cancellation Policy',
    slug: 'refund',
    effectiveDate: '2026-07-18',
    body: '## Cancellations\nCancellation terms depend on the institution agreement.\n\n## Usage-based charges\nCommunication, payment gateway and similar usage-based charges may be billed separately once incurred.',
  },
];

const customers = [
  {
    name: 'Riverdale Public School',
    slug: 'riverdale-public-school',
    institutionType: 'School',
    region: 'India',
    website: 'https://example.edu',
  },
  {
    name: 'Northstar Education Group',
    slug: 'northstar-education-group',
    institutionType: 'School Group',
    region: 'India',
    website: 'https://example.edu',
  },
  {
    name: 'Metro College of Learning',
    slug: 'metro-college-of-learning',
    institutionType: 'College',
    region: 'India',
    website: 'https://example.edu',
  },
];

const testimonials = [
  {
    quote: 'Skolaroid brought our attendance, fees and parent communication into one place. We spend less time on paperwork and more on students.',
    personName: 'Principal Placeholder',
    personRole: 'Principal',
    organisation: 'Riverdale Public School',
    approved: true,
  },
  {
    quote: 'The admission pipeline transformed how we track enquiries. No lead slips through the cracks anymore.',
    personName: 'Administrator Placeholder',
    personRole: 'Administrator',
    organisation: 'Northstar Education Group',
    approved: true,
  },
  {
    quote: 'Online fee collection and automated reminders have noticeably improved our collection cycle.',
    personName: 'Accountant Placeholder',
    personRole: 'Accountant',
    organisation: 'Metro College of Learning',
    approved: true,
  },
];

const caseStudies = [
  {
    title: 'Attendance and fee visibility for a growing school',
    slug: 'attendance-fee-visibility-growing-school',
    challenge: 'Disconnected spreadsheets and delayed fee updates made daily operations slow for administrators and parents.',
    solution: 'The institution adopted Skolaroid attendance, fees and communication modules as the first rollout phase.',
    results: 'The school gained faster fee follow-up, real-time attendance visibility and clearer parent communication.',
  },
  {
    title: 'Central oversight for a multi-branch school group',
    slug: 'central-oversight-school-group',
    challenge: 'Leadership had no clean roll-up view across branches, finance and staff operations.',
    solution: 'Skolaroid multi-school management, analytics and HR workflows created a single operating view.',
    results: 'Branch comparison, operational review and finance visibility became easier for the central team.',
  },
  {
    title: 'Learning and examinations in one student journey',
    slug: 'learning-examinations-student-journey',
    challenge: 'Learning content, exam planning and results were scattered across multiple tools.',
    solution: 'The college consolidated LMS, examinations and library workflows inside Skolaroid.',
    results: 'Students and staff moved to one learning hub with clearer completion and assessment tracking.',
  },
];

const partners = [
  {
    name: 'Cloud Partner',
    slug: 'cloud-partner',
    partnerType: 'technology',
    website: 'https://example.com',
    description: 'Infrastructure partner category used for hosting, storage and deployment readiness.',
  },
  {
    name: 'Payment Partner',
    slug: 'payment-partner',
    partnerType: 'technology',
    website: 'https://example.com',
    description: 'Payment gateway partner category for fee collection and subscription billing.',
  },
  {
    name: 'Implementation Partner',
    slug: 'implementation-partner',
    partnerType: 'implementation',
    website: 'https://example.com',
    description: 'Regional implementation partner category for onboarding, migration and training.',
  },
  {
    name: 'Communication Partner',
    slug: 'communication-partner',
    partnerType: 'technology',
    website: 'https://example.com',
    description: 'Communication provider category for OTP, SMS, email and WhatsApp workflows.',
  },
];

async function findBySlug(strapi: StrapiApp, uid: string, slug: string) {
  return strapi.documents(uid as any).findFirst({ filters: { slug } as any });
}

async function createPublished(strapi: StrapiApp, uid: string, data: Record<string, unknown>) {
  return strapi.documents(uid as any).create({
    data: data as any,
    status: 'published',
  } as any);
}

async function seedCollection(strapi: StrapiApp, uid: string, items: Record<string, unknown>[]) {
  for (const item of items) {
    if (item.slug && await findBySlug(strapi, uid, item.slug as string)) continue;
    if (!item.slug && item.question) {
      const existing = await strapi.documents(uid as any).findFirst({
        filters: { question: item.question } as any,
      });
      if (existing) continue;
    }
    await createPublished(strapi, uid, item);
  }
}

async function seedSingleton(strapi: StrapiApp, uid: string, data: Record<string, unknown>) {
  const existing = await strapi.documents(uid as any).findFirst();
  if (existing) return;
  await createPublished(strapi, uid, data);
}

async function allowPublicRead(strapi: StrapiApp, uids: string[]) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) return;

  for (const uid of uids) {
    for (const action of [`${uid}.find`, `${uid}.findOne`]) {
      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: { action },
        populate: ['role'],
      });

      if (existing) {
        if (existing.role?.id !== publicRole.id) {
          await strapi.db.query('plugin::users-permissions.permission').update({
            where: { id: existing.id },
            data: { role: publicRole.id },
          });
        }
        continue;
      }

      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: publicRole.id,
        },
      });
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: StrapiApp }) {
    await seedSingleton(strapi, 'api::global-setting.global-setting', {
      siteName: 'Skolaroid',
      siteUrl: 'https://skolaroid.com',
      supportEmail: 'support@skolaroid.com',
      salesEmail: 'sales@skolaroid.com',
      defaultLocale: 'en',
      defaultCurrency: 'INR',
    });

    await seedSingleton(strapi, 'api::homepage.homepage', {
      hero: {
        eyebrow: 'Skolaroid School Management',
        title: 'One connected operating system for modern schools',
        description: 'Run admissions, students, attendance, finance, academics, communication and platform operations from a secure tenant-first engine.',
      },
      sections: {
        source: 'Strapi',
        erpnextOwns: ['Demo enquiries', 'Sales leads', 'Quotations', 'Customers', 'Hiring', 'Accounting', 'Invoices'],
      },
    });

    await seedCollection(strapi, 'api::product-module.product-module', productModules);
    await seedCollection(strapi, 'api::pricing-plan.pricing-plan', pricingPlans);
    await seedCollection(strapi, 'api::faq.faq', faqs.map(([category, question, answer], index) => ({
      category,
      question,
      answer,
      order: index + 1,
    })));
    await seedCollection(strapi, 'api::integration.integration', integrations.map(([title, category, availabilityStatus, description]) => ({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      availabilityStatus,
      description,
    })));
    await seedCollection(strapi, 'api::user-role.user-role', userRoles.map(([title, summary]) => ({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary,
      permissionsStory: `${title} permissions are controlled by the product backend and surfaced on the website as role guidance only.`,
    })));
    await seedCollection(strapi, 'api::blog-post.blog-post', blogPosts);
    await seedCollection(strapi, 'api::help-article.help-article', helpArticles);
    await seedCollection(strapi, 'api::career-content-section.career-content-section', careerSections);
    await seedCollection(strapi, 'api::legal-page.legal-page', legalPages);
    await seedCollection(strapi, 'api::customer.customer', customers);
    await seedCollection(strapi, 'api::testimonial.testimonial', testimonials);
    await seedCollection(strapi, 'api::case-study.case-study', caseStudies);
    await seedCollection(strapi, 'api::partner.partner', partners);

    await allowPublicRead(strapi, [
      'api::global-setting.global-setting',
      'api::homepage.homepage',
      'api::navigation.navigation',
      'api::footer.footer',
      'api::contact-information.contact-information',
      'api::seo-default.seo-default',
      'api::pricing-setting.pricing-setting',
      'api::website-announcement.website-announcement',
      'api::product-module.product-module',
      'api::product-feature.product-feature',
      'api::solution.solution',
      'api::user-role.user-role',
      'api::integration.integration',
      'api::pricing-plan.pricing-plan',
      'api::faq.faq',
      'api::blog-post.blog-post',
      'api::blog-category.blog-category',
      'api::author.author',
      'api::case-study.case-study',
      'api::customer.customer',
      'api::testimonial.testimonial',
      'api::partner.partner',
      'api::help-article.help-article',
      'api::help-category.help-category',
      'api::product-update.product-update',
      'api::team-member.team-member',
      'api::career-content-section.career-content-section',
      'api::legal-page.legal-page',
      'api::statistic.statistic',
      'api::media-asset.media-asset',
    ]);
  },
};
