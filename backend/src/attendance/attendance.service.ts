import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AttendanceSessionStatus, AttendanceStatus, EnrollmentStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { AttendanceMarkStatus, AttendanceRecordDto } from "./attendance.dto";
import { AttendanceClassSummary, AttendanceSessionResponse } from "./attendance.types";

@Injectable()
export class AttendanceService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listClasses(user: AuthenticatedUser): Promise<AttendanceClassSummary[]> {
    const { tenantId, branchId } = this.requireContext(user);
    const classes = await this.prisma.academicClass.findMany({
      where: { tenantId, branchId },
      orderBy: { code: "asc" }
    });
    return classes.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      subject: item.subject,
      room: item.room
    }));
  }

  async getOrCreateSession(user: AuthenticatedUser, classId: string, dateValue: string): Promise<AttendanceSessionResponse> {
    const { tenantId, branchId } = this.requireContext(user);
    const attendanceDate = this.parseDate(dateValue);
    const academicClass = await this.prisma.academicClass.findFirst({
      where: { id: classId, tenantId, branchId }
    });
    if (!academicClass) throw new NotFoundException("Class not found");

    const session = await this.prisma.attendanceSession.upsert({
      where: { classId_attendanceDate: { classId, attendanceDate } },
      update: {},
      create: {
        tenantId,
        branchId,
        classId,
        attendanceDate,
        status: AttendanceSessionStatus.DRAFT
      }
    });

    return this.sessionResponse(session.id, user);
  }

  async saveDraft(user: AuthenticatedUser, sessionId: string, records: AttendanceRecordDto[]): Promise<AttendanceSessionResponse> {
    const session = await this.findSessionForUser(user, sessionId);
    if (session.status === AttendanceSessionStatus.SUBMITTED) {
      throw new ForbiddenException("Submitted attendance cannot be edited");
    }

    await this.writeRecords(user, sessionId, records);
    await this.audit(user, "attendance.save", sessionId, records);
    return this.sessionResponse(sessionId, user);
  }

  async submit(user: AuthenticatedUser, sessionId: string, records: AttendanceRecordDto[]): Promise<AttendanceSessionResponse> {
    const session = await this.findSessionForUser(user, sessionId);
    if (session.status === AttendanceSessionStatus.SUBMITTED) {
      throw new ForbiddenException("Attendance has already been submitted");
    }

    await this.writeRecords(user, sessionId, records);
    await this.prisma.attendanceSession.update({
      where: { id: sessionId },
      data: {
        status: AttendanceSessionStatus.SUBMITTED,
        submittedAt: new Date(),
        submittedById: user.userId
      }
    });
    await this.audit(user, "attendance.submit", sessionId, records);
    return this.sessionResponse(sessionId, user);
  }

  private async writeRecords(user: AuthenticatedUser, sessionId: string, records: AttendanceRecordDto[]): Promise<void> {
    const { tenantId, branchId } = this.requireContext(user);
    const session = await this.findSessionForUser(user, sessionId);
    const enrolled = await this.prisma.enrollment.findMany({
      where: {
        tenantId,
        branchId,
        classId: session.classId,
        status: EnrollmentStatus.ACTIVE
      },
      select: { studentId: true }
    });
    const enrolledIds = new Set(enrolled.map((item) => item.studentId));
    const submittedIds = new Set(records.map((item) => item.studentId));

    if (submittedIds.size !== records.length) {
      throw new BadRequestException("Duplicate student attendance records");
    }

    for (const record of records) {
      if (!enrolledIds.has(record.studentId)) {
        throw new BadRequestException("Attendance record includes a student outside this class");
      }
    }

    await this.prisma.$transaction(
      records.map((record) =>
        this.prisma.attendanceRecord.upsert({
          where: { sessionId_studentId: { sessionId, studentId: record.studentId } },
          update: {
            status: toDbStatus(record.status),
            note: record.note ?? null,
            markedById: user.userId
          },
          create: {
            tenantId,
            branchId,
            sessionId,
            studentId: record.studentId,
            status: toDbStatus(record.status),
            note: record.note ?? null,
            markedById: user.userId
          }
        })
      )
    );
  }

  private async sessionResponse(sessionId: string, user: AuthenticatedUser): Promise<AttendanceSessionResponse> {
    const session = await this.findSessionForUser(user, sessionId);
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId: session.tenantId,
        branchId: session.branchId,
        classId: session.classId,
        status: EnrollmentStatus.ACTIVE
      },
      include: { student: true },
      orderBy: { rollNo: "asc" }
    });
    const records = await this.prisma.attendanceRecord.findMany({
      where: { sessionId: session.id }
    });
    const recordMap = new Map(records.map((record) => [record.studentId, fromDbStatus(record.status)]));

    return {
      id: session.id,
      classId: session.classId,
      className: session.class.name,
      classCode: session.class.code,
      subject: session.class.subject,
      date: session.attendanceDate.toISOString().slice(0, 10),
      status: session.status === AttendanceSessionStatus.SUBMITTED ? "submitted" : "draft",
      students: enrollments.map((enrollment) => ({
        id: enrollment.studentId,
        name: enrollment.student.displayName,
        rollNo: enrollment.rollNo
      })),
      records: Object.fromEntries(enrollments.map((enrollment) => [enrollment.studentId, recordMap.get(enrollment.studentId) ?? "present"]))
    };
  }

  private async findSessionForUser(user: AuthenticatedUser, sessionId: string) {
    const { tenantId, branchId } = this.requireContext(user);
    const session = await this.prisma.attendanceSession.findFirst({
      where: { id: sessionId, tenantId, branchId },
      include: { class: true }
    });
    if (!session) throw new NotFoundException("Attendance session not found");
    return session;
  }

  private async audit(user: AuthenticatedUser, action: string, sessionId: string, records: AttendanceRecordDto[]): Promise<void> {
    const { tenantId, branchId } = this.requireContext(user);
    const counts = records.reduce<Record<AttendanceMarkStatus, number>>(
      (acc, record) => {
        acc[record.status] += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0, leave: 0 }
    );
    await this.prisma.auditEvent.create({
      data: {
        tenantId,
        branchId,
        actorId: user.userId,
        action,
        resource: "attendance_session",
        resourceId: sessionId,
        metadata: { counts }
      }
    });
  }

  private requireContext(user: AuthenticatedUser): { tenantId: string; branchId: string } {
    if (!user.activeTenantId || !user.activeBranchId) {
      throw new ForbiddenException("Active tenant and branch context are required");
    }
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private parseDate(value: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new BadRequestException("Date must be YYYY-MM-DD");
    return new Date(`${value}T00:00:00.000Z`);
  }
}

function toDbStatus(status: AttendanceMarkStatus): AttendanceStatus {
  return {
    present: AttendanceStatus.PRESENT,
    absent: AttendanceStatus.ABSENT,
    late: AttendanceStatus.LATE,
    leave: AttendanceStatus.LEAVE
  }[status];
}

function fromDbStatus(status: AttendanceStatus): AttendanceMarkStatus {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return "present";
    case AttendanceStatus.ABSENT:
      return "absent";
    case AttendanceStatus.LATE:
      return "late";
    case AttendanceStatus.LEAVE:
      return "leave";
  }
}
