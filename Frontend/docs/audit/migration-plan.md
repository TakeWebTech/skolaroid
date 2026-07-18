# Migration Plan

Goal: Convert the Figma Make Skolaroid prototype into a production application without losing useful UI work.

## Phase 0: Freeze Prototype Boundaries

Classification: Reusable for production / Must be rewritten split

- Keep UI primitives, shell layout, semantic tokens, and state components.
- Mark all mock data and page-local workflow state as prototype-only.
- Remove or gate role switcher before any production preview.
- Add lint, typecheck, test, and CI scripts.
- Add route-level 404 and unauthorized pages.

## Phase 1: Product And Domain Contracts

Classification: Must be rewritten

- Define canonical entities: tenant, school, branch, academic year, user, role, permission, student, guardian, staff, class, subject, timetable, attendance, assignment, submission, mark, exam, fee head, invoice, payment, concession, receipt, admission enquiry, application, document, message, announcement, report.
- Define API contracts and error models for each domain.
- Define audit requirements for attendance, marks, fees, approvals, auth, role changes, and tenant operations.
- Define offline requirements separately from the current offline banner.

## Phase 2: Auth, RBAC, And Tenant Isolation

Classification: Must be rewritten

- Implement real sign-in, SSO, session refresh, sign-out, password reset, and optional MFA.
- Enforce route guards in the client and authorization on the server.
- Replace client role switcher with authenticated active-role/session context.
- Scope every query and mutation by tenant/school/branch/year.
- Add permission-denied flows to protected routes.

## Phase 3: Data Layer

Classification: Must be rewritten

- Introduce typed API client and server-state library.
- Replace `mock-data.ts` imports page by page.
- Add loading, empty, error, retry, and permission states to real queries.
- Add pagination, search, sort, and filter contracts for large tables.
- Keep fixtures only for tests/story examples.

## Phase 4: Forms And Validation

Classification: Partially implemented to reusable

- Standardize on schema-driven forms using existing `react-hook-form` wrappers or a chosen form stack.
- Add client and server validation for every form.
- Add field IDs, associated labels, error messages, disabled/submitting states, and dirty-state protection.
- Add idempotency keys for payments, admissions, marks submission, attendance, announcements, and approvals.

## Phase 5: Domain Workflow Replacement

Classification: Must be rewritten

Priority order:

1. Authentication/session/roles.
2. Student directory and school context.
3. Attendance taking and audit logs.
4. Fee setup, invoice/due ledger, payment gateway, receipts, reconciliation.
5. Exams, marks entry, result approval/publication.
6. Admissions enquiry/application/document workflow.
7. Messaging and announcements.
8. Reports and analytics.
9. Platform tenant management.

## Phase 6: Accessibility And Responsive Hardening

Classification: Reusable for production with hardening

- Run keyboard-only audit on every route.
- Add axe checks to CI.
- Fix label associations and custom button `type` attributes.
- Add route-change focus management.
- Verify mobile tables/forms at common viewport widths.
- Add contrast checks for semantic status tokens.

## Phase 7: Testing And Release Readiness

Classification: Must be rewritten where absent

- Unit test shared components and helpers.
- Integration test forms and route guards.
- E2E test critical flows: sign-in, role-restricted navigation, attendance submit, marks submit, parent payment, admission application, exam setup, approval.
- Add build, test, lint, typecheck, preview smoke checks in CI.
- Add observability: error reporting, analytics, performance metrics, audit logs.
- Add deployment environment configuration and secret management.

## Retain vs Rewrite

Retain:

- `src/app/components/ui`
- `src/app/components/shared` with accessibility hardening
- `src/styles/theme.css`
- general shell layout from `AppShell`
- route/page names as product discovery artifacts

Rewrite:

- auth and sign-in
- role and permission model
- all mock data access
- all payment/fee logic
- admissions document upload/submission
- attendance and marks persistence
- messaging/notifications
- reporting data pipeline
- platform tenant management

## First Production Milestone

A credible first production milestone should include:

- Real auth and tenant-scoped role loading.
- Protected shell routes.
- Student directory backed by API.
- One end-to-end workflow, preferably attendance, with validation, persistence, loading/error states, and audit log.
- CI with build, typecheck, lint, unit tests, and one E2E smoke test.
