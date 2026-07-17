# Module Status

Audit approval date: 2026-07-15

## Current Status

| Module | UI status | Registry status | Production status |
| --- | --- | --- | --- |
| Auth | Prototype | Registered | Must be rewritten |
| Shell/navigation | Prototype | Partially registered | Must be rewritten for auth/RBAC |
| Teacher | Prototype/partial | Registered | Not production-ready |
| Student | Prototype | Registered | Not production-ready |
| Parent | Prototype/partial | Registered | Not production-ready |
| Admin | Prototype/partial | Registered | Not production-ready |
| Principal | Prototype/partial | Registered | Not production-ready |
| Accountant/fees | Prototype/partial | Registered | Not production-ready |
| Platform control centre | Prototype | Registered | Not production-ready |
| Admissions | Prototype/partial | Registered from prior registry | Not production-ready |
| Exams/results | Prototype/partial | Registered from prior registry | Not production-ready |
| Operations | Visual hubs | Registered | Not production-ready |
| Communication | Prototype | Registered | Not production-ready |
| Reports | Prototype | Registered through routed module records | Not production-ready |

## Global Blockers

- Backend foundation exists with a versioned NestJS health endpoint.
- Database does not exist.
- No real auth/session/RBAC/tenant isolation.
- No production APIs.
- No tests, lint, or typecheck scripts.
- Root workspace package structure is not yet created.
- Product registries cover all current route instances, but action-level coverage still needs module-by-module hardening before implementation claims completion.

## Next Approved Work

1. Harden action records module by module as each production slice begins.
2. Implement auth/session/tenant/RBAC before sensitive domain workflows.
3. Add database schema and migration discipline for tenant-aware identity foundations.

## Verified Foundation

- Backend package: `backend/`
- Versioned health endpoint: `GET /api/v1/health`
- Auth login endpoint: `POST /api/v1/auth/login`
- Auth refresh endpoint: `POST /api/v1/auth/refresh`
- Auth logout endpoint: `POST /api/v1/auth/logout`
- Auth current user endpoint: `GET /api/v1/auth/me`
- Auth active context endpoint: `POST /api/v1/auth/context`
- Permission-protected capability checks under `/api/v1/auth/capabilities/*`
- Prisma identity schema and initial migration: `backend/prisma/`
- OpenAPI docs path: `/api/docs`
- Verified commands:
  - `pnpm --dir backend prisma:validate`
  - `pnpm --dir backend exec prisma migrate deploy`
  - `pnpm --dir backend exec prisma migrate status`
  - `pnpm backend:typecheck`
  - `pnpm backend:test`
  - `pnpm backend:build`
  - compiled runtime smoke on `http://127.0.0.1:3100/api/v1/health` returned database `ok`
  - compiled runtime smoke verified login DTO validation on `POST /api/v1/auth/login`
  - compiled runtime smoke verified login, refresh rotation, old refresh rejection, logout, and post-logout refresh rejection
  - compiled runtime smoke verified login followed by protected `/api/v1/auth/me`
  - compiled runtime smoke verified teacher attendance allowed, student teacher/admin/finance denied, admin admin allowed, accountant finance allowed

## Auth Foundation

Implemented auth foundations:

- Argon2id password hashing and verification.
- Server-side login lookup by email or phone for active users only.
- Active tenant membership requirement.
- Session row creation with hashed refresh token and refresh-token family hash.
- Refresh-token rotation.
- Logout/session revocation.
- JWT access token creation with session and tenant claims.
- Server-authorized role and permission response derived from persisted memberships.
- Frontend sign-in submission to the real backend.
- Frontend logout calls server revocation with local fallback.
- Frontend protected route guard verifies the server session through `/auth/me`.
- Frontend role and school/branch context hydrate from server-authorized session data.
- Frontend navigation filters permission-marked entries using server-returned permissions.
- Server-side `@RequirePermission(...)` decorator and `PermissionGuard` enforce protected routes.
- Server-side active tenant/branch context is read from the session and can be switched only to assigned memberships.

Not yet implemented:

- MFA challenge flow.
- Automatic frontend access-token refresh on protected API calls.
- Real domain APIs beyond auth/capability probes.

## Attendance Foundation

Implemented production attendance foundations:

- Prisma tables for classes, student profiles, enrollments, attendance sessions, and attendance records.
- Tenant-aware indexes and foreign keys for attendance access paths.
- `GET /api/v1/attendance/classes`
- `POST /api/v1/attendance/classes/:classId/session`
- `PUT /api/v1/attendance/sessions/:sessionId/draft`
- `POST /api/v1/attendance/sessions/:sessionId/submit`
- `attendance.mark` permission enforced by `PermissionGuard`.
- Active tenant/branch context required for all attendance APIs.
- Tenant isolation checks on class/session lookups.
- Student enrollment validation before saving records.
- Audit events for draft save and submit.
- Submitted sessions are locked against later edits.
- Teacher attendance frontend now loads classes/roster/session from the API and saves/submits to the backend.

Verified:

- `pnpm backend:migrate:deploy`
- `pnpm backend:seed:dev`
- `pnpm backend:migrate:status`
- `pnpm backend:typecheck`
- `pnpm backend:test`
- `pnpm backend:build`
- `pnpm frontend:build`
- Live smoke: teacher can list class 7B, create session, save draft, submit attendance, audit events are written, student receives `403`.

## Student Directory Foundation

Implemented first production student/person directory slice:

- `GET /api/v1/people/students`
- `POST /api/v1/people/students`
- `students.view` permission enforced by `PermissionGuard`.
- `students.create` permission enforced by `PermissionGuard`.
- Active tenant/branch context required.
- Student list is scoped to the active tenant and branch.
- Optional server-side search by student name or admission number.
- Optional server-side class filter.
- Response includes student profile identity plus active enrollment class/roll data.
- Student creation creates a student profile and active class enrollment in one server-side operation.
- Student creation validates admission number uniqueness, class tenancy, and roll-number uniqueness within class.
- Admin and principal student directory screens load from the backend instead of `mock-data.ts`.
- Admin student directory can create enrolled students through the backend.
- Profile-opening action remains disabled until profile/detail APIs are implemented.

Verified:

- `pnpm backend:test`
- `pnpm backend:typecheck`
- `pnpm backend:build`
- `pnpm frontend:build`

## Academic Setup Foundation

Implemented first production academic setup slice:

- `GET /api/v1/academic-structure`
- `POST /api/v1/academic-structure/classes`
- `academics.manage` permission enforced by `PermissionGuard`.
- Active tenant/branch context required.
- Class creation persists tenant-scoped class code, name, primary subject, and room.
- Class creation rejects duplicate class codes in the same tenant/branch.
- Academic class creation writes an audit event.
- Admin academic setup screen now creates and lists backend classes.

Verified:

- `pnpm backend:typecheck`
- `pnpm backend:test`
- `pnpm backend:build`
- `pnpm frontend:build`
- `pnpm audit:check`

## Platform Provisioning Foundation

Implemented first production platform provisioning slice:

- Prisma tables for platform tenant profiles, platform plans, and platform subscriptions.
- `GET /api/v1/platform/tenants`
- `GET /api/v1/platform/tenants/organization-id-suggestion`
- `POST /api/v1/platform/tenants`
- `GET /api/v1/platform/plans`
- `POST /api/v1/platform/plans`
- `platform.tenants.view`, `platform.tenants.create`, `platform.plans.view`, and `platform.plans.manage` permissions enforced by `PermissionGuard`.
- Platform create-school form now provisions real tenant, main branch, profile, optional subscription, and audit event.
- Platform create-plan form now persists real plans and audit events.
- Platform schools and plan catalog pages now load backend data instead of mock plan/school rows.

Verified:

- `pnpm backend:prisma:validate`
- `pnpm backend:prisma:generate`
- `pnpm backend:typecheck`
- `pnpm backend:test`
- `pnpm backend:build`
- `pnpm backend:migrate:deploy`
- `pnpm backend:seed:dev`
- `pnpm backend:migrate:status`
- `pnpm frontend:build`
- `pnpm audit:check`

## Assignments/Homework Foundation

Implemented first production assignments slice:

- Prisma tables for assignments and assignment submissions.
- `GET /api/v1/assignments`
- `POST /api/v1/assignments`
- `POST /api/v1/assignments/{id}/publish`
- `GET /api/v1/assignments/tasks/me`
- `POST /api/v1/assignments/submissions/{id}/submit`
- `GET /api/v1/assignments/submissions/grade-queue`
- `POST /api/v1/assignments/submissions/{id}/grade`
- `assignments.create`, `tasks.submit`, and `submissions.grade` permissions enforced by `PermissionGuard`.
- Publishing creates assignment submissions for active class enrollments.
- Student task list, text submission, teacher assignment list, publish, and grade queue now use backend APIs.
- Audit events are written for assignment create, publish, submit, and grade.

Known limitation:

- Student user to student profile linking is currently resolved through seeded display-name matching. This is recorded in `docs/decisions/open-conflicts.md`.

Verified:

- `pnpm backend:prisma:generate`
- `pnpm backend:prisma:validate`
- `pnpm backend:typecheck`
- `pnpm backend:test`
- `pnpm backend:build`
- `pnpm frontend:build`
- `pnpm audit:check`
- `pnpm backend:migrate:deploy`
- `pnpm backend:seed:dev`
- `pnpm backend:migrate:status`
