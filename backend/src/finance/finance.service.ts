import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CollectPaymentDto } from "./finance.dto";

@Injectable()
export class FinanceService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async summary(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const dues = await this.prisma.feeDemand.findMany({ where: { tenantId, branchId, status: "DUE" }, include: { student: { include: { enrollments: { include: { class: true } } } } }, orderBy: { dueDate: "asc" } });
    const payments = await this.prisma.payment.findMany({ where: { tenantId, branchId }, orderBy: { createdAt: "desc" }, take: 20 });
    return {
      totalDue: dues.reduce((sum, item) => sum + item.amount, 0),
      dueCount: dues.length,
      collected: payments.reduce((sum, item) => sum + item.amount, 0),
      dues: dues.map((d) => this.dueRow(d))
    };
  }

  async parentFees(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const student = await this.studentForUser(user);
    const demands = await this.prisma.feeDemand.findMany({ where: { tenantId, branchId, studentId: student.id }, orderBy: { dueDate: "asc" } });
    const payments = await this.prisma.payment.findMany({ where: { tenantId, branchId, studentId: student.id }, orderBy: { createdAt: "desc" } });
    return { student: { id: student.id, name: student.displayName }, demands, payments };
  }

  async collect(user: AuthenticatedUser, dto: CollectPaymentDto) {
    const { tenantId, branchId } = this.context(user);
    const demand = await this.prisma.feeDemand.findFirst({ where: { id: dto.demandId, tenantId, branchId }, include: { student: true } });
    if (!demand) throw new NotFoundException("Fee demand not found");
    if (demand.status === "PAID") throw new BadRequestException("Fee demand is already paid");
    if (dto.amount !== demand.amount) throw new BadRequestException("Partial payments are not enabled in this foundation slice");
    const receiptNo = `GF-${Date.now()}`;
    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({ data: { tenantId, branchId, demandId: demand.id, studentId: demand.studentId, collectedBy: user.userId, amount: dto.amount, method: dto.method, receiptNo } });
      await tx.feeDemand.update({ where: { id: demand.id }, data: { status: "PAID" } });
      return created;
    });
    await this.audit(user, "payment.collect", payment.id, { demandId: demand.id, amount: payment.amount, method: payment.method });
    return { ...payment, studentName: demand.student.displayName };
  }

  async checkout(user: AuthenticatedUser, dto: CollectPaymentDto) {
    const student = await this.studentForUser(user);
    const { tenantId, branchId } = this.context(user);
    const demand = await this.prisma.feeDemand.findFirst({ where: { id: dto.demandId, tenantId, branchId, studentId: student.id } });
    if (!demand) throw new NotFoundException("Fee demand not found");
    return this.collect(user, { ...dto, method: "ONLINE" });
  }

  private dueRow(d: { id: string; label: string; amount: number; dueDate: Date; status: "DUE" | "PAID"; student: { displayName: string; enrollments: Array<{ rollNo: string; class: { code: string; name: string } }> } }) {
    const enrollment = d.student.enrollments[0];
    return { id: d.id, label: d.label, amount: d.amount, dueDate: d.dueDate.toISOString().slice(0, 10), status: d.status.toLowerCase(), studentName: d.student.displayName, classCode: enrollment?.class.code ?? null, className: enrollment?.class.name ?? null, rollNo: enrollment?.rollNo ?? null };
  }

  private async studentForUser(user: AuthenticatedUser) {
    const record = await this.prisma.user.findUnique({ where: { id: user.userId }, select: { displayName: true } });
    if (!record) throw new ForbiddenException("Authenticated user record not found");
    const { tenantId, branchId } = this.context(user);
    const normalized = record.displayName.replace(/^Neha /, "Aarav ");
    const student = await this.prisma.studentProfile.findFirst({ where: { tenantId, branchId, displayName: { equals: normalized, mode: "insensitive" } } });
    if (!student) throw new NotFoundException("Linked student profile not found");
    return student;
  }

  private context(user: AuthenticatedUser) {
    if (!user.activeTenantId || !user.activeBranchId) throw new ForbiddenException("Active tenant and branch context are required");
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { tenantId: user.activeTenantId, branchId: user.activeBranchId, actorId: user.userId, action, resource: "payment", resourceId, metadata } });
  }
}
