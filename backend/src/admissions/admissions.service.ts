import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CreateApplicationDto, DecideApplicationDto } from "./admissions.dto";

@Injectable()
export class AdmissionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const rows = await this.prisma.admissionApplication.findMany({ where: { tenantId, branchId }, orderBy: { submittedAt: "desc" } });
    return rows.map((a) => ({ ...a, stage: stage(a.stage), submittedAt: a.submittedAt.toISOString() }));
  }

  async create(user: AuthenticatedUser, dto: CreateApplicationDto) {
    const { tenantId, branchId } = this.context(user);
    const app = await this.prisma.admissionApplication.create({ data: { tenantId, branchId, ...dto, stage: "NEW" } });
    await this.audit(user, "admission.application.submit", app.id, { grade: dto.grade });
    return { ...app, stage: stage(app.stage), submittedAt: app.submittedAt.toISOString() };
  }

  async decide(user: AuthenticatedUser, id: string, decision: "offer" | "reject" | "document-request", dto: DecideApplicationDto) {
    const { tenantId, branchId } = this.context(user);
    const existing = await this.prisma.admissionApplication.findFirst({ where: { id, tenantId, branchId } });
    if (!existing) throw new NotFoundException("Application not found");
    const next = decision === "offer" ? "OFFERED" : decision === "reject" ? "REJECTED" : "UNDER_REVIEW";
    const updated = await this.prisma.admissionApplication.update({ where: { id }, data: { stage: next, notes: dto.notes ?? existing.notes, reviewedById: user.userId } });
    await this.audit(user, `admission.application.${decision}`, id, { notes: dto.notes ?? null });
    return { ...updated, stage: stage(updated.stage), submittedAt: updated.submittedAt.toISOString() };
  }

  private context(user: AuthenticatedUser) {
    if (!user.activeTenantId || !user.activeBranchId) throw new ForbiddenException("Active tenant and branch context are required");
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }
  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { tenantId: user.activeTenantId, branchId: user.activeBranchId, actorId: user.userId, action, resource: "admission_application", resourceId, metadata } });
  }
}

function stage(value: "NEW" | "UNDER_REVIEW" | "INTERVIEW" | "OFFERED" | "REJECTED") {
  return value === "UNDER_REVIEW" ? "Under review" : value === "OFFERED" ? "Offered" : value === "REJECTED" ? "Rejected" : value === "INTERVIEW" ? "Interview" : "New";
}
