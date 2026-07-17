import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { AdmissionsService } from "./admissions.service";
import { CreateApplicationDto, DecideApplicationDto } from "./admissions.dto";

@ApiTags("admissions")
@ApiBearerAuth()
@Controller("admissions")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdmissionsController {
  constructor(@Inject(AdmissionsService) private readonly admissions: AdmissionsService) {}

  @Get("applications")
  @RequirePermission("admissions.applications.decide")
  list(@CurrentUser() user: AuthenticatedUser) { return this.admissions.list(user); }

  @Post("applications")
  @RequirePermission("admissions.enquiries.manage")
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateApplicationDto) { return this.admissions.create(user, dto); }

  @Post("applications/:id/offer")
  @RequirePermission("admissions.applications.decide")
  offer(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string, @Body() dto: DecideApplicationDto) { return this.admissions.decide(user, id, "offer", dto); }

  @Post("applications/:id/reject")
  @RequirePermission("admissions.applications.decide")
  reject(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string, @Body() dto: DecideApplicationDto) { return this.admissions.decide(user, id, "reject", dto); }

  @Post("applications/:id/document-request")
  @RequirePermission("admissions.applications.decide")
  docs(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string, @Body() dto: DecideApplicationDto) { return this.admissions.decide(user, id, "document-request", dto); }
}
