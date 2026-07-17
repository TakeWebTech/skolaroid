import { BadRequestException } from "@nestjs/common";
import { ExamStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { PrismaService } from "../src/database/prisma.service";
import { ExamsService } from "../src/exams/exams.service";

const user: AuthenticatedUser = { userId: "u1", sessionId: "s1", tenantIds: ["t1"], activeTenantId: "t1", activeBranchId: "b1" };
function mock() {
  const audits: unknown[] = [];
  const exam = { id: "e1", tenantId: "t1", branchId: "b1", classId: "c1", name: "Unit Test", term: "Term 2", subject: "Math", maxMarks: 25, startDate: new Date("2026-07-20"), endDate: new Date("2026-07-20"), status: ExamStatus.MARKS_ENTRY, class: { name: "Class 7B", code: "7B" }, marks: [] };
  return { audits, prisma: {
    exam: { findFirst: async () => exam, findMany: async () => [exam], create: async () => exam, update: async () => ({ ...exam, status: ExamStatus.MARKS_SUBMITTED }) },
    academicClass: { findFirst: async () => ({ id: "c1" }) },
    enrollment: { findMany: async () => [{ studentId: "stu1", rollNo: "01", student: { displayName: "Aarav Sharma" } }] },
    examMark: { upsert: async (args: unknown) => args },
    auditEvent: { create: async (args: unknown) => { audits.push(args); return args; } },
    $transaction: async (ops: unknown[]) => Promise.all(ops)
  } as unknown as PrismaService };
}
describe("ExamsService", () => {
  it("rejects marks over the maximum", async () => {
    const m = mock(); const service = new ExamsService(m.prisma);
    await expect(service.saveMarks(user, "e1", [{ studentId: "stu1", marks: 26, absent: false }], false)).rejects.toBeInstanceOf(BadRequestException);
  });
  it("audits submitted marks", async () => {
    const m = mock(); const service = new ExamsService(m.prisma);
    await service.saveMarks(user, "e1", [{ studentId: "stu1", marks: 20, absent: false }], true);
    expect(JSON.stringify(m.audits)).toContain("marks.submit");
  });
});
