import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { AssignmentsService } from "./assignments.service";
import { CreateAssignmentDto, GradeSubmissionDto, SubmitAssignmentDto } from "./assignments.dto";

@ApiTags("assignments")
@ApiBearerAuth()
@Controller("assignments")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AssignmentsController {
  constructor(@Inject(AssignmentsService) private readonly assignments: AssignmentsService) {}

  @Get()
  @RequirePermission("assignments.create")
  listTeacherAssignments(@CurrentUser() user: AuthenticatedUser) {
    return this.assignments.listTeacherAssignments(user);
  }

  @Post()
  @RequirePermission("assignments.create")
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAssignmentDto) {
    return this.assignments.create(user, dto);
  }

  @Post(":assignmentId/publish")
  @RequirePermission("assignments.create")
  publish(@CurrentUser() user: AuthenticatedUser, @Param("assignmentId", ParseUUIDPipe) assignmentId: string) {
    return this.assignments.publish(user, assignmentId);
  }

  @Get("tasks/me")
  @RequirePermission("tasks.submit")
  myTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.assignments.listStudentTasks(user);
  }

  @Post("submissions/:submissionId/submit")
  @RequirePermission("tasks.submit")
  submitTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param("submissionId", ParseUUIDPipe) submissionId: string,
    @Body() dto: SubmitAssignmentDto
  ) {
    return this.assignments.submitTask(user, submissionId, dto);
  }

  @Get("submissions/grade-queue")
  @RequirePermission("submissions.grade")
  gradeQueue(@CurrentUser() user: AuthenticatedUser) {
    return this.assignments.gradeQueue(user);
  }

  @Post("submissions/:submissionId/grade")
  @RequirePermission("submissions.grade")
  grade(
    @CurrentUser() user: AuthenticatedUser,
    @Param("submissionId", ParseUUIDPipe) submissionId: string,
    @Body() dto: GradeSubmissionDto
  ) {
    return this.assignments.grade(user, submissionId, dto);
  }
}
