import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const text = (required = false) => ({ type: "string", required });
const rich = () => ({ type: "richtext" });
const uid = (target = "title") => ({ type: "uid", targetField: target, required: true });
const bool = (defaultValue = false) => ({ type: "boolean", default: defaultValue });
const integer = () => ({ type: "integer" });
const decimal = () => ({ type: "decimal" });
const date = () => ({ type: "date" });
const datetime = () => ({ type: "datetime" });
const email = () => ({ type: "email" });
const json = () => ({ type: "json" });
const media = (multiple = false) => ({ type: "media", multiple, allowedTypes: ["images", "files", "videos"] });
const enumeration = (values, defaultValue) => ({ type: "enumeration", enum: values, ...(defaultValue ? { default: defaultValue } : {}) });
const component = (componentName, repeatable = false) => ({ type: "component", component: componentName, repeatable });
const relation = (target, relationType = "manyToOne", inversedBy) => ({
  type: "relation",
  relation: relationType,
  target,
  ...(inversedBy ? { inversedBy } : {}),
});

const components = {
  "shared.seo": {
    metaTitle: text(),
    metaDescription: { type: "text" },
    canonicalUrl: text(),
    noIndex: bool(false),
    ogImage: media(false),
  },
  "shared.button": {
    label: text(true),
    href: text(true),
    variant: enumeration(["primary", "secondary", "outline", "ghost"], "primary"),
  },
  "shared.logo": {
    name: text(true),
    url: text(),
    image: media(false),
  },
  "shared.statistic": {
    label: text(true),
    value: text(true),
    helperText: text(),
  },
  "sections.hero": {
    eyebrow: text(),
    title: text(true),
    description: { type: "text" },
    image: media(false),
    primaryButton: component("shared.button"),
    secondaryButton: component("shared.button"),
  },
  "sections.cta": {
    title: text(true),
    description: { type: "text" },
    buttons: component("shared.button", true),
  },
  "sections.feature-grid": {
    eyebrow: text(),
    title: text(true),
    description: { type: "text" },
    features: json(),
  },
  "sections.screenshot": {
    title: text(),
    caption: text(),
    image: media(false),
  },
  "sections.testimonial": {
    quote: { type: "text", required: true },
    personName: text(true),
    personRole: text(),
    organisation: text(),
    avatar: media(false),
  },
  "sections.faq-group": {
    title: text(true),
    faqs: json(),
  },
  "sections.content-section": {
    eyebrow: text(),
    title: text(true),
    body: rich(),
    image: media(false),
    layout: enumeration(["text", "media-left", "media-right", "centered"], "text"),
  },
  "sections.product-tour-step": {
    title: text(true),
    body: { type: "text" },
    image: media(false),
    order: integer(),
  },
  "pricing.pricing-feature": {
    label: text(true),
    included: bool(true),
    note: text(),
  },
};

const singles = {
  "global-setting": {
    siteName: text(true),
    siteUrl: text(true),
    supportEmail: email(),
    salesEmail: email(),
    defaultLocale: text(),
    defaultCurrency: text(),
  },
  homepage: {
    seo: component("shared.seo"),
    hero: component("sections.hero"),
    sections: json(),
  },
  navigation: {
    items: json(),
  },
  footer: {
    columns: json(),
    copyrightText: text(),
    logos: component("shared.logo", true),
  },
  "contact-information": {
    email: email(),
    phone: text(),
    address: { type: "text" },
    businessHours: text(),
    socialLinks: json(),
  },
  "seo-default": {
    seo: component("shared.seo"),
  },
  "pricing-setting": {
    currency: text(),
    billingNote: { type: "text" },
    quoteDisclaimer: { type: "text" },
  },
  "website-announcement": {
    enabled: bool(false),
    message: text(),
    href: text(),
    startsAt: datetime(),
    endsAt: datetime(),
  },
};

const collections = {
  "product-module": {
    title: text(true),
    shortName: text(true),
    slug: uid("title"),
    tagline: text(),
    description: rich(),
    availabilityStatus: enumeration(["available", "beta", "planned"], "available"),
    iconName: text(),
    accentColor: text(),
    features: json(),
    problems: json(),
    benefits: json(),
    roles: json(),
    integrations: json(),
    faqs: json(),
    order: integer(),
    seo: component("shared.seo"),
  },
  "product-feature": {
    title: text(true),
    slug: uid("title"),
    summary: { type: "text" },
    availabilityStatus: enumeration(["available", "beta", "planned", "custom"], "planned"),
    module: relation("api::product-module.product-module"),
    details: rich(),
    order: integer(),
  },
  solution: {
    title: text(true),
    slug: uid("title"),
    audience: text(),
    summary: { type: "text" },
    points: json(),
    seo: component("shared.seo"),
  },
  "user-role": {
    title: text(true),
    slug: uid("title"),
    summary: { type: "text" },
    permissionsStory: rich(),
    relatedModules: relation("api::product-module.product-module", "manyToMany"),
  },
  integration: {
    title: text(true),
    slug: uid("title"),
    category: text(),
    availabilityStatus: enumeration(["available", "planned", "custom"], "planned"),
    description: { type: "text" },
  },
  "pricing-plan": {
    title: text(true),
    slug: uid("title"),
    tagline: text(),
    audience: text(),
    highlight: bool(false),
    basePrice: decimal(),
    billingCycle: enumeration(["monthly", "annual", "custom"], "custom"),
    features: component("pricing.pricing-feature", true),
    ctaLabel: text(),
  },
  faq: {
    question: text(true),
    answer: rich(),
    category: text(),
    order: integer(),
  },
  "blog-post": {
    title: text(true),
    slug: uid("title"),
    excerpt: { type: "text" },
    body: rich(),
    category: relation("api::blog-category.blog-category"),
    author: relation("api::author.author"),
    coverImage: media(false),
    publishedDate: date(),
    seo: component("shared.seo"),
  },
  "blog-category": {
    title: text(true),
    slug: uid("title"),
  },
  author: {
    name: text(true),
    slug: uid("name"),
    bio: { type: "text" },
    avatar: media(false),
  },
  "case-study": {
    title: text(true),
    slug: uid("title"),
    customer: relation("api::customer.customer"),
    challenge: rich(),
    solution: rich(),
    results: rich(),
    modulesUsed: relation("api::product-module.product-module", "manyToMany"),
    seo: component("shared.seo"),
  },
  customer: {
    name: text(true),
    slug: uid("name"),
    institutionType: text(),
    region: text(),
    website: text(),
    logo: media(false),
  },
  testimonial: {
    quote: { type: "text", required: true },
    personName: text(true),
    personRole: text(),
    organisation: text(),
    customer: relation("api::customer.customer"),
    approved: bool(false),
  },
  partner: {
    name: text(true),
    slug: uid("name"),
    partnerType: enumeration(["technology", "implementation", "referral", "reseller", "consultant"], "technology"),
    website: text(),
    logo: media(false),
    description: { type: "text" },
  },
  "help-article": {
    title: text(true),
    slug: uid("title"),
    body: rich(),
    category: relation("api::help-category.help-category"),
    order: integer(),
  },
  "help-category": {
    title: text(true),
    slug: uid("title"),
  },
  "product-update": {
    title: text(true),
    slug: uid("title"),
    releaseDate: date(),
    summary: { type: "text" },
    body: rich(),
    updateType: enumeration(["new", "improvement", "fix", "security"], "improvement"),
  },
  "team-member": {
    name: text(true),
    role: text(),
    bio: { type: "text" },
    photo: media(false),
    order: integer(),
  },
  "career-content-section": {
    title: text(true),
    slug: uid("title"),
    body: rich(),
    team: text(),
    order: integer(),
  },
  "legal-page": {
    title: text(true),
    slug: uid("title"),
    body: rich(),
    effectiveDate: date(),
    seo: component("shared.seo"),
  },
  statistic: {
    label: text(true),
    value: text(true),
    context: text(),
    verified: bool(false),
    sourceNote: text(),
  },
  "media-asset": {
    title: text(true),
    slug: uid("title"),
    asset: media(false),
    altText: text(),
    caption: text(),
    usageRights: text(),
  },
};

function singularName(uid) {
  return uid.replace(/-/g, " ");
}

function pluralName(uid) {
  const overrides = {
    "blog-category": "blog-categories",
    "case-study": "case-studies",
    "help-category": "help-categories",
  };
  if (overrides[uid]) return overrides[uid];
  return `${singularName(uid)}s`;
}

function writeJson(path, data) {
  mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(path, data) {
  mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, data);
}

function writeCoreApiFiles(uid) {
  const apiUid = `api::${uid}.${uid}`;
  writeText(
    join(root, "src", "api", uid, "controllers", `${uid}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreController('${apiUid}');\n`
  );
  writeText(
    join(root, "src", "api", uid, "routes", `${uid}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreRouter('${apiUid}');\n`
  );
  writeText(
    join(root, "src", "api", uid, "services", `${uid}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreService('${apiUid}');\n`
  );
}

for (const [uid, attributes] of Object.entries(components)) {
  const [category, name] = uid.split(".");
  writeJson(join(root, "src", "components", category, `${name}.json`), {
    collectionName: `components_${category}_${name.replace(/-/g, "_")}`,
    info: {
      displayName: singularName(name),
      icon: "layer",
    },
    attributes,
  });
}

for (const [uid, attributes] of Object.entries(singles)) {
  writeJson(join(root, "src", "api", uid, "content-types", uid, "schema.json"), {
    kind: "singleType",
    collectionName: uid.replace(/-/g, "_"),
    info: {
      singularName: uid,
      pluralName: pluralName(uid).replaceAll(" ", "-"),
      displayName: singularName(uid),
    },
    options: {
      draftAndPublish: true,
    },
    attributes,
  });
  writeCoreApiFiles(uid);
}

for (const [uid, attributes] of Object.entries(collections)) {
  writeJson(join(root, "src", "api", uid, "content-types", uid, "schema.json"), {
    kind: "collectionType",
    collectionName: uid.replace(/-/g, "_"),
    info: {
      singularName: uid,
      pluralName: pluralName(uid).replaceAll(" ", "-"),
      displayName: singularName(uid),
    },
    options: {
      draftAndPublish: true,
    },
    attributes,
  });
  writeCoreApiFiles(uid);
}

console.log(`Generated ${Object.keys(components).length} components, ${Object.keys(singles).length} single types and ${Object.keys(collections).length} collection types.`);
