import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CreateExamDto, MarkRecordDto } from "./exams.dto";

@Injectable()
export class ExamsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listClasses(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    return this.prisma.academicClass.findMany({
      where: { tenantId, branchId },
      orderBy: { code: "asc" },
      select: { id: true, code: true, name: true, subject: true, room: true }
    });
  }

  async list(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const exams = await this.prisma.exam.findMany({ where: { tenantId, branchId }, include: { class: true, marks: true }, orderBy: { startDate: "desc" } });
    return exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      term: exam.term,
      subject: exam.subject,
      classId: exam.classId,
      className: exam.class.name,
      classCode: exam.class.code,
      maxMarks: exam.maxMarks,
      startDate: exam.startDate.toISOString().slice(0, 10),
      endDate: exam.endDate.toISOString().slice(0, 10),
      status: status(exam.status),
      marksCount: exam.marks.length
    }));
  }

  async create(user: AuthenticatedUser, dto: CreateExamDto) {
    const { tenantId, branchId } = this.context(user);
    const klass = await this.prisma.academicClass.findFirst({ where: { id: dto.classId, tenantId, branchId } });
    if (!klass) throw new NotFoundException("Class not found");
    const exam = await this.prisma.exam.create({
      data: {
        tenantId,
        branchId,
        classId: dto.classId,
        createdById: user.userId,
        name: dto.name.trim(),
        term: dto.term.trim(),
        subject: dto.subject.trim(),
        maxMarks: dto.maxMarks,
        startDate: new Date(`${dto.startDate}T00:00:00.000Z`),
        endDate: new Date(`${dto.endDate}T00:00:00.000Z`),
        status: "MARKS_ENTRY"
      },
      include: { class: true, marks: true }
    });
    await this.audit(user, "exam.create", exam.id, { classId: dto.classId });
    return (await this.list(user)).find((item) => item.id === exam.id);
  }

  async marksEntry(user: AuthenticatedUser, examId?: string) {
    const { tenantId, branchId } = this.context(user);
    const exam = examId
      ? await this.findExam(user, examId)
      : await this.prisma.exam.findFirst({ where: { tenantId, branchId }, include: { class: true, marks: true }, orderBy: { createdAt: "desc" } });
    if (!exam) throw new NotFoundException("Exam not found");
    const enrollments = await this.prisma.enrollment.findMany({
      where: { tenantId, branchId, classId: exam.classId, status: "ACTIVE" },
      include: { student: true },
      orderBy: { rollNo: "asc" }
    });
    return {
      id: exam.id,
      name: exam.name,
      term: exam.term,
      subject: exam.subject,
      className: exam.class.name,
      maxMarks: exam.maxMarks,
      status: status(exam.status),
      students: enrollments.map((enrollment) => ({ id: enrollment.studentId, name: enrollment.student.displayName, rollNo: enrollment.rollNo })),
      records: Object.fromEntries(exam.marks.map((mark) => [mark.studentId, { marks: mark.marks, absent: mark.absent, locked: mark.locked }]))
    };
  }

  async saveMarks(user: AuthenticatedUser, examId: string, records: MarkRecordDto[], submit: boolean) {
    const exam = await this.findExam(user, examId);
    if (exam.status === "RESULTS_PUBLISHED" || exam.status === "MARKS_SUBMITTED") throw new ForbiddenException("Marks are locked");
    this.validateMarks(exam.maxMarks, records);
    await this.writeMarks(user, exam, records, submit);
    if (submit) {
      await this.prisma.exam.update({ where: { id: exam.id }, data: { status: "MARKS_SUBMITTED" } });
      await this.audit(user, "marks.submit", exam.id, { count: records.length });
    } else {
      await this.audit(user, "marks.save", exam.id, { count: records.length });
    }
    return this.marksEntry(user, exam.id);
  }

  async review(user: AuthenticatedUser, examId?: string) {
    const entry = await this.marksEntry(user, examId);
    const values = Object.values(entry.records);
    const entered = values.filter((item) => item.absent || typeof item.marks === "number").length;
    const marks = values.filter((item) => typeof item.marks === "number").map((item) => item.marks as number);
    return {
      ...entry,
      completion: entry.students.length ? Math.round((entered / entry.students.length) * 100) : 0,
      average: marks.length ? Math.round(marks.reduce((sum, item) => sum + item, 0) / marks.length) : 0,
      anomalies: marks.filter((item) => item > entry.maxMarks).length
    };
  }

  async publish(user: AuthenticatedUser, examId: string) {
    const review = await this.review(user, examId);
    if (review.completion < 100) throw new BadRequestException("All marks or absences must be entered before publishing");
    await this.prisma.exam.update({ where: { id: examId }, data: { status: "RESULTS_PUBLISHED", publishedAt: new Date() } });
    await this.audit(user, "results.publish", examId, { completion: review.completion });
    return this.review(user, examId);
  }

  private async writeMarks(user: AuthenticatedUser, exam: Awaited<ReturnType<ExamsService["findExam"]>>, records: MarkRecordDto[], locked: boolean) {
    await this.prisma.$transaction(records.map((record) => this.prisma.examMark.upsert({
      where: { examId_studentId: { examId: exam.id, studentId: record.studentId } },
      update: { marks: record.absent ? null : record.marks ?? null, absent: record.absent, locked },
      create: { tenantId: exam.tenantId, branchId: exam.branchId, examId: exam.id, studentId: record.studentId, marks: record.absent ? null : record.marks ?? null, absent: record.absent, locked }
    })));
  }

  private validateMarks(maxMarks: number, records: MarkRecordDto[]) {
    for (const record of records) {
      if (!record.absent && typeof record.marks !== "number") throw new BadRequestException("Marks are required unless absent");
      if (typeof record.marks === "number" && record.marks > maxMarks) throw new BadRequestException("Marks cannot exceed max marks");
    }
  }

  private async findExam(user: AuthenticatedUser, examId: string) {
    const { tenantId, branchId } = this.context(user);
    const exam = await this.prisma.exam.findFirst({ where: { id: examId, tenantId, branchId }, include: { class: true, marks: true } });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  private context(user: AuthenticatedUser) {
    if (!user.activeTenantId || !user.activeBranchId) throw new ForbiddenException("Active tenant and branch context are required");
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { tenantId: user.activeTenantId, branchId: user.activeBranchId, actorId: user.userId, action, resource: "exam", resourceId, metadata } });
  }
}

function status(value: "DRAFT" | "MARKS_ENTRY" | "MARKS_SUBMITTED" | "RESULTS_PUBLISHED") {
  return value === "RESULTS_PUBLISHED" ? "published" : value === "MARKS_SUBMITTED" ? "marks_submitted" : value === "MARKS_ENTRY" ? "marks_entry" : "draft";
}
