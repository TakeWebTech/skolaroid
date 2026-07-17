import { ConflictException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { EnrollmentStatus, StudentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { PrismaService } from "../src/database/prisma.service";
import { PeopleService } from "../src/people/people.service";

const user: AuthenticatedUser = {
  userId: "admin-1",
  sessionId: "session-1",
  tenantIds: ["tenant-1"],
  activeTenantId: "tenant-1",
  activeBranchId: "branch-1"
};

function prismaMock() {
  const enrollmentFindManyCalls: unknown[] = [];
  const audits: unknown[] = [];
  return {
    enrollmentFindManyCalls,
    audits,
    prisma: {
      academicClass: {
        findMany: async () => [{ id: "class-1", code: "7B", name: "Class 7B" }],
        findFirst: async ({ where }: { where: { id: string } }) => where.id === "class-1" ? { id: "class-1", code: "7B", name: "Class 7B" } : null
      },
      enrollment: {
        findMany: async (args: unknown) => {
          enrollmentFindManyCalls.push(args);
          return [
            {
              tenantId: "tenant-1",
              branchId: "branch-1",
              classId: "class-1",
              rollNo: "01",
              status: EnrollmentStatus.ACTIVE,
              class: { id: "class-1", code: "7B", name: "Class 7B" },
              student: {
                id: "student-1",
                admissionNo: "GF-7B-01",
                displayName: "Aarav Sharma",
                status: StudentStatus.ACTIVE
              }
            }
          ];
        },
        findUnique: async ({ where }: { where: { classId_rollNo: { rollNo: string } } }) => where.classId_rollNo.rollNo === "99" ? { id: "enrollment-99" } : null
      },
      studentProfile: {
        findUnique: async ({ where }: { where: { tenantId_admissionNo: { admissionNo: string } } }) => where.tenantId_admissionNo.admissionNo === "DUP-1" ? { id: "student-existing" } : null,
        create: async ({ data }: { data: { admissionNo: string; displayName: string; enrollments: { create: { classId: string; rollNo: string } } } }) => ({
          id: "student-new",
          admissionNo: data.admissionNo,
          displayName: data.displayName,
          status: StudentStatus.ACTIVE,
          enrollments: [{ classId: data.enrollments.create.classId, rollNo: data.enrollments.create.rollNo, class: { id: "class-1", code: "7B", name: "Class 7B" } }]
        })
      },
      auditEvent: {
        create: async (args: unknown) => {
          audits.push(args);
          return args;
        }
      }
    } as unknown as PrismaService
  };
}

describe("PeopleService", () => {
  it("lists students in the active tenant and branch context", async () => {
    const mock = prismaMock();
    const service = new PeopleService(mock.prisma);

    await expect(service.listStudents(user, {})).resolves.toEqual({
      classes: [{ id: "class-1", code: "7B", name: "Class 7B" }],
      students: [
        {
          id: "student-1",
          admissionNo: "GF-7B-01",
          name: "Aarav Sharma",
          status: "active",
          classId: "class-1",
          classCode: "7B",
          className: "Class 7B",
          rollNo: "01"
        }
      ]
    });
  });

  it("passes search and class filters to the tenant-scoped query", async () => {
    const mock = prismaMock();
    const service = new PeopleService(mock.prisma);

    await service.listStudents(user, { search: "Aarav", classId: "class-1" });

    expect(JSON.stringify(mock.enrollmentFindManyCalls[0])).toContain("tenant-1");
    expect(JSON.stringify(mock.enrollmentFindManyCalls[0])).toContain("branch-1");
    expect(JSON.stringify(mock.enrollmentFindManyCalls[0])).toContain("class-1");
    expect(JSON.stringify(mock.enrollmentFindManyCalls[0])).toContain("Aarav");
  });

  it("requires active tenant and branch context", async () => {
    const mock = prismaMock();
    const service = new PeopleService(mock.prisma);

    await expect(service.listStudents({ ...user, activeBranchId: null }, {})).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("creates a student enrollment and audits it", async () => {
    const mock = prismaMock();
    const service = new PeopleService(mock.prisma);

    await expect(service.createStudent(user, { admissionNo: "adm-1", displayName: "New Student", classId: "class-1", rollNo: "03" })).resolves.toMatchObject({
      admissionNo: "ADM-1",
      classCode: "7B",
      rollNo: "03"
    });
    expect(JSON.stringify(mock.audits)).toContain("student.create");
  });

  it("rejects duplicate admission numbers", async () => {
    const mock = prismaMock();
    const service = new PeopleService(mock.prisma);

    await expect(service.createStudent(user, { admissionNo: "DUP-1", displayName: "Existing", classId: "class-1" })).rejects.toBeInstanceOf(ConflictException);
  });

  it("rejects missing classes", async () => {
    const mock = prismaMock();
    const service = new PeopleService(mock.prisma);

    await expect(service.createStudent(user, { admissionNo: "ADM-2", displayName: "No Class", classId: "class-missing" })).rejects.toBeInstanceOf(NotFoundException);
  });
});
