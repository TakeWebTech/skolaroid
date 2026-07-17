# SMLS

SMLS is the production workspace for the School Management and Learning System.

Current state:

- `frontend/` contains the approved Figma Make React prototype.
- `backend/` contains the NestJS production API foundation.
- `docs/audit/` contains the completed frontend audit.
- `docs/product/` contains the initial product registries and module status.
- `worker/`, `packages/`, `infrastructure/`, `scripts/`, and `tests/` are reserved for production implementation.

## Commands

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
docker compose up -d postgres redis minio
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
| Platform Admin | `platform@smls.com` |

## Gate

Do not implement production features until the affected screen, action, API, permission, and test registry records are complete.
Demo school logins:
Platform admin: platform@smls.com
School admin: admin@demoschool.edu
Principal: principal@demoschool.edu
Teacher: teacher@demoschool.edu
Student: student@demoschool.edu
Parent: parent@demoschool.edu
Accountant: accountant@demoschool.edu
Password for all: Password123!