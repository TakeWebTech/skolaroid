# Skolaroid

Skolaroid is the production workspace for the School Management and Learning System.

Current state:

- `Frontend/` contains the approved Figma Make React prototype.
- `backend/` contains the NestJS production API foundation.
- `website/web_frontend/` contains the public Next.js website.
- `website/CMS/skolaroid-cms/` contains the Strapi CMS for website content.
- `docs/audit/` contains the completed frontend audit.
- `docs/product/` contains the initial product registries and module status.
- `worker/`, `packages/`, `infrastructure/`, `scripts/`, and `tests/` are reserved for production implementation.

## Development Setup

Use Node 22+ and pnpm 11+ for the core engine. The website and Strapi CMS use npm inside their own folders.

### 1. Install Core Engine Dependencies

From the project root:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid
pnpm install
```

### 2. Start Core Engine Infrastructure

Start the local services used by the backend:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid
docker compose up -d postgres redis minio
```

### 3. Prepare Core Backend

Run Prisma migrations and seed the development demo school:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid
pnpm backend:prisma:generate
pnpm backend:migrate:deploy
pnpm backend:seed:dev
```

Start the backend API:

```sh
pnpm backend:dev
```

Backend runs at:

```text
http://localhost:3001
```

### 4. Start Core Engine Frontend

Open a second terminal:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid
pnpm frontend:dev
```

Core engine UI runs at:

```text
http://localhost:5173
```

The core engine frontend is:

```text
/Users/himanshumathankar/Desktop/skolaroid/Frontend
```

### 5. Start Website Strapi CMS

The public website reads content from local Strapi. We self-host Strapi; Strapi Cloud is not used.

Open a third terminal:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid/website
cp .env.cms.example .env
docker compose --env-file .env -f docker-compose.cms.yml up --build
```

Strapi runs at:

```text
http://localhost:1337
```

On first run, create the Strapi admin user in the browser. Then create a read-only API token:

```text
Settings -> API Tokens -> Create new API Token
```

Use that token in the website `.env.local`.

### 6. Start Public Website Frontend

Open a fourth terminal:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid/website/web_frontend
cp .env.example .env.local
```

Edit `website/web_frontend/.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=paste_your_strapi_api_token_here

ERPNEXT_URL=
ERPNEXT_API_KEY=
ERPNEXT_API_SECRET=
```

Then run:

```sh
npm install
npm run dev
```

Public website runs at:

```text
http://localhost:3000
```

The public website frontend is:

```text
/Users/himanshumathankar/Desktop/skolaroid/website/web_frontend
```

### 7. Verify Website And Strapi Connection

Open:

```text
http://localhost:3000
http://localhost:3000/modules
http://localhost:3000/pricing
http://localhost:3000/blog
http://localhost:3000/help
```

The website uses Strapi when `STRAPI_URL` or `NEXT_PUBLIC_STRAPI_URL` is set. If Strapi is unavailable or empty, the website falls back to static content so local builds do not break.

Run a production build check:

```sh
cd /Users/himanshumathankar/Desktop/skolaroid/website/web_frontend
npm run build
```

## Core Engine Commands

```sh
pnpm frontend:dev
pnpm frontend:build
pnpm backend:dev
pnpm backend:build
pnpm backend:test
pnpm backend:typecheck
pnpm backend:prisma:validate
pnpm backend:migrate:deploy
pnpm backend:migrate:status
pnpm backend:seed:dev
pnpm audit:check
```

Local development sign-ins after `pnpm backend:seed:dev`:

All use password `Password123!`.

| Role | Email |
| --- | --- |
| Teacher | `teacher@demoschool.edu` |
| Student | `student@demoschool.edu` |
| Parent | `parent@demoschool.edu` |
| School Admin | `admin@demoschool.edu` |
| Principal | `principal@demoschool.edu` |
| Accountant | `accountant@demoschool.edu` |
| Platform Admin | `platform@skolaroid.com` |

## Gate

Do not implement production features until the affected screen, action, API, permission, and test registry records are complete.
