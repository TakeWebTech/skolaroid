import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";

@Module({
  imports: [AuthModule, JwtModule.register({ secret: process.env.JWT_SECRET ?? "development-only-change-me" })],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule {}
