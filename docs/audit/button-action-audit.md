# Button And Action Audit

Scope: buttons, links, tabs, submits, row actions, toasts, local state actions, search/filter controls, upload/download/export controls.

## Metrics

- Interactive action instances found by source search: 120+
- Production-ready actions: 0
- Toast-only or toast-dominant actions: 35+
- Local-state-only workflow actions: 45+
- Navigation-only prototype actions: 30+
- Sensitive actions missing backend permission checks: all sensitive actions

## Global Shell

| Action | Classification | Missing production requirements |
| --- | --- | --- |
| Sidebar/bottom navigation | Prototype interaction | Server-authorized nav and route guards. |
| Context switcher | Must be rewritten | Authorized context API, reload scoped data, audit. |
| Role switcher | Must be rewritten | Remove or restrict to assigned server roles. |
| Experience switcher | Partially implemented | Persist preference. |
| Global search | Prototype interaction | Search API, result permissions, error/loading states. |
| Notifications open/mark read | Prototype interaction | Notification API, read status persistence. |
| Help/support request | Prototype interaction | Support case API. |
| Sign out | Must be rewritten | Session revocation. |

## Sensitive Domain Actions

None are production-ready. Attendance submit, marks submit, fee payment, receipt print/send, reconciliation match, fee plan publish, academic structure save, RBAC changes, approvals, admissions decisions, exam creation, result publication, announcements, downloads, uploads, and exports all lack server-side enforcement, validation, audit, persistence, and tests.

## Common Missing States

- Loading
- Submission disabled while pending
- Server error display
- Permission denied
- Empty result handling for API data
- Retry
- Idempotency for mutations
- Audit event confirmation where sensitive

