# Component Inventory

Source: `src/app/components`, `src/app/pages`, `src/app/lib`.

## Application Components

| Component | File | Classification | Notes |
| --- | --- | --- | --- |
| `App` | `src/app/App.tsx` | Reusable for production | Provider/router/toaster composition; needs auth/data providers. |
| `AppRouter` | `src/app/router.tsx` | Partially implemented | Complete route map for prototype; lacks guards/loaders/errors. |
| `AppProvider`/`useApp` | `src/app/store/app-context.tsx` | Partially implemented | In-memory app preferences/role state. |

## Shell Components

| Component | Classification | Notes |
| --- | --- | --- |
| `AppShell` | Reusable for production | Responsive chrome; remove demo role switcher for production. |
| `Brand` | Reusable for production | Static Skolaroid brand. |
| `SidebarLink`, `BottomLink`, `MoreSheet`, `MobileMenu` | Reusable for production | Navigation wrappers. |
| `ProfileMenu` | Partially implemented | Static Ravi Sharma identity and sign-out link only. |
| `ContextSwitcher` | Prototype interaction | Displays context; dropdown choices mostly static/toast-only. |
| `RoleSwitcher` | Must be rewritten | Demo aid allows client-side role escalation. |
| `ExperienceSwitcher` | Partially implemented | UI-density preference in context only. |
| `GlobalSearch` | Prototype interaction | Sheet with static results. |
| `NotificationsButton` | Prototype interaction | Mock notifications and toast actions. |
| `HelpButton` | Prototype interaction | Static FAQ and support toast. |

## Shared Skolaroid Components

| Component | Classification | Notes |
| --- | --- | --- |
| `Icon` | Reusable for production | Dynamic Lucide icon lookup with fallback. |
| `StatusChip` | Reusable for production | Text/icon status pattern. |
| `StatCard` | Reusable for production | KPI display. |
| `PageHeader` | Reusable for production | Page title/action layout. |
| `SectionCard` | Reusable for production | Common section wrapper. |
| `QuickAction` | Reusable for production | Accessible enough when label text exists; add `type`. |
| `EmptyState` | Reusable for production | Generic empty state. |
| `ExperienceOnly`, `LevelBadge` | Partially implemented | UI display gating only, not permissions. |
| `DataTable` | Partially implemented | Search/filter/mobile-card support; no pagination/server mode. |
| `Wizard` | Partially implemented | Stepper navigation; no validation contract. |
| `LoadingList`, `LoadingCards`, `PermissionDenied`, `SystemError`, `NoResults` | Reusable for production | Need real integration into data flows. |
| `ImageWithFallback` | Reusable for production | Basic image fallback. |

## UI Primitive Components

Classification: Reusable for production with normal hardening

Generated Radix/shadcn-style components include accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip, and utility helpers.

Notes:

- These primitives are generally suitable as a UI foundation.
- Several are unused or only indirectly used in the current prototype.
- `form.tsx` wraps `react-hook-form`, but page forms mostly do not use it.

## Page Components

| Page component | Classification | Notes |
| --- | --- | --- |
| `SignIn` | Must be rewritten | Fake auth navigation. |
| `Profile` | Partially implemented | Preferences only; static security controls. |
| `StatesGallery` | Prototype interaction | Developer handoff gallery. |
| `TeacherDashboard`, `TeacherClasses`, `TeacherLearning`, `TeacherAssessments` | Prototype interaction | Mock content/navigation. |
| `TakeAttendance`, `CreateAssignment`, `GradeSubmissions`, `EnterMarks` | Partially implemented | Local workflow state, no persistence. |
| `StudentDashboard`, `StudentLearn`, `StudentTasks` | Prototype interaction | Mock content/toasts. |
| `ParentDashboard`, `ParentFees`, `LeavePage` | Partially implemented | Local state and simulated payment/leave. |
| `AdminDashboard`, `AcademicSetup`, `UsersRoles` | Partially implemented | Local setup/permission matrix only. |
| `PrincipalDashboard`, `Approvals` | Prototype interaction | Mock KPIs/actions. |
| `AccountantDashboard`, `CollectPayment`, `FeeSetup`, `Reconciliation` | Partially implemented | Local finance workflows. |
| `PlatformDashboard` | Prototype interaction | Mock tenant table. |
| `Enquiries`, `ApplicantPortal`, `ApplicationReview` | Partially implemented | Admissions workflow local state. |
| `ExamsList`, `ExamSetup`, `ResultReview` | Partially implemented | Exam setup/review prototype. |
| `ModuleHub`, `Messaging`, `TimetablePage`, `AttendanceOverview`, `StudentDirectory`, `ReportCard`, `Reports`, `Announcement` | Prototype interaction / Partially implemented | Shared domain views with mock data. |

## Production Component Recommendations

- Keep UI primitives, tokens, and shell layout.
- Add route-level data boundaries and error handling.
- Replace demo role/context switchers with authenticated tenant/session selectors.
- Move domain logic out of pages into typed services/hooks after backend contracts exist.
- Add Storybook or component tests for primitives and critical states.
