# State Management Audit

## Current State Model

`src/app/store/app-context.tsx` stores:

- `role`
- `experience`
- `context`
- `offline`
- `activeChild`
- `lang`

All values are in-memory React state. No value is loaded from an authenticated session, persisted preference API, tenant assignment API, or permission service.

## Page State

Many pages use local `useState` for workflow data:

- Attendance marks and dirty/saved state
- Marks and absent toggles
- Grading queue progress
- Parent fee dialog/payment simulation
- Fee setup heads/classes
- Academic grades/subjects
- Users/roles permission matrix
- Principal approvals
- Admissions uploads/review decisions
- Exam setup and result publication confirmation
- Messaging draft and selected thread

## Classification

Partially implemented for prototype interaction, must be rewritten for production authority.

## Production Gaps

- No TanStack Query or equivalent server-state layer.
- No API cache invalidation or optimistic update policy.
- No persistence for preferences.
- No route-level data loading.
- No tenant/branch/year scope from trusted server claims.
- No conflict handling for collaborative workflows.
- No offline queue despite an offline simulation toggle.

