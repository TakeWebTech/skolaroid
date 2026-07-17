import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { AcademicsController } from "./academics.controller";
import { AcademicsService } from "./academics.service";

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [AcademicsController],
  providers: [AcademicsService]
})
export class AcademicsModule {}
