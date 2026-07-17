# Accessibility Audit

## Findings

- Radix primitives provide a reasonable accessible foundation for menus, dialogs, sheets, selects, switches, and tooltips.
- Many page forms use visible labels, but labels are often not associated with inputs via `htmlFor`/`id`.
- Several icon-only buttons need explicit accessible names verified.
- Route changes do not manage focus.
- Toast-only actions may not provide durable feedback.
- No axe, Playwright, or screen-reader verification exists.

## Classification

Partially implemented.

## Issues Counted

- Accessibility issue categories: 8
- Route-level focus management missing: 1 global issue
- Form label association risk: found across sign-in, profile, admissions, finance, marks, leave, and reports screens
- Icon-only/action-only naming risk: found in shell and several table actions

## Required Work

- Add automated axe checks.
- Add route focus restoration.
- Ensure all form controls have programmatic labels and errors.
- Verify modal/sheet focus traps in real flows.
- Verify status messages for async operations.

