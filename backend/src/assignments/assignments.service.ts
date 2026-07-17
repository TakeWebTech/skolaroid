import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CreateAssignmentDto, GradeSubmissionDto, SubmitAssignmentDto } from "./assignments.dto";
import { AssignmentSummary, GradeQueueItem, StudentTask } from "./assignments.types";

@Injectable()
export class AssignmentsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listTeacherAssignments(user: AuthenticatedUser): Promise<AssignmentSummary[]> {
    const { tenantId, branchId } = this.requireContext(user);
    const assignments = await this.prisma.assignment.findMany({
      where: { tenantId, branchId },
      include: { class: true, submissions: true },
      orderBy: { dueAt: "asc" }
    });
    return assignments.map(toAssignmentSummary);
  }

  async create(user: AuthenticatedUser, dto: CreateAssignmentDto): Promise<AssignmentSummary> {
    const { tenantId, branchId } = this.requireContext(user);
    const academicClass = await this.prisma.academicClass.findFirst({
      where: { id: dto.classId, tenantId, branchId }
    });
    if (!academicClass) throw new NotFoundException("Class not found");

    const assignment = await this.prisma.assignment.create({
      data: {
        tenantId,
        branchId,
        classId: dto.classId,
        createdById: user.userId,
        title: dto.title.trim(),
        subject: dto.subject.trim(),
        instructions: dto.instructions.trim(),
        dueAt: new Date(dto.dueAt),
        totalMarks: dto.totalMarks,
        submissionType: dto.submissionType,
        status: "DRAFT"
      },
      include: { class: true, submissions: true }
    });

    await this.audit(user, "assignment.create", assignment.id, { classId: dto.classId });
    return toAssignmentSummary(assignment);
  }

  async publish(user: AuthenticatedUser, assignmentId: string): Promise<AssignmentSummary> {
    const assignment = await this.findAssignmentForUser(user, assignmentId);
    if (assignment.status === "ARCHIVED") throw new ForbiddenException("Archived assignment cannot be published");

    const enrolled = await this.prisma.enrollment.findMany({
      where: {
        tenantId: assignment.tenantId,
        branchId: assignment.branchId,
        classId: assignment.classId,
        status: "ACTIVE"
      },
      select: { studentId: true }
    });
    if (enrolled.length === 0) throw new BadRequestException("Cannot publish assignment to an empty class");

    await this.prisma.$transaction([
      this.prisma.assignment.update({
        where: { id: assignment.id },
        data: { status: "PUBLISHED", publishedAt: new Date() }
      }),
      ...enrolled.map((enrollment) =>
        this.prisma.assignmentSubmission.upsert({
          where: { assignmentId_studentId: { assignmentId: assignment.id, studentId: enrollment.studentId } },
          update: {},
          create: {
            tenantId: assignment.tenantId,
            branchId: assignment.branchId,
            assignmentId: assignment.id,
            studentId: enrollment.studentId,
            status: "ASSIGNED"
          }
        })
      )
    ]);

    await this.audit(user, "assignment.publish", assignment.id, { assignedCount: enrolled.length });
    const updated = await this.findAssignmentForUser(user, assignment.id);
    return toAssignmentSummary(updated);
  }

  async listStudentTasks(user: AuthenticatedUser): Promise<StudentTask[]> {
    const { tenantId, branchId } = this.requireContext(user);
    const displayName = await this.currentUserDisplayName(user);
    const student = await this.prisma.studentProfile.findFirst({
      where: { tenantId, branchId, displayName: { equals: displayName, mode: "insensitive" } }
    });
    if (!student) return [];

    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { tenantId, branchId, studentId: student.id },
      include: { assignment: true },
      orderBy: { assignment: { dueAt: "asc" } }
    });
    return submissions.map((submission) => ({
      submissionId: submission.id,
      assignmentId: submission.assignmentId,
      title: submission.assignment.title,
      subject: submission.assignment.subject,
      instructions: submission.assignment.instructions,
      dueAt: submission.assignment.dueAt.toISOString(),
      totalMarks: submission.assignment.totalMarks,
      status: toSubmissionStatus(submission.status),
      marksAwarded: submission.marksAwarded,
      feedback: submission.feedback
    }));
  }

  async submitTask(user: AuthenticatedUser, submissionId: string, dto: SubmitAssignmentDto): Promise<StudentTask> {
    const { tenantId, branchId } = this.requireContext(user);
    const displayName = await this.currentUserDisplayName(user);
    const submission = await this.prisma.assignmentSubmission.findFirst({
      where: { id: submissionId, tenantId, branchId },
      include: { assignment: true, student: true }
    });
    if (!submission) throw new NotFoundException("Assignment submission not found");
    if (displayName.toLowerCase() !== submission.student.displayName.toLowerCase()) {
      throw new ForbiddenException("Cannot submit work for another student");
    }
    if (submission.status === "GRADED") {
      throw new ForbiddenException("Graded work cannot be resubmitted");
    }

    const updated = await this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        status: "SUBMITTED",
        responseText: dto.responseText.trim(),
        submittedAt: new Date()
      },
      include: { assignment: true }
    });
    await this.audit(user, "assignment.submit", updated.assignmentId, { submissionId });
    return {
      submissionId: updated.id,
      assignmentId: updated.assignmentId,
      title: updated.assignment.title,
      subject: updated.assignment.subject,
      instructions: updated.assignment.instructions,
      dueAt: updated.assignment.dueAt.toISOString(),
      totalMarks: updated.assignment.totalMarks,
      status: toSubmissionStatus(updated.status),
      marksAwarded: updated.marksAwarded,
      feedback: updated.feedback
    };
  }

  async gradeQueue(user: AuthenticatedUser): Promise<GradeQueueItem[]> {
    const { tenantId, branchId } = this.requireContext(user);
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { tenantId, branchId, status: { in: ["SUBMITTED", "GRADED"] } },
      include: { assignment: { include: { class: true } }, student: { include: { enrollments: true } } },
      orderBy: { submittedAt: "asc" }
    });
    return submissions.map((submission) => {
      const enrollment = submission.student.enrollments.find((item) => item.classId === submission.assignment.classId);
      return {
        submissionId: submission.id,
        assignmentId: submission.assignmentId,
        assignmentTitle: submission.assignment.title,
        classCode: submission.assignment.class.code,
        studentId: submission.studentId,
        studentName: submission.student.displayName,
        rollNo: enrollment?.rollNo ?? null,
        responseText: submission.responseText,
        submittedAt: submission.submittedAt?.toISOString() ?? null,
        totalMarks: submission.assignment.totalMarks,
        marksAwarded: submission.marksAwarded,
        feedback: submission.feedback,
        status: toSubmissionStatus(submission.status)
      };
    });
  }

  async grade(user: AuthenticatedUser, submissionId: string, dto: GradeSubmissionDto): Promise<GradeQueueItem> {
    const { tenantId, branchId } = this.requireContext(user);
    const submission = await this.prisma.assignmentSubmission.findFirst({
      where: { id: submissionId, tenantId, branchId },
      include: { assignment: { include: { class: true } }, student: { include: { enrollments: true } } }
    });
    if (!submission) throw new NotFoundException("Assignment submission not found");
    if (dto.marksAwarded > submission.assignment.totalMarks) {
      throw new BadRequestException("Marks cannot exceed assignment total");
    }

    const updated = await this.prisma.assignmentSubmission.update({
      where: { id: submission.id },
      data: {
        status: "GRADED",
        marksAwarded: dto.marksAwarded,
        feedback: dto.feedback ?? null,
        gradedAt: new Date(),
        gradedById: user.userId
      },
      include: { assignment: { include: { class: true } }, student: { include: { enrollments: true } } }
    });
    await this.audit(user, "assignment.grade", updated.assignmentId, { submissionId, marksAwarded: dto.marksAwarded });
    const enrollment = updated.student.enrollments.find((item) => item.classId === updated.assignment.classId);
    return {
      submissionId: updated.id,
      assignmentId: updated.assignmentId,
      assignmentTitle: updated.assignment.title,
      classCode: updated.assignment.class.code,
      studentId: updated.studentId,
      studentName: updated.student.displayName,
      rollNo: enrollment?.rollNo ?? null,
      responseText: updated.responseText,
      submittedAt: updated.submittedAt?.toISOString() ?? null,
      totalMarks: updated.assignment.totalMarks,
      marksAwarded: updated.marksAwarded,
      feedback: updated.feedback,
      status: toSubmissionStatus(updated.status)
    };
  }

  private async findAssignmentForUser(user: AuthenticatedUser, assignmentId: string) {
    const { tenantId, branchId } = this.requireContext(user);
    const assignment = await this.prisma.assignment.findFirst({
      where: { id: assignmentId, tenantId, branchId },
      include: { class: true, submissions: true }
    });
    if (!assignment) throw new NotFoundException("Assignment not found");
    return assignment;
  }

  private requireContext(user: AuthenticatedUser): { tenantId: string; branchId: string } {
    if (!user.activeTenantId || !user.activeBranchId) {
      throw new ForbiddenException("Active tenant and branch context are required");
    }
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        tenantId: user.activeTenantId,
        branchId: user.activeBranchId,
        actorId: user.userId,
        action,
        resource: "assignment",
        resourceId,
        metadata
      }
    });
  }

  private async currentUserDisplayName(user: AuthenticatedUser): Promise<string> {
    const record = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { displayName: true }
    });
    if (!record) throw new ForbiddenException("Authenticated user record not found");
    return record.displayName;
  }
}

function toAssignmentSummary(assignment: {
  id: string;
  classId: string;
  title: string;
  subject: string;
  instructions: string;
  dueAt: Date;
  totalMarks: number;
  submissionType: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  class: { code: string; name: string };
  submissions: Array<{ status: "ASSIGNED" | "SUBMITTED" | "GRADED" }>;
}): AssignmentSummary {
  return {
    id: assignment.id,
    classId: assignment.classId,
    classCode: assignment.class.code,
    className: assignment.class.name,
    title: assignment.title,
    subject: assignment.subject,
    instructions: assignment.instructions,
    dueAt: assignment.dueAt.toISOString(),
    totalMarks: assignment.totalMarks,
    submissionType: assignment.submissionType,
    status: assignment.status === "PUBLISHED" ? "published" : assignment.status === "ARCHIVED" ? "archived" : "draft",
    submittedCount: assignment.submissions.filter((item) => item.status === "SUBMITTED" || item.status === "GRADED").length,
    assignedCount: assignment.submissions.length
  };
}

function toSubmissionStatus(status: "ASSIGNED" | "SUBMITTED" | "GRADED"): "assigned" | "submitted" | "graded" {
  switch (status) {
    case "ASSIGNED":
      return "assigned";
    case "SUBMITTED":
      return "submitted";
    case "GRADED":
      return "graded";
  }
}
