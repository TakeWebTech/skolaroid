import { INestApplication } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { MembershipStatus, SessionStatus } from "@prisma/client";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { CapabilitiesController } from "../src/auth/capabilities.controller";
import { JwtAuthGuard } from "../src/auth/jwt-auth.guard";
import { PermissionGuard } from "../src/auth/permission.guard";
import { PrismaService } from "../src/database/prisma.service";

const JWT_SECRET = "test-secret";

function createPrismaMock(permissionKeys: string[]) {
  return {
    session: {
      findFirst: async () => ({
        id: "session-1",
        userId: "user-1",
        status: SessionStatus.ACTIVE,
        activeTenantId: "tenant-1",
        activeBranchId: "branch-1",
        expiresAt: new Date("2026-08-01T00:00:00.000Z")
      })
    },
    userTenantMembership: {
      findFirst: async ({ where }: { where: { role?: { permissions?: { some?: { permission?: { key?: string } } } } } }) => {
        const required = where.role?.permissions?.some?.permission?.key;
        if (required && !permissionKeys.includes(required)) return null;
        return { id: "membership-1", status: MembershipStatus.ACTIVE };
      }
    }
  } as unknown as PrismaService;
}

async function createApp(permissionKeys: string[]) {
  const moduleRef = await Test.createTestingModule({
    imports: [JwtModule.register({ secret: JWT_SECRET })],
    controllers: [CapabilitiesController],
    providers: [
      JwtAuthGuard,
      PermissionGuard,
      { provide: PrismaService, useValue: createPrismaMock(permissionKeys) }
    ]
  }).compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix("api/v1");
  await app.init();
  const jwt = moduleRef.get(JwtService);
  const token = await jwt.signAsync(
    { sub: "user-1", sid: "session-1", tenantIds: ["tenant-1"] },
    { issuer: "smls", audience: "smls-web" }
  );
  return { app, token };
}

describe("PermissionGuard", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
  });

  it("allows teachers to access attendance capability", async () => {
    const testApp = await createApp(["attendance.mark"]);
    app = testApp.app;

    await request(app.getHttpServer())
      .get("/api/v1/auth/capabilities/attendance")
      .set("authorization", `Bearer ${testApp.token}`)
      .expect(200)
      .expect({ allowed: true, permission: "attendance.mark" });
  });

  it("blocks students from teacher attendance capability", async () => {
    const testApp = await createApp(["student.dashboard.view"]);
    app = testApp.app;

    await request(app.getHttpServer())
      .get("/api/v1/auth/capabilities/attendance")
      .set("authorization", `Bearer ${testApp.token}`)
      .expect(403);
  });

  it("blocks students from admin capability", async () => {
    const testApp = await createApp(["student.dashboard.view"]);
    app = testApp.app;

    await request(app.getHttpServer())
      .get("/api/v1/auth/capabilities/admin")
      .set("authorization", `Bearer ${testApp.token}`)
      .expect(403);
  });

  it("blocks students from accountant capability", async () => {
    const testApp = await createApp(["student.dashboard.view"]);
    app = testApp.app;

    await request(app.getHttpServer())
      .get("/api/v1/auth/capabilities/finance")
      .set("authorization", `Bearer ${testApp.token}`)
      .expect(403);
  });
});

