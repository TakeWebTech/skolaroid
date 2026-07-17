import { Body, Controller, Get, Inject, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { CreateStudentDto } from "./people.dto";
import { PeopleService } from "./people.service";

@ApiTags("people")
@ApiBearerAuth()
@Controller("people")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PeopleController {
  constructor(@Inject(PeopleService) private readonly people: PeopleService) {}

  @Get("students")
  @RequirePermission("students.view")
  students(
    @CurrentUser() user: AuthenticatedUser,
    @Query("search") search?: string,
    @Query("classId") classId?: string
  ) {
    return this.people.listStudents(user, { search, classId });
  }

  @Post("students")
  @RequirePermission("students.create")
  createStudent(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStudentDto) {
    return this.people.createStudent(user, dto);
  }
}
