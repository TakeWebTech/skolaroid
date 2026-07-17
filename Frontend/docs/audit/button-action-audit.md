# Button And Link Action Audit

Scope: Buttons, links, `NavLink`, `navigate`, `onClick`, submit handlers, and toast-only interactions found in `src/app`.

## Summary

- Navigation links are mostly route-backed through React Router.
- Many controls are prototype actions that only show a toast.
- Several controls mutate local component state but do not persist.
- No action calls a real backend.
- No permission checks were verified before sensitive actions.

## Global Shell

| Control | Classification | Verified behavior |
| --- | --- | --- |
| Sidebar/mobile nav links | Prototype interaction | Navigate to configured route for current context role. |
| Context switcher school/branch/year choices | Prototype interaction | Current school item toasts; other menu items have no update handler. |
| Role switcher | Must be rewritten | Sets client role and navigates to selected role home. |
| Experience switcher | Partially implemented | Sets in-memory experience level. |
| Global search trigger/results | Prototype interaction | Opens sheet with static search results. |
| Notifications Open/Mark read | Prototype interaction | Toast only. |
| Help support request | Prototype interaction | Toast and closes sheet. |
| Profile menu Sign out | Must be rewritten | Navigates to `/signin`; does not destroy session. |

## Auth And Profile

| Control | Classification | Verified behavior |
| --- | --- | --- |
| Sign-in submit | Must be rewritten | Prevents default and navigates to `/teacher`. |
| Continue with SSO | Must be rewritten | Navigates to `/teacher`. |
| Forgot? | Visual only | No handler. |
| Contact your school | Visual only | No handler. |
| Save preferences | Prototype interaction | Toast only. |
| Language select | Partially implemented | Updates in-memory `lang`. |
| Offline switch | Partially implemented | Toggles offline banner only. |
| Experience cards | Partially implemented | Update in-memory experience level. |
| Device Sign out | Visual only | Button has no handler. |

## Teacher

| Control | Classification | Verified behavior |
| --- | --- | --- |
| Dashboard quick actions | Prototype interaction | Navigate to attendance, create assignment, marks. |
| Today's classes View all / Take attendance | Prototype interaction | Navigate to classes or attendance. |
| Pending grading Grade | Prototype interaction | Navigate to grade page. |
| Student learning Continue | Prototype interaction | Toast only. |
| Assessments Create/Grade/Marks actions | Prototype interaction | Navigate to related routes or toast. |
| Create assignment wizard buttons | Partially implemented | Step navigation and finish toast/navigation. |
| Attendance status toggles/submit | Partially implemented | Local status changes and toast. |
| Marks Save draft | Prototype interaction | Toast only. |
| Marks Submit marks | Partially implemented | Disabled on errors/locked; locks local state. |
| Marks Absent toggle | Partially implemented | Local state only. |

## Student And Parent

| Control | Classification | Verified behavior |
| --- | --- | --- |
| Student dashboard quick actions/Open | Prototype interaction | Navigate to learn/tasks. |
| Parent child selector | Partially implemented | Updates in-memory active child. |
| Parent View/Pay Fees/Apply Leave/Contact School | Prototype interaction | Navigate to related routes. |
| Parent fees Pay buttons | Partially implemented | Opens dialog; timeout simulates success. |
| Parent payment confirm | Must be rewritten | Simulated payment only, no gateway. |
| Leave Submit | Prototype interaction | Toast only; no form submit validation. |

## Admin, Principal, Accountant, Platform

| Control | Classification | Verified behavior |
| --- | --- | --- |
| Student directory Add/Open | Prototype interaction | Toast only. |
| DataTable search/filter | Partially implemented | Client-side filter on mock rows. |
| Academic setup Add subject/grade toggles | Partially implemented | Local state changes only. |
| Users & roles controls | Partially implemented | Local user/permission matrix state only. |
| Principal approvals Approve/Reject | Prototype interaction | Toast/local behavior only. |
| Accountant Collect payment | Partially implemented | Local payment workflow and fake receipt. |
| Fee setup publish/edit controls | Partially implemented | Local state/toasts. |
| Reconciliation actions | Prototype interaction | Toast only. |
| Platform tenant Open | Prototype interaction | Toast only. |

## Admissions, Exams, Shared Modules

| Control | Classification | Verified behavior |
| --- | --- | --- |
| Enquiries review/applicant portal | Prototype interaction | Navigate. |
| Add enquiry / call / convert | Prototype interaction | Toast only. |
| Applicant portal Upload | Partially implemented | Sets local uploaded state. |
| Applicant portal Submit | Partially implemented | Navigates to `/admissions`; no validation/persistence. |
| Application review select applicant | Partially implemented | Local selected id. |
| Schedule interview/request docs | Prototype interaction | Toast only. |
| Offer/reject/apply decision | Partially implemented | Local stage update and toast. |
| Exam setup wizard | Partially implemented | Local classes/subjects and finish toast/navigation. |
| Result review actions | Prototype interaction | Static/toast behavior only. |
| Messaging New message | Visual only | No handler verified. |
| Messaging Send/Enter | Partially implemented | Clears local draft and toasts. |
| Announcement publish/schedule | Prototype interaction | Toast only. |
| Reports Preview | Prototype interaction | Toast only. |
| State gallery retry/clear | Prototype interaction | Toast only. |

## Dead Or Misleading Controls

- `Forgot?` and `Contact your school` on sign-in have no useful handler.
- Profile device `Sign out` has no handler.
- Many hub links route back to the same page, creating apparent actions with no workflow.
- Buttons with labels like "Upload", "Publish", "Submit", "Collect", "Approve", and "Send" do not create durable server-side effects.
- Some custom buttons omit `type="button"`, which can cause accidental form submit behavior if reused inside forms.
