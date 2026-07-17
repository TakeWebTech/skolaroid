# Route Inventory

Source: `src/app/router.tsx`. No route was marked complete unless code-level behavior was verified.

## Route Architecture

- Router: `BrowserRouter` in `src/app/App.tsx`.
- Route declarations: `Routes`/`Route` from `react-router`.
- `/signin` is outside `AppShell`.
- All other routes render inside `AppShell`.
- Index route redirects to `/teacher`.
- Catch-all route redirects to `/teacher`.
- No route loaders, actions, guards, lazy loading, or error elements were verified.

## Routes

| Route | Component | Classification | Verified behavior / risk |
| --- | --- | --- | --- |
| `/signin` | `SignIn` | Must be rewritten | Submit and SSO navigate to `/teacher`; no auth validation. |
| `/` | `Navigate` | Prototype interaction | Redirects to `/teacher`. |
| `/teacher` | `TeacherDashboard` | Prototype interaction | Dashboard from mock data; quick actions navigate. |
| `/teacher/classes` | `TeacherClasses` | Prototype interaction | Static class overview and computed rows. |
| `/teacher/attendance` | `TakeAttendance` | Partially implemented | Local attendance state; submit toast. |
| `/teacher/learning` | `TeacherLearning` | Prototype interaction | Static learning outline. |
| `/teacher/assessments` | `TeacherAssessments` | Prototype interaction | Mock grading list and action navigation. |
| `/teacher/assessments/new` | `CreateAssignment` | Partially implemented | Wizard UI; publish toast/navigation only. |
| `/teacher/assessments/grade` | `GradeSubmissions` | Partially implemented | Local grading queue behavior. |
| `/teacher/assessments/marks` | `EnterMarks` | Partially implemented | Local marks, absent toggles, simple range validation. |
| `/teacher/messages` | `Messaging` | Prototype interaction | Local draft send clears input/toast. |
| `/teacher/more` | `ModuleHub` | Visual only | Links to tools; some destinations are self/static hubs. |
| `/teacher/timetable` | `TimetablePage` | Visual only | Static timetable. |
| `/teacher/reports` | `Reports` | Prototype interaction | Static reports; preview toast. |
| `/student` | `StudentDashboard` | Prototype interaction | Mock tasks/classes/announcements. |
| `/student/learn` | `StudentLearn` | Prototype interaction | Continue buttons toast. |
| `/student/tasks` | `StudentTasks` | Visual only | Static task list. |
| `/student/timetable` | `TimetablePage` | Visual only | Static timetable. |
| `/student/results` | `ReportCard` | Visual only | Static result card. |
| `/student/messages` | `Messaging` | Prototype interaction | Local messaging only. |
| `/parent` | `ParentDashboard` | Prototype interaction | Active child local context; quick actions navigate. |
| `/parent/child` | `ModuleHub` | Visual only | Hub links. |
| `/parent/attendance` | `AttendanceOverview` | Visual only | Static calendar. |
| `/parent/learning` | `StudentLearn` | Prototype interaction | Reuses student learning prototype. |
| `/parent/results` | `ReportCard` | Visual only | Static result card. |
| `/parent/fees` | `ParentFees` | Partially implemented | Dialog and simulated payment timeout. |
| `/parent/leave` | `LeavePage` | Partially implemented | Form UI; submit toast only. |
| `/parent/messages` | `Messaging` | Prototype interaction | Local messaging only. |
| `/admin` | `AdminDashboard` | Visual only | Static setup progress. |
| `/admin/people` | `StudentDirectory` | Prototype interaction | Search/filter table over mock data. |
| `/admin/academics` | `AcademicSetup` | Partially implemented | Local subject/grade changes only. |
| `/admin/operations` | `ModuleHub` | Visual only | Hub links to operational prototypes. |
| `/admin/communication` | `ModuleHub` | Visual only | Hub links. |
| `/admin/reports` | `Reports` | Prototype interaction | Static reports. |
| `/admin/settings` | `ModuleHub` | Visual only | Users route works; integrations/audit self-link. |
| `/admin/users` | `UsersRoles` | Partially implemented | Local user/permission matrix only. |
| `/principal` | `PrincipalDashboard` | Prototype interaction | Mock KPIs and approval links. |
| `/principal/academics` | `Reports` | Prototype interaction | Static report view. |
| `/principal/students` | `StudentDirectory` | Prototype interaction | Mock directory. |
| `/principal/staff` | `ModuleHub` | Visual only | Staff links self/static. |
| `/principal/finance` | `Reports` | Prototype interaction | Static report view. |
| `/principal/reports` | `Reports` | Prototype interaction | Static report view. |
| `/principal/approvals` | `Approvals` | Prototype interaction | Approval/reject toasts or local state only. |
| `/accountant` | `AccountantDashboard` | Prototype interaction | Mock KPIs, dues, unmatched payments. |
| `/accountant/fees` | `ModuleHub` | Visual only | Fee hub; outstanding/concession self-link. |
| `/accountant/fees/setup` | `FeeSetup` | Partially implemented | Local fee-head editing; publish toast. |
| `/accountant/payments` | `CollectPayment` | Partially implemented | Local payment workflow; fake receipt. |
| `/accountant/reconciliation` | `Reconciliation` | Prototype interaction | Mock unmatched payments. |
| `/accountant/reports` | `Reports` | Prototype interaction | Static report view. |
| `/accountant/settings` | `ModuleHub` | Visual only | Settings self-links. |
| `/platform` | `PlatformDashboard` | Prototype interaction | Mock tenant table; open toast. |
| `/platform/schools` | `PlatformDashboard` | Prototype interaction | Same as platform dashboard. |
| `/platform/plans` | `ModuleHub` | Visual only | All links self route. |
| `/platform/operations` | `ModuleHub` | Visual only | Static platform operations hub. |
| `/platform/support` | `ModuleHub` | Visual only | Static support hub. |
| `/platform/reports` | `Reports` | Prototype interaction | Static report view. |
| `/platform/settings` | `ModuleHub` | Visual only | Settings self-links. |
| `/admissions` | `Enquiries` | Prototype interaction | Mock enquiry board; convert/call toasts. |
| `/admissions/apply` | `ApplicantPortal` | Partially implemented | Wizard with local uploads; submit navigates. |
| `/admissions/review` | `ApplicationReview` | Partially implemented | Local decision state updates. |
| `/exams` | `ExamsList` | Prototype interaction | Mock exam list; actions navigate. |
| `/exams/setup` | `ExamSetup` | Partially implemented | Local setup wizard; create toast/navigation. |
| `/exams/results` | `ResultReview` | Prototype interaction | Static checks/actions. |
| `/operations/timetable` | `TimetablePage` | Visual only | Static timetable. |
| `/operations/library` | `ModuleHub` | Visual only | Library actions self-link. |
| `/operations/transport` | `ModuleHub` | Visual only | Transport actions self-link. |
| `/communication/announce` | `Announcement` | Partially implemented | Form controls; publish/schedule toasts. |
| `/profile` | `Profile` | Partially implemented | Context preferences; security controls mostly static. |
| `/states` | `StatesGallery` | Prototype interaction | Demonstrates state components only. |
| `*` | `Navigate` | Prototype interaction | Redirects all unknown paths to `/teacher`; no 404 page. |

## Missing Or Risky Routes

- No protected route wrapper.
- No unauthorized route.
- No real 404 route.
- Many module hub items self-link instead of opening distinct workflows.
- Several domain flows imply missing detail routes: student profile, class detail, assignment detail, payment receipt, tenant detail, staff directory, library catalogue, transport route detail, report builder output.
