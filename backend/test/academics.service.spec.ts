import { ConflictException, ForbiddenException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { AcademicsService } from "../src/academics/academics.service";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { PrismaService } from "../src/database/prisma.service";

const user: AuthenticatedUser = {
  userId: "admin-1",
  sessionId: "session-1",
  tenantIds: ["tenant-1"],
  activeTenantId: "tenant-1",
  activeBranchId: "branch-1"
};

function mock(existing = false) {
  const audits: unknown[] = [];
  return {
    audits,
    prisma: {
      academicClass: {
        findMany: async () => [{ id: "class-1", code: "7B", name: "Class 7B", subject: "Math", room: "R-201", _count: { enrollments: 0 } }],
        findUnique: async () => existing ? { id: "class-1" } : null,
        create: async ({ data }: { data: Record<string, unknown> }) => ({ id: "class-2", ...data })
      },
      auditEvent: { create: async (args: unknown) => { audits.push(args); return args; } }
    } as unknown as PrismaService
  };
}

describe("AcademicsService", () => {
  it("lists tenant-scoped academic classes", async () => {
    const m = mock();
    const service = new AcademicsService(m.prisma);

    await expect(service.structure(user)).resolves.toEqual({
      classes: [{ id: "class-1", code: "7B", name: "Class 7B", subject: "Math", room: "R-201", students: 0 }]
    });
  });

  it("creates a class and audits it", async () => {
    const m = mock();
    const service = new AcademicsService(m.prisma);

    await expect(service.createClass(user, { code: "7b", name: "Class 7B" })).resolves.toMatchObject({ code: "7B", name: "Class 7B" });
    expect(JSON.stringify(m.audits)).toContain("academic-class.create");
  });

  it("rejects duplicate class codes", async () => {
    const m = mock(true);
    const service = new AcademicsService(m.prisma);

    await expect(service.createClass(user, { code: "7B", name: "Class 7B" })).rejects.toBeInstanceOf(ConflictException);
  });

  it("requires active tenant and branch context", async () => {
    const m = mock();
    const service = new AcademicsService(m.prisma);

    await expect(service.structure({ ...user, activeBranchId: null })).rejects.toBeInstanceOf(ForbiddenException);
  });
});
