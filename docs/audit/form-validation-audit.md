# Form Validation Audit

## Current Findings

- `react-hook-form` is installed and a shadcn form wrapper exists.
- Zod is not installed.
- Most forms use uncontrolled inputs and local click handlers.
- Marks entry includes simple numeric range validation.
- Academic subject add prevents empty/duplicate local subject names.
- Approval reject requires a reason before confirm.
- Many required fields have no enforced validation.

## Classification

Partially implemented.

## High-Risk Forms

- Sign-in
- Password reset/SSO actions
- Attendance submit
- Marks entry and lock
- Create assignment wizard
- Parent payment
- Collect payment
- Fee setup publish
- Users and roles changes
- Admissions application/upload
- Application review decision
- Exam setup
- Result publication
- Announcement composer
- Leave request
- Reports/export builder

## Required Production Standard

Each form needs shared Zod schema, React Hook Form integration, server validation, field-level errors, loading/disabled state, success and error handling, audit rules, and tests.

