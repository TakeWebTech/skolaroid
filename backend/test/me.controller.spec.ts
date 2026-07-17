import { INestApplication } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { MembershipStatus, SessionStatus, UserStatus } from "@prisma/client";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../src/auth/auth.service";
import { JwtAuthGuard } from "../src/auth/jwt-auth.guard";
import { MeController } from "../src/auth/me.controller";
import { PasswordService } from "../src/auth/password.service";
import { TokenService } from "../src/auth/token.service";
import { PrismaService } from "../src/database/prisma.service";

const JWT_SECRET = "test-secret";

function createPrismaMock(sessionStatus: SessionStatus | null = SessionStatus.ACTIVE) {
  const user = {
    id: "user-1",
    email: "teacher@demoschool.edu",
    phone: null,
    passwordHash: "hash",
    displayName: "Ravi Sharma",
    status: UserStatus.ACTIVE,
    mfaEnabled: false,
    memberships: [
      {
        id: "membership-1",
        tenantId: "tenant-1",
        branchId: "branch-1",
        roleId: "role-1",
        status: MembershipStatus.ACTIVE,
        tenant: { name: "Demo School" },
        branch: { name: "Main Branch" },
        role: {
          key: "teacher",
          name: "Teacher",
          permissions: [{ permission: { key: "attendance.mark" } }]
        }
      }
    ]
  };

  return {
    session: {
      findFirst: async () => sessionStatus ? {
        id: "session-1",
        userId: "user-1",
        status: sessionStatus,
        expiresAt: new Date("2026-08-01T00:00:00.000Z"),
        user
      } : null
    }
  } as unknown as PrismaService;
}

describe("MeController", () => {
  let app: INestApplication;
  let jwt: JwtService;

  async function createApp(sessionStatus: SessionStatus | null = SessionStatus.ACTIVE) {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      controllers: [MeController],
      providers: [
        AuthService,
        PasswordService,
        TokenService,
        JwtAuthGuard,
        { provide: PrismaService, useValue: createPrismaMock(sessionStatus) }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
    jwt = moduleRef.get(JwtService);
  }

  afterEach(async () => {
    await app?.close();
  });

  beforeEach(async () => {
    await createApp();
  });

  it("returns the current server-authorized user context", async () => {
    const token = await jwt.signAsync(
      { sub: "user-1", sid: "session-1", tenantIds: ["tenant-1"] },
      { issuer: "smls", audience: "smls-web" }
    );

    await request(app.getHttpServer())
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${token}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.user.displayName).toBe("Ravi Sharma");
        expect(response.body.roles[0].roleKey).toBe("teacher");
        expect(response.body.roles[0].permissions).toEqual(["attendance.mark"]);
      });
  });

  it("rejects missing bearer tokens", async () => {
    await request(app.getHttpServer()).get("/api/v1/auth/me").expect(401);
  });

  it("rejects tokens when the session is not active", async () => {
    await app.close();
    await createApp(null);
    const token = await jwt.signAsync(
      { sub: "user-1", sid: "session-1", tenantIds: ["tenant-1"] },
      { issuer: "smls", audience: "smls-web" }
    );

    await request(app.getHttpServer())
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${token}`)
      .expect(401);
  });
});
