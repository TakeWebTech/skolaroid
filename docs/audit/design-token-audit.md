# Design Token Audit

Sources: `frontend/src/styles`, `frontend/default_shadcn_theme.css`, UI primitive classes.

## Findings

- Theme and global CSS files exist: `fonts.css`, `globals.css`, `index.css`, `tailwind.css`, `theme.css`.
- The app uses semantic color classes such as `bg-card`, `text-muted-foreground`, `border-border`, `text-destructive`, and status tones through shared primitives.
- UI primitives use consistent spacing, border, focus, and disabled patterns.
- The design is largely reusable as the approved visual reference.

## Classification

Reusable for production with hardening.

## Gaps

- No documented token registry at root `docs/`.
- No automated contrast verification.
- No dark/light theme acceptance matrix.
- No formal mapping between product states and status colors.
- No guarantee that page-local custom classes follow token rules.

