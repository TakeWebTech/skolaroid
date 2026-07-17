import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EnrollmentStatus, StudentStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CreateStudentDto } from "./people.dto";
import { StudentDirectoryResponse, StudentDirectoryRow } from "./people.types";

@Injectable()
export class PeopleService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listStudents(user: AuthenticatedUser, filters: { search?: string; classId?: string }): Promise<StudentDirectoryResponse> {
    const { tenantId, branchId } = this.requireContext(user);
    const search = filters.search?.trim();
    const classId = filters.classId?.trim();

    const classes = await this.prisma.academicClass.findMany({
      where: { tenantId, branchId },
      orderBy: { code: "asc" },
      select: { id: true, code: true, name: true }
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId,
        branchId,
        status: EnrollmentStatus.ACTIVE,
        ...(classId && classId !== "all" ? { classId } : {}),
        student: search
          ? {
              OR: [
                { displayName: { contains: search, mode: "insensitive" } },
                { admissionNo: { contains: search, mode: "insensitive" } }
              ]
            }
          : undefined
      },
      include: {
        class: true,
        student: true
      },
      orderBy: [{ class: { code: "asc" } }, { rollNo: "asc" }]
    });

    return {
      classes,
      students: enrollments.map((enrollment): StudentDirectoryRow => ({
        id: enrollment.student.id,
        admissionNo: enrollment.student.admissionNo,
        name: enrollment.student.displayName,
        status: fromStudentStatus(enrollment.student.status),
        classId: enrollment.classId,
        className: enrollment.class.name,
        classCode: enrollment.class.code,
        rollNo: enrollment.rollNo
      }))
    };
  }

  async createStudent(user: AuthenticatedUser, dto: CreateStudentDto): Promise<StudentDirectoryRow> {
    const { tenantId, branchId } = this.requireContext(user);
    const admissionNo = dto.admissionNo.trim().toUpperCase();
    const displayName = dto.displayName.trim();
    const rollNo = dto.rollNo?.trim() || admissionNo;

    const academicClass = await this.prisma.academicClass.findFirst({ where: { id: dto.classId, tenantId, branchId } });
    if (!academicClass) throw new NotFoundException("Class not found");

    const existingStudent = await this.prisma.studentProfile.findUnique({
      where: { tenantId_admissionNo: { tenantId, admissionNo } }
    });
    if (existingStudent) throw new ConflictException("Admission number already exists");

    const existingRoll = await this.prisma.enrollment.findUnique({
      where: { classId_rollNo: { classId: academicClass.id, rollNo } }
    });
    if (existingRoll) throw new ConflictException("Roll number already exists in this class");

    const student = await this.prisma.studentProfile.create({
      data: {
        tenantId,
        branchId,
        admissionNo,
        displayName,
        status: StudentStatus.ACTIVE,
        enrollments: {
          create: {
            tenantId,
            branchId,
            classId: academicClass.id,
            rollNo,
            status: EnrollmentStatus.ACTIVE
          }
        }
      },
      include: { enrollments: { include: { class: true }, where: { status: EnrollmentStatus.ACTIVE }, take: 1 } }
    });
    await this.audit(user, "student.create", student.id, { admissionNo, classId: academicClass.id });

    const enrollment = student.enrollments[0];
    return {
      id: student.id,
      admissionNo: student.admissionNo,
      name: student.displayName,
      status: fromStudentStatus(student.status),
      classId: enrollment?.classId ?? null,
      className: enrollment?.class.name ?? null,
      classCode: enrollment?.class.code ?? null,
      rollNo: enrollment?.rollNo ?? null
    };
  }

  private requireContext(user: AuthenticatedUser): { tenantId: string; branchId: string } {
    if (!user.activeTenantId || !user.activeBranchId) {
      throw new ForbiddenException("Active tenant and branch context are required");
    }
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { tenantId: user.activeTenantId, branchId: user.activeBranchId, actorId: user.userId, action, resource: "student", resourceId, metadata } });
  }
}

function fromStudentStatus(status: StudentStatus): StudentDirectoryRow["status"] {
  switch (status) {
    case StudentStatus.ACTIVE:
      return "active";
    case StudentStatus.INACTIVE:
      return "inactive";
    case StudentStatus.ALUMNI:
      return "alumni";
  }
}
