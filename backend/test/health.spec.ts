import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PrismaService } from "../src/database/prisma.service";
import { HealthController } from "../src/health/health.controller";

const prismaMock = {
  $connect: async () => undefined,
  $disconnect: async () => undefined,
  $queryRawUnsafe: async () => 1
} as unknown as PrismaService;

describe("HealthController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prismaMock }]
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns backend health", async () => {
    await request(app.getHttpServer())
      .get("/api/v1/health")
      .expect(200)
      .expect({
        status: "ok",
        service: "skolaroid-backend",
        database: "ok"
      });
  });
});
