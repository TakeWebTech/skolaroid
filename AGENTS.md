# Skolaroid Agent Instructions

## Source Of Truth

Follow this order:

1. Security and tenant isolation rules
2. Approved architecture decisions
3. Product requirements and acceptance criteria
4. Approved UI/UX
5. Existing frontend implementation
6. Prototype behaviour

## Current Gate

The audit phase is complete. Product registries have been started at `docs/product/`, but route coverage is not complete. Before production implementation starts for a module, complete its screen/action/API/permission/test registry records.

## Non-Negotiables

- `Frontend/` is the core Skolaroid engine UI.
- `website/web_frontend/` is the public marketing website UI.
- Do not rename `Frontend/` or `website/web_frontend/` without an explicit migration task.
- Do not create fake production functionality.
- Do not rely on frontend-only permissions.
- Do not introduce TODO/FIXME placeholders in completed features.
- Keep development seed data separate from production logic.
- Record conflicts in `docs/decisions/open-conflicts.md`.
