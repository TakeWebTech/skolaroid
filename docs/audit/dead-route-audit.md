# Dead Route Audit

## Findings

- No route produces a hard browser 404 because `*` redirects to `/teacher`.
- This masks missing or mistyped routes.
- Several `ModuleHub` links point to the same route they are already on, acting as visual placeholders.
- Several operational modules are only generic hubs: library, transport, platform plans, platform support, accountant settings, admin settings, principal staff.

## Classification

Dead route handling gap.

## Required Work

- Add a real not-found route.
- Add permission-denied route.
- Replace self-links with implemented target screens or hide behind product backlog status.
- Add route inventory tests.

