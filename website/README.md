# Skolaroid Website + CMS

This folder contains the public website frontend and the Strapi CMS.

- `web_frontend/` - Next.js website
- `CMS/skolaroid-cms/` - Strapi content management system

## 1. Run Strapi CMS With Docker

We are self-hosting Strapi on our own infrastructure. We are not using Strapi Cloud.

Open a terminal from the website root:

```bash
cd /Users/himanshumathankar/Desktop/skolaroid/website
cp .env.cms.example .env
```

Edit `.env` and replace all `replace-*` values and database passwords with strong secrets.

Then start Strapi and Postgres:

```bash
docker compose --env-file .env -f docker-compose.cms.yml up --build
```

Strapi will run at:

```text
http://localhost:1337
```

The Docker setup runs:

- Strapi CMS
- Postgres database
- Persistent database volume
- Persistent upload volume

On first run, Strapi will ask you to create the admin user.

## 2. Optional: Run Strapi Without Docker For Local Development

Use this only for quick local development:

```bash
cd /Users/himanshumathankar/Desktop/skolaroid/website/CMS/skolaroid-cms
cp .env.example .env
npm install
npm run generate:schemas
npm run develop
```

Strapi will run at:

```text
http://localhost:1337
```

On first run, Strapi will ask you to create the admin user.

After login, you should see content types such as:

- Product Module
- Product Feature
- Pricing Plan
- FAQ
- Blog Post
- Case Study
- Testimonial
- Help Article
- Legal Page
- Homepage
- Navigation
- Footer

## 3. Create a Strapi API Token

In Strapi admin:

```text
Settings -> API Tokens -> Create new API Token
```

Use:

- Name: `Website frontend`
- Token type: `Read-only`
- Duration: `Unlimited` for local testing

Copy the token.

## 4. Run Next.js Website

Open a second terminal:

```bash
cd /Users/himanshumathankar/Desktop/skolaroid/website/web_frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=paste_your_strapi_api_token_here

ERPNEXT_URL=
ERPNEXT_API_KEY=
ERPNEXT_API_SECRET=
```

Then run:

```bash
npm install
npm run dev
```

Website will run at:

```text
http://localhost:3000
```

## 5. Test Without Strapi Content

The website has fallback static content.

So even if Strapi is empty, these pages should work:

```text
http://localhost:3000
http://localhost:3000/modules
http://localhost:3000/modules/attendance
http://localhost:3000/pricing
http://localhost:3000/demo
http://localhost:3000/contact
```

## 6. Test Strapi Content

Create a few records in Strapi:

### Product Module

Create one Product Module:

- Title: `Attendance Management`
- Short Name: `Attendance`
- Slug: `attendance`
- Tagline: `Accurate attendance for every class and period.`
- Features: add JSON array, for example:

```json
[
  "Period-wise attendance",
  "Parent absence alerts",
  "Teacher attendance",
  "Audit-ready attendance records"
]
```

Then refresh:

```text
http://localhost:3000/modules
http://localhost:3000/modules/attendance
```

The site should use Strapi content for that module.

### Pricing Plan

Create Pricing Plan records like:

- Foundation
- Growth
- Enterprise

Then refresh:

```text
http://localhost:3000/pricing
```

## 7. ERPNext Lead Testing

The website forms submit to local Next.js API routes:

```text
POST /api/demo-request
POST /api/contact
```

If ERPNext is not configured, the API returns success in development and logs the payload.

To connect ERPNext, set these in `web_frontend/.env.local`:

```env
ERPNEXT_URL=https://your-erpnext-domain.com
ERPNEXT_API_KEY=your_key
ERPNEXT_API_SECRET=your_secret
```

Then restart the Next.js dev server:

```bash
npm run dev
```

Test:

```text
http://localhost:3000/demo
http://localhost:3000/contact
```

Submissions should create ERPNext `Lead` records.

## 8. Build Check

Run this before deployment:

```bash
cd /Users/himanshumathankar/Desktop/skolaroid/website/web_frontend
npm run typecheck
npm run build
```

Expected:

- Typecheck passes
- Build completes successfully

## 9. Server Deployment Notes

For your own infrastructure:

- Put Strapi behind Nginx, Caddy or Traefik.
- Use HTTPS.
- Use Postgres, not SQLite, in production.
- Keep `CMS_DB_PASSWORD`, `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT` and `TRANSFER_TOKEN_SALT` secret.
- Back up the Postgres volume.
- Back up `strapi_uploads`.
- Do not install or use Strapi Cloud plugin.

Useful Docker commands:

```bash
docker compose --env-file .env -f docker-compose.cms.yml up -d --build
docker compose --env-file .env -f docker-compose.cms.yml logs -f strapi
docker compose --env-file .env -f docker-compose.cms.yml down
```

If Docker keeps using an old dependency layer after package changes, rebuild without cache:

```bash
docker compose --env-file .env -f docker-compose.cms.yml build --no-cache strapi
docker compose --env-file .env -f docker-compose.cms.yml up
```

## 10. Important Notes

- Strapi controls website content.
- ERPNext controls demo enquiries, sales leads, quotations, customers, accounting and invoicing.
- Frappe HR should control job openings and hiring applications.
- The Next.js site currently falls back to static content if Strapi is unavailable.
- Do not put ERPNext API secrets in `NEXT_PUBLIC_*` variables.
