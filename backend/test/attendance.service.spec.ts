import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { AttendanceSessionStatus, EnrollmentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { AttendanceService } from "../src/attendance/attendance.service";
import { PrismaService } from "../src/database/prisma.service";

const user: AuthenticatedUser = {
  userId: "teacher-1",
  sessionId: "session-1",
  tenantIds: ["tenant-1"],
  activeTenantId: "tenant-1",
  activeBranchId: "branch-1"
};

function prismaMock(sessionStatus: AttendanceSessionStatus = AttendanceSessionStatus.DRAFT) {
  const auditCreates: unknown[] = [];
  const recordUpserts: unknown[] = [];
  return {
    auditCreates,
    recordUpserts,
    prisma: {
      academicClass: {
        findMany: async () => [{ id: "class-1", code: "7B", name: "Class 7B", subject: "Mathematics", room: "R-201" }],
        findFirst: async ({ where }: { where: { id: string; tenantId: string } }) =>
          where.id === "class-1" && where.tenantId === "tenant-1"
            ? { id: "class-1", tenantId: "tenant-1", branchId: "branch-1", code: "7B", name: "Class 7B", subject: "Mathematics", room: "R-201" }
            : null
      },
      attendanceSession: {
        upsert: async () => ({ id: "attendance-1" }),
        findFirst: async ({ where }: { where: { id: string; tenantId: string } }) =>
          where.id === "attendance-1" && where.tenantId === "tenant-1"
            ? {
                id: "attendance-1",
                tenantId: "tenant-1",
                branchId: "branch-1",
                classId: "class-1",
                attendanceDate: new Date("2026-07-15T00:00:00.000Z"),
                status: sessionStatus,
                class: { id: "class-1", code: "7B", name: "Class 7B", subject: "Mathematics" }
              }
            : null,
        update: async () => ({ id: "attendance-1" })
      },
      enrollment: {
        findMany: async () => [
          { studentId: "student-1", rollNo: "01", status: EnrollmentStatus.ACTIVE, student: { displayName: "Aarav Sharma" } },
          { studentId: "student-2", rollNo: "02", status: EnrollmentStatus.ACTIVE, student: { displayName: "Anaya Rao" } }
        ]
      },
      attendanceRecord: {
        findMany: async () => [],
        upsert: async (args: unknown) => {
          recordUpserts.push(args);
          return args;
        }
      },
      auditEvent: {
        create: async (args: unknown) => {
          auditCreates.push(args);
          return args;
        }
      },
      $transaction: async (ops: unknown[]) => Promise.all(ops)
    } as unknown as PrismaService
  };
}

describe("AttendanceService", () => {
  it("lists classes in the active tenant context", async () => {
    const mock = prismaMock();
    const service = new AttendanceService(mock.prisma);
    await expect(service.listClasses(user)).resolves.toEqual([
      { id: "class-1", code: "7B", name: "Class 7B", subject: "Mathematics", room: "R-201" }
    ]);
  });

  it("rejects classes outside the active tenant", async () => {
    const mock = prismaMock();
    const service = new AttendanceService(mock.prisma);
    await expect(service.getOrCreateSession(user, "other-class", "2026-07-15")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects attendance records for students outside the class", async () => {
    const mock = prismaMock();
    const service = new AttendanceService(mock.prisma);
    await expect(
      service.saveDraft(user, "attendance-1", [{ studentId: "not-enrolled", status: "present" }])
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("writes audit events on save and submit", async () => {
    const mock = prismaMock();
    const service = new AttendanceService(mock.prisma);
    await service.saveDraft(user, "attendance-1", [{ studentId: "student-1", status: "absent" }]);
    await service.submit(user, "attendance-1", [{ studentId: "student-1", status: "present" }]);
    expect(mock.auditCreates).toHaveLength(2);
    expect(JSON.stringify(mock.auditCreates[0])).toContain("attendance.save");
    expect(JSON.stringify(mock.auditCreates[1])).toContain("attendance.submit");
  });

  it("locks submitted sessions", async () => {
    const mock = prismaMock(AttendanceSessionStatus.SUBMITTED);
    const service = new AttendanceService(mock.prisma);
    await expect(
      service.saveDraft(user, "attendance-1", [{ studentId: "student-1", status: "present" }])
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});

