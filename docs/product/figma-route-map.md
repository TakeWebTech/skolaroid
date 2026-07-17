# Figma Route Map

Source of truth:

- `frontend/src/app/router.tsx`
- `docs/audit/route-inventory.md`
- `docs/product/screen-registry.json`

## Registry Coverage

- Concrete route paths currently found in `router.tsx`: 68 excluding catch-all.
- Screen registry records: 68 route-backed records.
- Coverage gap: 0 route paths.

The previous aggregate shared-route record was split into individual route-backed records so each URL can carry its own API, permission, and test requirements.

## Route Groups

| Module | Routes | Registry status |
| --- | ---: | --- |
| Public auth | 1 | Registered |
| Teacher | 13 | Registered |
| Student | 6 | Registered |
| Parent | 8 | Registered |
| Admin | 7 | Registered |
| Principal | 7 | Registered |
| Accountant | 7 | Registered |
| Platform | 7 | Registered |
| Admissions | 3 | Registered |
| Exams | 3 | Registered |
| Operations | 3 | Registered |
| Communication | 1 | Registered |
| Global profile/states | 2 | Registered |

## Production Rule

Before implementation starts on any screen, that screen must have:

- a complete screen registry record
- complete action registry records for all visible controls
- required API record
- required permission record
- required test records
