import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { CommunicationService } from "../src/communication/communication.service";
import { PrismaService } from "../src/database/prisma.service";

const user: AuthenticatedUser = {
  userId: "user-1",
  sessionId: "session-1",
  tenantIds: ["tenant-1"],
  activeTenantId: "tenant-1",
  activeBranchId: "branch-1"
};

function mockPrisma() {
  const audits: unknown[] = [];
  const conversation = {
    id: "conversation-1",
    title: "Class 7B Parents",
    updatedAt: new Date("2026-07-16T09:00:00.000Z"),
    messages: [
      {
        id: "message-1",
        senderId: "user-2",
        body: "Good morning",
        createdAt: new Date("2026-07-16T08:30:00.000Z"),
        sender: { displayName: "Neha Sharma" }
      }
    ]
  };

  return {
    audits,
    prisma: {
      conversation: {
        findMany: async () => [conversation],
        findFirst: async ({ where }: { where: { id: string; tenantId: string; branchId: string } }) =>
          where.id === conversation.id && where.tenantId === "tenant-1" && where.branchId === "branch-1" ? conversation : null,
        update: async (args: unknown) => args
      },
      message: {
        create: async () => ({
          id: "message-2",
          senderId: "user-1",
          body: "Thanks",
          createdAt: new Date("2026-07-16T09:05:00.000Z"),
          sender: { displayName: "Ravi Sharma" }
        })
      },
      studentProfile: { count: async () => 14 },
      userTenantMembership: { count: async () => 2 },
      announcement: {
        create: async ({ data }: { data: Record<string, unknown> }) => ({ id: "announcement-1", ...data, createdAt: new Date("2026-07-16T09:10:00.000Z"), sentAt: null }),
        findFirst: async () => ({ id: "announcement-1", tenantId: "tenant-1", branchId: "branch-1" }),
        update: async () => ({
          id: "announcement-1",
          tenantId: "tenant-1",
          branchId: "branch-1",
          createdById: "user-1",
          title: "PTM",
          body: "Meeting",
          audienceRole: "parent",
          status: "SENT",
          createdAt: new Date("2026-07-16T09:10:00.000Z"),
          updatedAt: new Date("2026-07-16T09:11:00.000Z"),
          sentAt: new Date("2026-07-16T09:11:00.000Z")
        })
      },
      auditEvent: { create: async (args: unknown) => { audits.push(args); return args; } }
    } as unknown as PrismaService
  };
}

describe("CommunicationService", () => {
  it("lists tenant-scoped threads", async () => {
    const mock = mockPrisma();
    const service = new CommunicationService(mock.prisma);

    await expect(service.threads(user)).resolves.toEqual([
      { id: "conversation-1", title: "Class 7B Parents", last: "Good morning", updatedAt: "2026-07-16T09:00:00.000Z" }
    ]);
  });

  it("prevents message access outside the active tenant and branch", async () => {
    const mock = mockPrisma();
    const service = new CommunicationService(mock.prisma);

    await expect(service.thread(user, "other-conversation")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("requires active tenant context", async () => {
    const mock = mockPrisma();
    const service = new CommunicationService(mock.prisma);

    await expect(service.threads({ ...user, activeTenantId: undefined })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("audits announcement send", async () => {
    const mock = mockPrisma();
    const service = new CommunicationService(mock.prisma);

    await service.sendAnnouncement(user, "announcement-1");

    expect(JSON.stringify(mock.audits)).toContain("announcement.send");
  });
});
