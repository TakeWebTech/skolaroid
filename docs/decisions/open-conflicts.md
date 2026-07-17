# Open Conflicts

## Student Identity Link

- Date recorded: 2026-07-16
- Area: Assignments/Homework foundation
- Conflict: The current identity schema has `User` and `StudentProfile` as separate records without a direct relation. Student task ownership is currently resolved by matching the authenticated user's display name to the seeded student profile display name.
- Required decision: Add an explicit `studentProfile.userId` or a separate person/account link before expanding student workflows beyond development seed data.
- Current mitigation: Tenant/branch context and submission IDs are still server-checked; the display-name match is only used to map the demo student login to its seeded student profile.
