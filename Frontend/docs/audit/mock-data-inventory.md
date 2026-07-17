# Mock Data Inventory

Primary source: `src/app/lib/mock-data.ts`. Additional page-local mock constants were found across page files.

## Central Mock Data

| Export | Classification | Used for |
| --- | --- | --- |
| `SCHOOL` | Must be rewritten | School identity, branch, year, currency. |
| `AVATAR_COLORS`, `colorFor`, `initials` | Reusable for production | Display helpers; can remain with tested behavior. |
| `CLASSES` | Must be rewritten | Class options across teacher/admin/exams. |
| `STUDENTS` | Must be rewritten | Student directory, attendance, marks, dues, avatars. Contains generated names, phones, statuses. |
| `TEACHER_TODAY_CLASSES` | Must be rewritten | Teacher dashboard/classes. |
| `PENDING_GRADING` | Must be rewritten | Teacher assessment queue. |
| `ANNOUNCEMENTS` | Must be rewritten | Dashboards and notices. |
| `STUDENT_TASKS` | Must be rewritten | Student dashboard/tasks. |
| `TIMETABLE` | Must be rewritten | Timetable views. |
| `RESULTS` | Must be rewritten | Report cards. |
| `CHILDREN` | Must be rewritten | Parent active-child context. |
| `FEE_INSTALLMENTS` | Must be rewritten | Parent fee/payment view. |
| `PRINCIPAL_KPIS` | Must be rewritten | Principal dashboard. |
| `APPROVALS` | Must be rewritten | Principal approvals. |
| `ACCOUNTANT_KPIS` | Must be rewritten | Accountant dashboard. |
| `DUES` | Must be rewritten | Derived finance dues. |
| `UNMATCHED_PAYMENTS` | Must be rewritten | Reconciliation. |
| `ENQUIRIES`, `ENQUIRY_STAGES` | Must be rewritten | Admissions board. |
| `EXAMS` | Must be rewritten | Exam list. |
| `TENANTS` | Must be rewritten | Platform dashboard. |
| `NOTIFICATIONS` | Must be rewritten | Notification sheet. |

## Page-Local Mock Data

| File | Data | Classification | Notes |
| --- | --- | --- | --- |
| `shared/leave.tsx` | Leave `HISTORY` | Must be rewritten | Static leave records. |
| `shared/attendance-overview.tsx` | Generated `MONTH` | Must be rewritten | Static attendance calendar. |
| `shared/reports.tsx` | `CURATED`, `TREND` | Must be rewritten | Static analytics. |
| `shared/messaging.tsx` | `THREADS`, `MESSAGES` | Must be rewritten | Static messages. |
| `shared/announcement.tsx` | `AUDIENCES` | Must be rewritten | Static audience counts. |
| `teacher/marks.tsx` | `ROSTER`, `MAX` | Partially implemented | Derived roster and fixed max marks. |
| `teacher/attendance.tsx` | `CLASS_ROSTER`, status metadata | Partially implemented | Derived roster and local status state. |
| `teacher/grade.tsx` | `QUEUE` | Must be rewritten | Derived grading queue. |
| `teacher/learning.tsx` | `OUTLINE` | Must be rewritten | Static lesson outline. |
| `student/learn.tsx` | `COURSES` | Must be rewritten | Static course progress. |
| `parent/dashboard.tsx` | `ALERTS` | Must be rewritten | Static parent alerts. |
| `admin/dashboard.tsx` | `SETUP` | Must be rewritten | Static onboarding checklist. |
| `admin/academics.tsx` | `INITIAL_GRADES`, `INITIAL_SUBJECTS` | Partially implemented | Local editable academic setup. |
| `admin/users-roles.tsx` | `USERS`, `MODULES`, `ROLES`, permission metadata | Partially implemented | Local RBAC matrix only. |
| `principal/dashboard.tsx` | `ATT_TREND`, risk tone metadata | Must be rewritten | Static trend data. |
| `accountant/collect-payment.tsx` | `CANDIDATES`, `DUES`, `METHODS` | Must be rewritten | Payment workflow data. |
| `accountant/fee-setup.tsx` | `DEFAULT_HEADS`, `INSTALLMENTS` | Partially implemented | Local fee setup. |
| `admissions/applicant-portal.tsx` | `DOCS` | Partially implemented | Document checklist; upload is local. |
| `admissions/application-review.tsx` | `APPLICATIONS`, `DOC_CHECKLIST`, tones | Partially implemented | Local admissions decisions. |
| `exams/exam-setup.tsx` | `SUBJECTS`, `GRADE_BANDS` | Partially implemented | Local exam setup. |
| `exams/result-review.tsx` | `CHECKS`, icon metadata | Must be rewritten | Static review checklist. |

## Data Risks

- Domain data is bundled into the client and visible to anyone with the app.
- IDs, phone numbers, guardian names, fees, tenants, and payment references are fake but shaped like sensitive records.
- Dates are strings, not normalized date objects or API schema fields.
- Currency formatting is simple string interpolation for INR.
- Derived data is computed directly in modules and cannot reflect backend truth.

## Replacement Direction

- Define typed API contracts per domain.
- Replace mock exports with data hooks/services.
- Move fixture data into tests and story fixtures only.
- Use schema validation for API responses and form submissions.
- Model tenant, branch, academic year, role, and permission scope server-side.
