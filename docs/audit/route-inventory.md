# Route Inventory

Source: `frontend/src/app/router.tsx`

## Route Architecture

- Router uses `Routes` and `Route` from `react-router`.
- `/signin` renders outside `AppShell`.
- All other routes render inside `AppShell`.
- Index route redirects to `/teacher`.
- Catch-all route redirects to `/teacher`.
- No loaders, actions, guards, lazy loading, error elements, permission checks, or tenant checks were found.

## Metrics

- Total route declarations: 66
- User-facing concrete route paths: 64
- Redirect routes: 2 (`index`, `*`)
- Missing/dead route targets linked from hubs: at least 0 hard 404s because catch-all redirects, but several hub links point to self or generic placeholder modules.

## Routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/signin` | `SignIn` | Must be rewritten | Fake submit/SSO navigation only. |
| `/` | `Navigate` | Prototype interaction | Redirects to `/teacher`. |
| `/teacher` | `TeacherDashboard` | Prototype interaction | Mock data and navigation. |
| `/teacher/classes` | `TeacherClasses` | Prototype interaction | Mock classes; local navigation. |
| `/teacher/attendance` | `TakeAttendance` | Partially implemented | Local attendance state and toast save. |
| `/teacher/learning` | `TeacherLearning` | Prototype interaction | Static outline; publish/save toasts. |
| `/teacher/assessments` | `TeacherAssessments` | Prototype interaction | Mock assessment queue. |
| `/teacher/assessments/new` | `CreateAssignment` | Partially implemented | Wizard, no persistence. |
| `/teacher/assessments/grade` | `GradeSubmissions` | Partially implemented | Local grading state. |
| `/teacher/assessments/marks` | `EnterMarks` | Partially implemented | Local validation and lock state only. |
| `/teacher/messages` | `Messaging` | Prototype interaction | Static threads; local draft. |
| `/teacher/more` | `ModuleHub` | Visual only | Hub with mixed valid/self/generic links. |
| `/teacher/timetable` | `TimetablePage` | Visual only | Static timetable. |
| `/teacher/reports` | `Reports` | Prototype interaction | Static report actions. |
| `/student` | `StudentDashboard` | Prototype interaction | Mock student data. |
| `/student/learn` | `StudentLearn` | Prototype interaction | Continue toasts. |
| `/student/tasks` | `StudentTasks` | Prototype interaction | Upload toast. |
| `/student/timetable` | `TimetablePage` | Visual only | Static timetable. |
| `/student/results` | `ReportCard` | Prototype interaction | Static report card; download toast. |
| `/student/messages` | `Messaging` | Prototype interaction | Static messages. |
| `/parent` | `ParentDashboard` | Prototype interaction | Local active child. |
| `/parent/child` | `ModuleHub` | Visual only | Static child hub. |
| `/parent/attendance` | `AttendanceOverview` | Visual only | Static calendar. |
| `/parent/learning` | `StudentLearn` | Prototype interaction | Reused student prototype. |
| `/parent/results` | `ReportCard` | Prototype interaction | Static report card. |
| `/parent/fees` | `ParentFees` | Partially implemented | Simulated payment. |
| `/parent/leave` | `LeavePage` | Prototype interaction | Submit toast only. |
| `/parent/messages` | `Messaging` | Prototype interaction | Static messages. |
| `/admin` | `AdminDashboard` | Visual only | Static setup. |
| `/admin/people` | `StudentDirectory` | Prototype interaction | Client table over mock data. |
| `/admin/academics` | `AcademicSetup` | Partially implemented | Local subject/grade state. |
| `/admin/operations` | `ModuleHub` | Visual only | Hub links. |
| `/admin/communication` | `ModuleHub` | Visual only | Hub links. |
| `/admin/reports` | `Reports` | Prototype interaction | Static reports. |
| `/admin/settings` | `ModuleHub` | Visual only | Settings hub. |
| `/admin/users` | `UsersRoles` | Partially implemented | Local RBAC matrix. |
| `/principal` | `PrincipalDashboard` | Prototype interaction | Mock KPIs. |
| `/principal/academics` | `Reports` | Prototype interaction | Static report view. |
| `/principal/students` | `StudentDirectory` | Prototype interaction | Mock directory. |
| `/principal/staff` | `ModuleHub` | Visual only | Self/static links. |
| `/principal/finance` | `Reports` | Prototype interaction | Static report view. |
| `/principal/reports` | `Reports` | Prototype interaction | Static reports. |
| `/principal/approvals` | `Approvals` | Partially implemented | Local approve/reject only. |
| `/accountant` | `AccountantDashboard` | Prototype interaction | Mock finance KPIs. |
| `/accountant/fees` | `ModuleHub` | Visual only | Fee hub. |
| `/accountant/fees/setup` | `FeeSetup` | Partially implemented | Local setup wizard. |
| `/accountant/payments` | `CollectPayment` | Partially implemented | Fake receipt/payment. |
| `/accountant/reconciliation` | `Reconciliation` | Partially implemented | Local unmatched list. |
| `/accountant/reports` | `Reports` | Prototype interaction | Static reports. |
| `/accountant/settings` | `ModuleHub` | Visual only | Settings hub. |
| `/platform` | `PlatformDashboard` | Prototype interaction | Mock tenant table. |
| `/platform/schools` | `PlatformDashboard` | Prototype interaction | Same as platform. |
| `/platform/plans` | `ModuleHub` | Visual only | Self links. |
| `/platform/operations` | `ModuleHub` | Visual only | Static operations hub. |
| `/platform/support` | `ModuleHub` | Visual only | Static support hub. |
| `/platform/reports` | `Reports` | Prototype interaction | Static reports. |
| `/platform/settings` | `ModuleHub` | Visual only | Static settings hub. |
| `/admissions` | `Enquiries` | Prototype interaction | Mock enquiry board. |
| `/admissions/apply` | `ApplicantPortal` | Partially implemented | Local upload wizard. |
| `/admissions/review` | `ApplicationReview` | Partially implemented | Local decisions. |
| `/exams` | `ExamsList` | Prototype interaction | Mock exam list. |
| `/exams/setup` | `ExamSetup` | Partially implemented | Local setup wizard. |
| `/exams/results` | `ResultReview` | Partially implemented | Local publish confirmation. |
| `/operations/timetable` | `TimetablePage` | Visual only | Static timetable. |
| `/operations/library` | `ModuleHub` | Visual only | Self links. |
| `/operations/transport` | `ModuleHub` | Visual only | Self links. |
| `/communication/announce` | `Announcement` | Prototype interaction | Announcement toast/local only. |
| `/profile` | `Profile` | Partially implemented | Local preferences/static security controls. |
| `/states` | `StatesGallery` | Visual only | Developer state gallery. |
| `*` | `Navigate` | Dead route handling gap | Redirects to teacher, hides missing routes. |

