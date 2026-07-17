# Identity Schema Decision

Date: 2026-07-15

## Decision

Use Prisma with PostgreSQL for the initial SMLS identity foundation:

- tenants
- branches
- users
- roles
- permissions
- role permissions
- user tenant memberships
- sessions
- audit events

## Rationale

The product prompt requires UUID identifiers, strong tenant isolation, server-side RBAC, session revocation, refresh token rotation support, and auditability. The schema therefore keeps tenant scope explicit on tenant-owned records, indexes foreign-key and tenant-filter columns, and stores timestamps as timezone-aware values.

## Tradeoff

The Postgres best-practices guidance prefers sequential IDs or UUIDv7 for large write-heavy tables. The product prompt explicitly requires UUID identifiers, so this schema uses UUIDs and compensates with tenant-aware indexes and explicit FK indexes. A future migration may move to UUIDv7 if the deployment standardizes the extension.

