import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { CreateAnnouncementDto, SendMessageDto } from "./communication.dto";

@Injectable()
export class CommunicationService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async threads(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const conversations = await this.prisma.conversation.findMany({ where: { tenantId, branchId }, include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { updatedAt: "desc" } });
    return conversations.map((c) => ({ id: c.id, title: c.title, last: c.messages[0]?.body ?? "", updatedAt: c.updatedAt.toISOString() }));
  }

  async thread(user: AuthenticatedUser, id: string) {
    const { tenantId, branchId } = this.context(user);
    const conversation = await this.prisma.conversation.findFirst({ where: { id, tenantId, branchId }, include: { messages: { include: { sender: true }, orderBy: { createdAt: "asc" } } } });
    if (!conversation) throw new NotFoundException("Conversation not found");
    return { id: conversation.id, title: conversation.title, messages: conversation.messages.map((m) => ({ id: m.id, senderId: m.senderId, senderName: m.sender.displayName, body: m.body, createdAt: m.createdAt.toISOString(), mine: m.senderId === user.userId })) };
  }

  async send(user: AuthenticatedUser, dto: SendMessageDto) {
    const conversation = await this.thread(user, dto.conversationId);
    const { tenantId, branchId } = this.context(user);
    const message = await this.prisma.message.create({ data: { tenantId, branchId, conversationId: conversation.id, senderId: user.userId, body: dto.body.trim() }, include: { sender: true } });
    await this.prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
    return { id: message.id, senderId: message.senderId, senderName: message.sender.displayName, body: message.body, createdAt: message.createdAt.toISOString(), mine: true };
  }

  async audiences(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const [students, parents, teachers, admins] = await Promise.all([
      this.prisma.studentProfile.count({ where: { tenantId, branchId, status: "ACTIVE" } }),
      this.prisma.userTenantMembership.count({ where: { tenantId, branchId, status: "ACTIVE", role: { key: "parent" } } }),
      this.prisma.userTenantMembership.count({ where: { tenantId, branchId, status: "ACTIVE", role: { key: "teacher" } } }),
      this.prisma.userTenantMembership.count({ where: { tenantId, branchId, status: "ACTIVE", role: { key: { in: ["admin", "principal"] } } } })
    ]);

    return [
      { id: "all", label: "Whole school", count: students + parents + teachers + admins },
      { id: "parent", label: "All parents", count: parents },
      { id: "student", label: "All students", count: students },
      { id: "teacher", label: "All teachers", count: teachers },
      { id: "admin", label: "Admin and principal team", count: admins }
    ];
  }

  async announcements(user: AuthenticatedUser) {
    const { tenantId, branchId } = this.context(user);
    const memberships = await this.prisma.userTenantMembership.findMany({
      where: { userId: user.userId, tenantId, branchId, status: "ACTIVE" },
      include: { role: true }
    });
    const roleKeys = memberships.map((membership) => membership.role.key);
    const audienceRoles = ["all", ...roleKeys];

    const announcements = await this.prisma.announcement.findMany({
      where: {
        tenantId,
        branchId,
        status: "SENT",
        audienceRole: { in: audienceRoles }
      },
      include: { createdBy: true },
      orderBy: { sentAt: "desc" },
      take: 10
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      audienceRole: announcement.audienceRole,
      by: announcement.createdBy.displayName,
      sentAt: announcement.sentAt?.toISOString() ?? announcement.createdAt.toISOString()
    }));
  }

  async createAnnouncement(user: AuthenticatedUser, dto: CreateAnnouncementDto) {
    const { tenantId, branchId } = this.context(user);
    const created = await this.prisma.announcement.create({ data: { tenantId, branchId, createdById: user.userId, title: dto.title.trim(), body: dto.body.trim(), audienceRole: dto.audienceRole, status: "DRAFT" } });
    return { ...created, status: created.status.toLowerCase(), createdAt: created.createdAt.toISOString(), sentAt: created.sentAt?.toISOString() ?? null };
  }

  async sendAnnouncement(user: AuthenticatedUser, id: string) {
    const { tenantId, branchId } = this.context(user);
    const existing = await this.prisma.announcement.findFirst({ where: { id, tenantId, branchId } });
    if (!existing) throw new NotFoundException("Announcement not found");
    const updated = await this.prisma.announcement.update({ where: { id }, data: { status: "SENT", sentAt: new Date() } });
    await this.audit(user, "announcement.send", id, { audienceRole: updated.audienceRole });
    return { ...updated, status: updated.status.toLowerCase(), createdAt: updated.createdAt.toISOString(), sentAt: updated.sentAt?.toISOString() ?? null };
  }

  private context(user: AuthenticatedUser) {
    if (!user.activeTenantId || !user.activeBranchId) throw new ForbiddenException("Active tenant and branch context are required");
    return { tenantId: user.activeTenantId, branchId: user.activeBranchId };
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { tenantId: user.activeTenantId, branchId: user.activeBranchId, actorId: user.userId, action, resource: "announcement", resourceId, metadata } });
  }
}
