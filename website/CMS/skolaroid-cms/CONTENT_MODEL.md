# Skolaroid Website Content Model

## Ownership

- Next.js owns rendering, routing and frontend experience.
- Strapi owns editable website content: pages, product modules, pricing presentation, blog, help, SEO, testimonials and case studies.
- ERPNext owns business operations: demo enquiries, sales leads, sales follow-up, quotations, customers, accounting and invoicing.
- ERPNext/Frappe HR owns hiring applications and job openings.

## Strapi Single Types

- Global Settings
- Homepage
- Navigation
- Footer
- Contact Information
- SEO Defaults
- Pricing Settings
- Website Announcement

## Strapi Collection Types

- Product Module
- Product Feature
- Solution
- User Role
- Integration
- Pricing Plan
- FAQ
- Blog Post
- Blog Category
- Author
- Case Study
- Customer
- Testimonial
- Partner
- Help Article
- Help Category
- Product Update
- Team Member
- Career Content Section
- Legal Page
- Statistic
- Media Asset

## Reusable Components

- Hero
- CTA
- Feature Grid
- Screenshot
- Testimonial
- FAQ Group
- SEO
- Button
- Statistic
- Logo
- Content Section
- Product Tour Step
- Pricing Feature

## ERPNext Handoff

The website frontend posts to local Next.js API routes:

- `POST /api/demo-request` creates an ERPNext Lead for demo enquiries.
- `POST /api/contact` creates an ERPNext Lead for sales/support/general enquiries.

Set these environment variables in the Next.js app:

- `ERPNEXT_URL`
- `ERPNEXT_API_KEY`
- `ERPNEXT_API_SECRET`

## Strapi Frontend Connection

The Next.js app reads from Strapi when `STRAPI_URL` or `NEXT_PUBLIC_STRAPI_URL` is set. If Strapi has no content yet, the site falls back to static content so builds do not break.
