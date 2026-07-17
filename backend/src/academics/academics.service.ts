import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CreateAcademicClassDto } from "./academics.dto";

@Injectable()
export class AcademicsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async structure(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const classes = await this.prisma.academicClass.findMany({
      where: { tenantId, branchId },
      orderBy: { code: "asc" },
      include: { _count: { select: { enrollments: true } } }
    });

    return {
      classes: classes.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        subject: item.subject,
        room: item.room,
        students: item._count.enrollments
      }))
    };
  }

  async createClass(user: AuthenticatedUser, dto: CreateAcademicClassDto) {
    const { tenantId, branchId } = this.context(user);
    const code = dto.code.trim().toUpperCase();
    const existing = await this.prisma.academicClass.findUnique({
      where: { tenantId_branchId_code: { tenantId, branchId, code } }
    });
    if (existing) throw new ConflictException("Class code already exists");

    const created = await this.prisma.academicClass.create({
      data: {
        tenantId,
        branchId,
        code,
        name: dto.name.trim(),
        subject: dto.subject?.trim() || null,
        room: dto.room?.trim() || null
      }
    });
    await this.audit(user, "academic-class.create", created.id, { code });
    return created;
  }

  private context(user: AuthenticatedUser) {
    if (!user.activeTenantId || !user.activeBranchId) throw new ForbiddenException("Active tenant and branch context are required");
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { tenantId: user.activeTenantId, branchId: user.activeBranchId, actorId: user.userId, action, resource: "academic-class", resourceId, metadata } });
  }
}
