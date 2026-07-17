import { ConflictException, ForbiddenException } from "@nestjs/common";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { AuthenticatedUser } from "../src/auth/jwt-auth.guard";
import { PrismaService } from "../src/database/prisma.service";
import { PlatformService } from "../src/platform/platform.service";

const user: AuthenticatedUser = {
  userId: "platform-1",
  sessionId: "session-1",
  tenantIds: [],
  platform: true,
  activeTenantId: null,
  activeBranchId: null
};

function mock(existingPlan = false) {
  const audits: unknown[] = [];
  const profileCreates: unknown[] = [];
  return {
    audits,
    profileCreates,
    prisma: {
      platformTenantProfile: {
        findUnique: async () => null
      },
      tenant: {
        findUnique: async () => null,
        findMany: async () => [],
      },
      platformPlan: {
        findUnique: async ({ where }: { where: { code?: string } }) => existingPlan || where.code === "EXISTING" ? { id: "plan-existing", code: where.code, name: "Existing" } : null,
        findMany: async () => [],
        create: async ({ data }: { data: Record<string, unknown> }) => ({ id: "plan-1", ...data, createdAt: new Date(), updatedAt: new Date() })
      },
      auditEvent: { create: async (args: unknown) => { audits.push(args); return args; } },
      $transaction: async (callback: (tx: unknown) => Promise<unknown>) => callback({
        tenant: { create: async ({ data }: { data: Record<string, unknown> }) => ({ id: "tenant-1", ...data }) },
        branch: { create: async () => ({ id: "branch-1" }) },
        platformTenantProfile: { create: async (args: unknown) => { profileCreates.push(args); return { id: "profile-1" }; } },
        platformSubscription: { create: async () => ({ id: "sub-1" }) }
      })
    } as unknown as PrismaService
  };
}

function supportActionMock() {
  const writes: unknown[] = [];
  const tenant = {
    id: "tenant-1",
    name: "Demo School",
    platformProfile: {
      id: "profile-1",
      organizationId: "ORG-DEMO-SCHOOL",
      supportKeyHash: createHash("sha256").update("ABC123").digest("hex")
    }
  };
  const membership = {
    id: "membership-1",
    tenantId: "tenant-1",
    branchId: "branch-1",
    userId: "user-1",
    user: { id: "user-1", email: "teacher@demoschool.edu" },
    role: { id: "role-1", key: "teacher" }
  };
  const challenge = { id: "challenge-1" };

  return {
    writes,
    prisma: {
      tenant: { findFirst: async () => tenant },
      platformTenantEditChallenge: { findFirst: async () => challenge },
      userTenantMembership: { findFirst: async () => membership },
      $transaction: async (callback: (tx: unknown) => Promise<unknown>) => callback({
        user: { update: async (args: unknown) => { writes.push({ userUpdate: args }); return args; } },
        platformTenantProfile: { update: async (args: unknown) => { writes.push({ profileUpdate: args }); return args; } },
        platformTenantEditChallenge: { update: async (args: unknown) => { writes.push({ challengeUpdate: args }); return args; } },
        auditEvent: { create: async (args: unknown) => { writes.push({ audit: args }); return args; } }
      })
    } as unknown as PrismaService
  };
}

describe("PlatformService", () => {
  it("creates platform plans and audits them", async () => {
    const m = mock();
    const service = new PlatformService(m.prisma);

    await expect(service.createPlan(user, { name: "Growth", code: "growth", billingCycle: "annual", basePrice: 120000 })).resolves.toMatchObject({ code: "GROWTH", billingCycle: "annual" });
    expect(JSON.stringify(m.audits)).toContain("platform.plan.create");
  });

  it("rejects duplicate platform plan codes", async () => {
    const m = mock(true);
    const service = new PlatformService(m.prisma);

    await expect(service.createPlan(user, { name: "Growth", code: "growth", billingCycle: "annual", basePrice: 120000 })).rejects.toBeInstanceOf(ConflictException);
  });

  it("creates a tenant profile and audits tenant provisioning", async () => {
    const m = mock();
    const service = new PlatformService(m.prisma);

    await expect(service.createTenant(user, {
      schoolName: "New School",
      organizationId: "ORG-NEW",
      primaryDomain: "new.edu.in",
      city: "Pune",
      state: "Maharashtra",
      phone: "+91 90000 00000",
      email: "office@new.edu.in",
      adminName: "Admin User",
      adminEmail: "admin@new.edu.in",
      implementationOwner: "implementation"
    })).resolves.toMatchObject({ name: "New School", orgId: "ORG-NEW" });
    expect(JSON.stringify(m.audits)).toContain("platform.tenant.create");
    expect(JSON.stringify(m.profileCreates)).toContain("supportKeyHash");
  });

  it("rejects support actions with the wrong organization support key", async () => {
    const m = supportActionMock();
    const service = new PlatformService(m.prisma);

    await expect(service.resetTenantUserPassword(user, "tenant-1", "membership-1", {
      editToken: "token",
      supportKey: "WRONG1"
    })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("resets tenant user passwords, rotates support key, and audits the service action", async () => {
    const m = supportActionMock();
    const service = new PlatformService(m.prisma);

    const result = await service.resetTenantUserPassword(user, "tenant-1", "membership-1", {
      editToken: "token",
      supportKey: "ABC123"
    });

    expect(result).toMatchObject({ reset: true, developmentPassword: "Password123!" });
    expect(result.nextSupportKey).toHaveLength(6);
    expect(JSON.stringify(m.writes)).toContain("supportKeyHash");
    expect(JSON.stringify(m.writes)).toContain("platform.support.user.password_reset");
    expect(JSON.stringify(m.writes)).toContain("ORG-DEMO-SCHOOL");
  });
});
