import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../database/prisma.service";

export interface HealthResponse {
  status: "ok";
  service: "smls-backend";
  database: "ok" | "unavailable";
}

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({
    schema: {
      type: "object",
      required: ["status", "service"],
      properties: {
        status: { type: "string", enum: ["ok"] },
        service: { type: "string", enum: ["smls-backend"] }
      }
    }
  })
  async getHealth(): Promise<HealthResponse> {
    const database = await this.databaseStatus();

    return {
      status: "ok",
      service: "smls-backend",
      database
    };
  }

  private async databaseStatus(): Promise<HealthResponse["database"]> {
    try {
      await this.prisma.$queryRawUnsafe("SELECT 1");
      return "ok";
    } catch {
      return "unavailable";
    }
  }
}
