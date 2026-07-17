# Page Inventory

Source: `frontend/src/app/pages`

## Metrics

- Page files: 41
- Route-rendered page/hub instances: 64 concrete paths
- Visual only screens: 18
- Prototype interaction screens: 31
- Partially implemented screens: 14
- Must be rewritten screens: 1
- Production-ready screens: 0

## Classification

| Page file | Primary routes | Classification | Required production work |
| --- | --- | --- | --- |
| `global/signin.tsx` | `/signin` | Must be rewritten | Real auth, validation, errors, MFA/SSO/reset. |
| `global/profile.tsx` | `/profile` | Partially implemented | Persist preferences, session revocation, validation. |
| `global/states.tsx` | `/states` | Visual only | Keep as internal gallery only. |
| `teacher/dashboard.tsx` | `/teacher` | Prototype interaction | Real dashboard API and permissions. |
| `teacher/classes.tsx` | `/teacher/classes` | Prototype interaction | Real class roster APIs. |
| `teacher/attendance.tsx` | `/teacher/attendance` | Partially implemented | Persist attendance, audit, offline sync. |
| `teacher/learning.tsx` | `/teacher/learning` | Prototype interaction | LMS APIs and publishing workflow. |
| `teacher/assessments.tsx` | `/teacher/assessments` | Prototype interaction | Real assignment and grading queue. |
| `teacher/create-assignment.tsx` | `/teacher/assessments/new` | Partially implemented | Schema validation, draft/publish APIs. |
| `teacher/grade.tsx` | `/teacher/assessments/grade` | Partially implemented | Submission APIs and feedback persistence. |
| `teacher/marks.tsx` | `/teacher/assessments/marks` | Partially implemented | Mark rules, locking, audit, server validation. |
| `student/dashboard.tsx` | `/student` | Prototype interaction | Real student dashboard data. |
| `student/learn.tsx` | `/student/learn`, `/parent/learning` | Prototype interaction | Course/content APIs. |
| `student/tasks.tsx` | `/student/tasks` | Prototype interaction | Upload/submission workflow. |
| `parent/dashboard.tsx` | `/parent` | Prototype interaction | Guardian/student context APIs. |
| `parent/fees.tsx` | `/parent/fees` | Partially implemented | Payment gateway, receipts, idempotency. |
| `admin/dashboard.tsx` | `/admin` | Visual only | Real setup status. |
| `admin/academics.tsx` | `/admin/academics` | Partially implemented | Academic master APIs and validation. |
| `admin/users-roles.tsx` | `/admin/users` | Partially implemented | Server RBAC and audit. |
| `principal/dashboard.tsx` | `/principal` | Prototype interaction | Real KPIs and approvals API. |
| `principal/approvals.tsx` | `/principal/approvals` | Partially implemented | Transactional approval service. |
| `accountant/dashboard.tsx` | `/accountant` | Prototype interaction | Finance APIs. |
| `accountant/collect-payment.tsx` | `/accountant/payments` | Partially implemented | Ledger/payment/receipt service. |
| `accountant/fee-setup.tsx` | `/accountant/fees/setup` | Partially implemented | Fee plan versioning and publish workflow. |
| `accountant/reconciliation.tsx` | `/accountant/reconciliation` | Partially implemented | Bank/payment matching APIs. |
| `platform/dashboard.tsx` | `/platform`, `/platform/schools` | Prototype interaction | Tenant management APIs. |
| `admissions/enquiries.tsx` | `/admissions` | Prototype interaction | Enquiry APIs and communications. |
| `admissions/applicant-portal.tsx` | `/admissions/apply` | Partially implemented | Application, document, payment workflow. |
| `admissions/application-review.tsx` | `/admissions/review` | Partially implemented | Review decisions and audit. |
| `exams/exams.tsx` | `/exams` | Prototype interaction | Exam APIs. |
| `exams/exam-setup.tsx` | `/exams/setup` | Partially implemented | Exam setup versioning/validation. |
| `exams/result-review.tsx` | `/exams/results` | Partially implemented | Result publication authority. |
| `shared/module-hub.tsx` | many hub routes | Visual only | Replace self-links with implemented modules or hide. |
| `shared/messaging.tsx` | role message routes | Prototype interaction | Real messaging APIs. |
| `shared/timetable.tsx` | timetable routes | Visual only | Real timetable data and conflicts. |
| `shared/attendance-overview.tsx` | `/parent/attendance` | Visual only | Real attendance summary. |
| `shared/student-directory.tsx` | people/student routes | Prototype interaction | Server search, pagination, permissions. |
| `shared/report-card.tsx` | results routes | Prototype interaction | Immutable result APIs and PDF generation. |
| `shared/leave.tsx` | `/parent/leave` | Prototype interaction | Leave request workflow. |
| `shared/reports.tsx` | report routes | Prototype interaction | Report builder/export APIs. |
| `shared/announcement.tsx` | `/communication/announce` | Prototype interaction | Audience targeting and delivery APIs. |

