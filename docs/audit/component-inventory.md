# Component Inventory

Source: `frontend/src/app/components`, `frontend/src/app/lib`, `frontend/src/app/store`

## Metrics

- Non-UI source components/pages/libs/store files: 43
- Generated UI primitive files: 42
- Total source files under `frontend/src/app`: 85

## Application Components

| Component | File | Classification | Notes |
| --- | --- | --- | --- |
| `App` | `src/app/App.tsx` | Reusable for production | Needs auth/data providers and error boundary. |
| `AppRouter` | `src/app/router.tsx` | Partially implemented | Route map is broad; lacks guards/loaders/errors. |
| `AppProvider` | `src/app/store/app-context.tsx` | Must be rewritten | In-memory role/context/preferences are not authority. |

## Shell Components

| Component | Classification | Notes |
| --- | --- | --- |
| `AppShell` | Reusable for production | Good responsive chrome; needs permission-aware nav. |
| `ContextSwitcher` | Must be rewritten | Demo-only context and mostly dead menu options. |
| `RoleSwitcher` | Must be rewritten | Client-side role escalation risk. |
| `ExperienceSwitcher` | Partially implemented | In-memory preference only. |
| `GlobalSearch` | Prototype interaction | Static search results. |
| `NotificationsButton` | Prototype interaction | Mock notifications and toast actions. |
| `HelpButton` | Prototype interaction | Static FAQ/support toast. |
| `ProfileMenu` | Must be rewritten | Sign out is navigation only. |

## Shared Components

Reusable with hardening:

- `Icon`
- `StatusChip`
- `StatCard`
- `PageHeader`
- `SectionCard`
- `QuickAction`
- `EmptyState`
- `LoadingList`
- `LoadingCards`
- `PermissionDenied`
- `SystemError`
- `NoResults`
- `ImageWithFallback`

Partially implemented:

- `DataTable`: client filtering only, no server pagination/sorting/loading/error contract.
- `Wizard`: step navigation only, no validation contract or guarded transitions.
- `ExperienceOnly`/`LevelBadge`: display gating only, not permission enforcement.

## UI Primitives

The shadcn/Radix-style primitives are generally reusable as visual infrastructure. They still need accessibility verification in real flows and design-system ownership. `form.tsx` exists, but most page forms do not use it.

