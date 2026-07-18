# Migration Plan

## Phase 0: Audit Approval Gate

Stop here until audit is reviewed and approved.

## Phase 1: Production Foundation

- Create root workspace structure without moving `Frontend/`.
- Add strict TypeScript, lint, typecheck, unit/component/E2E/a11y test scripts.
- Add CI and environment schema.
- Add root docs registries after approval.

## Phase 2: Auth, Session, Tenant, RBAC

- Implement NestJS auth module, sessions, refresh token rotation, MFA for privileged roles.
- Replace client role/context authority with server session context.
- Add route guards and permission-denied states.

## Phase 3: Data Contracts

- Define OpenAPI and typed API client.
- Add TanStack Query.
- Replace `mock-data.ts` imports module-by-module.
- Add loading/empty/error/offline states.

## Phase 4: Domain Workflows

Priority:

1. Student/person directory
2. Attendance
3. Assignments and LMS
4. Marks, exams, results
5. Fees, payments, receipts, reconciliation
6. Admissions
7. Messaging and announcements
8. Reports
9. Platform tenant control

## Phase 5: Hardening

- Tenant isolation tests.
- Authorization tests.
- Audit log tests.
- Backup/restore runbooks.
- Accessibility and responsive verification.
- Load tests for attendance, marks, payment, and reports.
