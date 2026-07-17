import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { SessionStatus, UserStatus } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../src/auth/auth.service";
import { PasswordService } from "../src/auth/password.service";
import { TokenService } from "../src/auth/token.service";
import { PrismaService } from "../src/database/prisma.service";

const passwordService = new PasswordService();

function createPrismaMock(user: unknown) {
  return {
    user: {
      findFirst: async () => user
    },
    session: {
      create: async ({ data }: { data: { userId: string; activeTenantId: string | null; activeBranchId: string | null; status: SessionStatus; expiresAt: Date } }) => ({
        id: "session-1",
        userId: data.userId,
        activeTenantId: data.activeTenantId,
        activeBranchId: data.activeBranchId,
        status: data.status,
        expiresAt: data.expiresAt
      })
    }
  } as unknown as PrismaService;
}

function createSessionPrismaMock(session: unknown) {
  const updates: unknown[] = [];
  return {
    updates,
    prisma: {
      session: {
        findFirst: async () => session,
        update: async ({ data }: { data: { refreshTokenHash?: string; expiresAt?: Date; status?: SessionStatus; revokedAt?: Date | null } }) => {
          updates.push(data);
          return {
            id: "session-1",
            userId: "user-1",
            expiresAt: data.expiresAt ?? new Date("2026-08-01T00:00:00.000Z")
          };
        }
      }
    } as unknown as PrismaService
  };
}

function createTokenMock(tokens = ["refresh-token"]) {
  let index = 0;
  return {
    createRefreshToken: () => tokens[index++] ?? tokens[tokens.length - 1] ?? "refresh-token",
    hashToken: (token: string) => `hash:${token}`,
    createAccessToken: async () => "access-token"
  } as unknown as TokenService;
}

describe("AuthService", () => {
  let passwordHash: string;

  beforeEach(async () => {
    passwordHash = await passwordService.hash("correct-password");
  });

  it("creates a session and returns server-authorized roles for valid credentials", async () => {
    const service = new AuthService(
      createPrismaMock({
        id: "user-1",
        email: "teacher@demoschool.edu",
        phone: null,
        passwordHash,
        displayName: "Ravi Sharma",
        status: UserStatus.ACTIVE,
        mfaEnabled: true,
        memberships: [
          {
            id: "membership-1",
            tenantId: "tenant-1",
            branchId: "branch-1",
            roleId: "role-1",
            tenant: { name: "Demo School" },
            branch: { name: "Main Branch" },
            role: {
              key: "teacher",
              name: "Teacher",
              permissions: [
                { permission: { key: "teacher.dashboard.view" } },
                { permission: { key: "attendance.mark" } }
              ]
            }
          }
        ]
      }),
      passwordService,
      createTokenMock()
    );

    const result = await service.login({
      identifier: "TEACHER@DEMOSCHOOL.EDU",
      password: "correct-password"
    });

    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
    expect(result.session.id).toBe("session-1");
    expect(result.user.mfaEnabled).toBe(true);
    expect(result.roles).toEqual([
      {
        membershipId: "membership-1",
        scope: "tenant",
        tenantId: "tenant-1",
        tenantName: "Demo School",
        branchId: "branch-1",
        branchName: "Main Branch",
        roleId: "role-1",
        roleKey: "teacher",
        roleName: "Teacher",
        permissions: ["teacher.dashboard.view", "attendance.mark"]
      }
    ]);
  });

  it("rejects an invalid password", async () => {
    const service = new AuthService(
      createPrismaMock({
        id: "user-1",
        email: "teacher@demoschool.edu",
        phone: null,
        passwordHash,
        displayName: "Ravi Sharma",
        status: UserStatus.ACTIVE,
        mfaEnabled: false,
        memberships: []
      }),
      passwordService,
      createTokenMock()
    );

    await expect(
      service.login({ identifier: "teacher@demoschool.edu", password: "wrong-password" })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects active users without active tenant access", async () => {
    const service = new AuthService(
      createPrismaMock({
        id: "user-1",
        email: "teacher@demoschool.edu",
        phone: null,
        passwordHash,
        displayName: "Ravi Sharma",
        status: UserStatus.ACTIVE,
        mfaEnabled: false,
        memberships: []
      }),
      passwordService,
      createTokenMock()
    );

    await expect(
      service.login({ identifier: "teacher@demoschool.edu", password: "correct-password" })
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("rotates refresh tokens for active sessions", async () => {
    const sessionStore = createSessionPrismaMock({
      id: "session-1",
      userId: "user-1",
      user: {
        status: UserStatus.ACTIVE,
        memberships: [{ tenantId: "tenant-1", tenant: { name: "Demo School" } }]
      }
    });
    const service = new AuthService(sessionStore.prisma, passwordService, createTokenMock(["rotated-refresh-token"]));

    const result = await service.refresh("refresh-token");

    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("rotated-refresh-token");
    expect(sessionStore.updates).toEqual([
      expect.objectContaining({
        refreshTokenHash: "hash:rotated-refresh-token",
        status: SessionStatus.ACTIVE,
        revokedAt: null
      })
    ]);
  });

  it("rejects invalid refresh tokens", async () => {
    const sessionStore = createSessionPrismaMock(null);
    const service = new AuthService(sessionStore.prisma, passwordService, createTokenMock());

    await expect(service.refresh("missing")).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("revokes active sessions on logout", async () => {
    const sessionStore = createSessionPrismaMock({ id: "session-1" });
    const service = new AuthService(sessionStore.prisma, passwordService, createTokenMock());

    await expect(service.logout("refresh-token")).resolves.toEqual({ revoked: true });
    expect(sessionStore.updates).toEqual([
      expect.objectContaining({
        status: SessionStatus.REVOKED,
        revokedAt: expect.any(Date)
      })
    ]);
  });

  it("keeps logout idempotent for unknown refresh tokens", async () => {
    const sessionStore = createSessionPrismaMock(null);
    const service = new AuthService(sessionStore.prisma, passwordService, createTokenMock());

    await expect(service.logout("missing")).resolves.toEqual({ revoked: true });
    expect(sessionStore.updates).toEqual([]);
  });
});
