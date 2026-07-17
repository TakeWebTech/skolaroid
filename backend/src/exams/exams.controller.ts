import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { CreateExamDto, SaveMarksDto } from "./exams.dto";
import { ExamsService } from "./exams.service";

@ApiTags("exams")
@ApiBearerAuth()
@Controller("exams")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ExamsController {
  constructor(@Inject(ExamsService) private readonly exams: ExamsService) {}

  @Get("classes")
  @RequirePermission("exams.create")
  classes(@CurrentUser() user: AuthenticatedUser) { return this.exams.listClasses(user); }

  @Get()
  @RequirePermission("exams.view")
  list(@CurrentUser() user: AuthenticatedUser) { return this.exams.list(user); }

  @Post()
  @RequirePermission("exams.create")
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateExamDto) { return this.exams.create(user, dto); }

  @Get("marks-entry")
  @RequirePermission("marks.enter")
  marksEntry(@CurrentUser() user: AuthenticatedUser, @Query("examId") examId?: string) { return this.exams.marksEntry(user, examId); }

  @Put(":examId/marks-draft")
  @RequirePermission("marks.enter")
  save(@CurrentUser() user: AuthenticatedUser, @Param("examId", ParseUUIDPipe) examId: string, @Body() dto: SaveMarksDto) {
    return this.exams.saveMarks(user, examId, dto.records, false);
  }

  @Post(":examId/marks-submit")
  @RequirePermission("marks.enter")
  submit(@CurrentUser() user: AuthenticatedUser, @Param("examId", ParseUUIDPipe) examId: string, @Body() dto: SaveMarksDto) {
    return this.exams.saveMarks(user, examId, dto.records, true);
  }

  @Get("result-review")
  @RequirePermission("results.publish")
  review(@CurrentUser() user: AuthenticatedUser, @Query("examId") examId?: string) { return this.exams.review(user, examId); }

  @Post(":examId/publish-results")
  @RequirePermission("results.publish")
  publish(@CurrentUser() user: AuthenticatedUser, @Param("examId", ParseUUIDPipe) examId: string) { return this.exams.publish(user, examId); }
}
