# Mock Data Inventory

Primary source: `frontend/src/app/lib/mock-data.ts`

## Central Mock Exports

All domain data below must be replaced by APIs or moved to test fixtures:

- `SCHOOL`
- `CLASSES`
- `STUDENTS`
- `TEACHER_TODAY_CLASSES`
- `PENDING_GRADING`
- `ANNOUNCEMENTS`
- `STUDENT_TASKS`
- `TIMETABLE`
- `RESULTS`
- `CHILDREN`
- `FEE_INSTALLMENTS`
- `PRINCIPAL_KPIS`
- `APPROVALS`
- `ACCOUNTANT_KPIS`
- `DUES`
- `UNMATCHED_PAYMENTS`
- `ENQUIRIES`
- `ENQUIRY_STAGES`
- `EXAMS`
- `TENANTS`
- `NOTIFICATIONS`

Reusable display helpers with tests:

- `AVATAR_COLORS`
- `colorFor`
- `initials`

## Page-Local Mock Data

Page-local constants exist in attendance, marks, learning, dashboards, admissions, exams, reports, messaging, announcements, fee setup, and approval flows.

## Risks

- Mock data is bundled client-side.
- Fake PII, tenant, finance, result, and notification records shape sensitive workflows.
- Derived business logic lives in UI files.
- Receipt numbers use `Math.random` in the collection flow.

