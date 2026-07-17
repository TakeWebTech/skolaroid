import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { AttendanceService } from "./attendance.service";
import { CreateAttendanceSessionDto, SaveAttendanceDto } from "./attendance.dto";

@ApiTags("attendance")
@ApiBearerAuth()
@Controller("attendance")
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission("attendance.mark")
export class AttendanceController {
  constructor(@Inject(AttendanceService) private readonly attendance: AttendanceService) {}

  @Get("classes")
  classes(@CurrentUser() user: AuthenticatedUser) {
    return this.attendance.listClasses(user);
  }

  @Post("classes/:classId/session")
  session(
    @CurrentUser() user: AuthenticatedUser,
    @Param("classId", ParseUUIDPipe) classId: string,
    @Body() dto: CreateAttendanceSessionDto
  ) {
    return this.attendance.getOrCreateSession(user, classId, dto.date);
  }

  @Put("sessions/:sessionId/draft")
  saveDraft(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId", ParseUUIDPipe) sessionId: string,
    @Body() dto: SaveAttendanceDto
  ) {
    return this.attendance.saveDraft(user, sessionId, dto.records);
  }

  @Post("sessions/:sessionId/submit")
  submit(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId", ParseUUIDPipe) sessionId: string,
    @Body() dto: SaveAttendanceDto
  ) {
    return this.attendance.submit(user, sessionId, dto.records);
  }
}

