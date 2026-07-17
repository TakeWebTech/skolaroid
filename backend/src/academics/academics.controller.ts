import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { AcademicsService } from "./academics.service";
import { CreateAcademicClassDto } from "./academics.dto";

@ApiTags("academics")
@ApiBearerAuth()
@Controller("academic-structure")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AcademicsController {
  constructor(@Inject(AcademicsService) private readonly academics: AcademicsService) {}

  @Get()
  @RequirePermission("academics.manage")
  structure(@CurrentUser() user: AuthenticatedUser) {
    return this.academics.structure(user);
  }

  @Post("classes")
  @RequirePermission("academics.manage")
  createClass(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAcademicClassDto) {
    return this.academics.createClass(user, dto);
  }
}
