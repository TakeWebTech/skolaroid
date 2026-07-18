# Next Work

This file stores follow-up work that should be picked up when requested.

## Attendance Performance Slice

Yes, we are following the foundation, but not the full high-scale version yet.

Current attendance implementation has the important basics:

- `AttendanceSession` has `tenantId`, `branchId`, `classId`, `attendanceDate`.
- `AttendanceRecord` has `tenantId`, `branchId`, `sessionId`, `studentId`.
- APIs filter by active tenant and branch from session.
- Student records are checked against class enrollment before saving.
- Indexes exist:
  - `AttendanceSession`: `@@index([tenantId, branchId, attendanceDate])`
  - `AttendanceRecord`: `@@index([tenantId, branchId, sessionId])`
  - `Enrollment`: `@@index([tenantId, branchId, classId, status])`
- Attendance save accepts many student records in one request.

So for tenant isolation and normal batch attendance, yes, we are doing it.

But for "200 schools, all classes at same time" scale, there are still upgrades we should add later:

- Current save uses multiple upserts inside one transaction. Good for one class, but not the fastest possible bulk write.
- Audit log is written synchronously. Later it should go through a queue.
- We have not added table partitioning yet.
- We have not added load testing yet.
- We have not added dedicated DB connection pool tuning yet.

Honest status:

**We are following the correct production structure, but the attendance write path is currently version 1. It is safe and tenant-isolated, but not yet optimized for very high concurrent morning attendance load.**

Before production launch, add a performance slice:

1. Bulk attendance write optimization.
2. Queue audit logs.
3. Add load test for 200 schools x many classes.
4. Add DB connection pooling limits.
5. Review indexes with real query plans.
