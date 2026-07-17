import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { AssignmentStatus, AssignmentSubmissionStatus, EnrollmentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { AssignmentsService } from "../src/assignments/assignments.service";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { PrismaService } from "../src/database/prisma.service";

const teacher: AuthenticatedUser = {
  userId: "teacher-1",
  sessionId: "session-1",
  tenantIds: ["tenant-1"],
  activeTenantId: "tenant-1",
  activeBranchId: "branch-1"
};

const student: AuthenticatedUser = {
  ...teacher,
  userId: "student-user-1"
};

function prismaMock() {
  const auditCreates: unknown[] = [];
  const submissionUpserts: unknown[] = [];
  const submissionUpdates: unknown[] = [];
  const assignment = {
    id: "assignment-1",
    tenantId: "tenant-1",
    branchId: "branch-1",
    classId: "class-1",
    title: "Algebra Worksheet 5",
    subject: "Mathematics",
    instructions: "Solve all questions.",
    dueAt: new Date("2026-07-20T18:00:00.000Z"),
    totalMarks: 20,
    submissionType: "text",
    status: AssignmentStatus.DRAFT,
    class: { id: "class-1", code: "7B", name: "Class 7B" },
    submissions: []
  };

  return {
    auditCreates,
    submissionUpserts,
    submissionUpdates,
    prisma: {
      academicClass: {
        findFirst: async () => ({ id: "class-1", tenantId: "tenant-1", branchId: "branch-1" })
      },
      assignment: {
        findMany: async () => [assignment],
        create: async () => assignment,
        findFirst: async () => assignment,
        update: async () => ({ ...assignment, status: AssignmentStatus.PUBLISHED })
      },
      enrollment: {
        findMany: async () => [
          { studentId: "student-1", status: EnrollmentStatus.ACTIVE },
          { studentId: "student-2", status: EnrollmentStatus.ACTIVE }
        ]
      },
      assignmentSubmission: {
        findMany: async () => [],
        findFirst: async () => ({
          id: "submission-1",
          tenantId: "tenant-1",
          branchId: "branch-1",
          assignmentId: "assignment-1",
          studentId: "student-1",
          status: AssignmentSubmissionStatus.SUBMITTED,
          responseText: "My work",
          submittedAt: new Date("2026-07-16T10:00:00.000Z"),
          marksAwarded: null,
          feedback: null,
          assignment,
          student: { id: "student-1", displayName: "Aarav Sharma", enrollments: [{ classId: "class-1", rollNo: "01" }] }
        }),
        upsert: async (args: unknown) => {
          submissionUpserts.push(args);
          return args;
        },
        update: async (args: unknown) => {
          submissionUpdates.push(args);
          return {
            id: "submission-1",
            assignmentId: "assignment-1",
            studentId: "student-1",
            status: AssignmentSubmissionStatus.GRADED,
            responseText: "My work",
            submittedAt: new Date("2026-07-16T10:00:00.000Z"),
            marksAwarded: 18,
            feedback: "Good",
            assignment,
            student: { id: "student-1", displayName: "Aarav Sharma", enrollments: [{ classId: "class-1", rollNo: "01" }] }
          };
        }
      },
      user: {
        findUnique: async ({ where }: { where: { id: string } }) => ({ displayName: where.id === "student-user-1" ? "Aarav Sharma" : "Ravi Sharma" })
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

describe("AssignmentsService", () => {
  it("publishes an assignment to active enrollments and audits it", async () => {
    const mock = prismaMock();
    const service = new AssignmentsService(mock.prisma);

    await service.publish(teacher, "assignment-1");

    expect(mock.submissionUpserts).toHaveLength(2);
    expect(JSON.stringify(mock.auditCreates)).toContain("assignment.publish");
  });

  it("allows the matched student user to submit their assigned work", async () => {
    const mock = prismaMock();
    const service = new AssignmentsService(mock.prisma);

    await expect(service.submitTask(student, "submission-1", { responseText: "Finished worksheet" })).resolves.toMatchObject({
      submissionId: "submission-1",
      status: "graded"
    });
    expect(JSON.stringify(mock.submissionUpdates[0])).toContain("Finished worksheet");
  });

  it("prevents another user from submitting a student submission", async () => {
    const mock = prismaMock();
    const service = new AssignmentsService(mock.prisma);

    await expect(service.submitTask(teacher, "submission-1", { responseText: "Not mine" })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("rejects grades above total marks", async () => {
    const mock = prismaMock();
    const service = new AssignmentsService(mock.prisma);

    await expect(service.grade(teacher, "submission-1", { marksAwarded: 25 })).rejects.toBeInstanceOf(BadRequestException);
  });
});
