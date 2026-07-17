import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, createHash } from "node:crypto";
import * as argon2 from "argon2";
import type { Prisma } from "@prisma/client";
import { AuthenticatedUser } from "../auth/jwt-auth.guard";
import { PrismaService } from "../database/prisma.service";
import { ChangeTenantUserRoleDto, CreatePlatformPlanDto, CreatePlatformTenantDto, PlatformSupportActionDto, RequestPlatformTenantEditOtpDto, UpdatePlatformTenantProfileDto, VerifyPlatformTenantEditOtpDto } from "./platform.dto";

const DEVELOPMENT_EDIT_OTP = "ABC123";
const DEVELOPMENT_SUPPORT_KEY = "ABC123";
const DEVELOPMENT_RESET_PASSWORD = "Password123!";
const OTP_TTL_MINUTES = 10;
const EDIT_TOKEN_TTL_MINUTES = 15;

@Injectable()
export class PlatformService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async organizationIdSuggestion(name: string, city?: string) {
    const base = this.slug(name || "school").slice(0, 18);
    const cityCode = this.slug(city || "").slice(0, 6);
    let candidate = `ORG-${base}${cityCode ? `-${cityCode}` : ""}`.toUpperCase();
    let suffix = 1;
    while (await this.prisma.platformTenantProfile.findUnique({ where: { organizationId: candidate } })) {
      suffix += 1;
      candidate = `ORG-${base}-${suffix}`.toUpperCase();
    }
    return { organizationId: candidate };
  }

  async tenants() {
    const tenants = await this.prisma.tenant.findMany({
      where: { platformProfile: { isNot: null } },
      include: { platformProfile: true, subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 1 }, _count: { select: { students: true } } },
      orderBy: { createdAt: "desc" }
    });
    return tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      orgId: tenant.platformProfile?.organizationId ?? tenant.code,
      domain: tenant.platformProfile?.primaryDomain ?? null,
      city: tenant.platformProfile?.city ?? null,
      state: tenant.platformProfile?.state ?? null,
      plan: tenant.subscriptions[0]?.plan.name ?? "No plan",
      status: tenant.status.toLowerCase(),
      students: tenant._count.students
    }));
  }

  async createTenant(user: AuthenticatedUser, dto: CreatePlatformTenantDto) {
    this.context(user);
    const code = this.slug(dto.organizationId);
    const organizationId = dto.organizationId.trim().toUpperCase();
    const primaryDomain = dto.primaryDomain.trim().toLowerCase();
    const existing = await this.prisma.tenant.findUnique({ where: { code } });
    if (existing) throw new ConflictException("Organization ID already exists");
    if (await this.prisma.platformTenantProfile.findUnique({ where: { organizationId } })) throw new ConflictException("Organization ID already exists");
    if (await this.prisma.platformTenantProfile.findUnique({ where: { primaryDomain } })) throw new ConflictException("Primary domain already exists");

    const plan = dto.planCode ? await this.prisma.platformPlan.findUnique({ where: { code: dto.planCode.trim().toUpperCase() } }) : null;
    if (dto.planCode && !plan) throw new NotFoundException("Plan not found");

    const tenant = await this.prisma.$transaction(async (tx) => {
      const created = await tx.tenant.create({ data: { code, name: dto.schoolName.trim(), status: "ACTIVE" } });
      await tx.branch.create({ data: { tenantId: created.id, code: "main", name: "Main Campus" } });
      await tx.platformTenantProfile.create({
        data: {
          tenantId: created.id,
          organizationId,
          primaryDomain,
          city: dto.city.trim(),
          state: dto.state.trim(),
          phone: dto.phone.trim(),
          email: dto.email.trim().toLowerCase(),
          adminName: dto.adminName.trim(),
          adminEmail: dto.adminEmail.trim().toLowerCase(),
          studentCapacity: dto.studentCapacity ?? null,
          implementationOwner: dto.implementationOwner.trim(),
          onboardingNotes: dto.onboardingNotes?.trim() || null,
          supportKeyHash: this.hashSecret(DEVELOPMENT_SUPPORT_KEY),
          supportKeyRotatedAt: new Date()
        }
      });
      if (plan) {
        await tx.platformSubscription.create({ data: { tenantId: created.id, planId: plan.id, status: "ACTIVE" } });
      }
      return created;
    });
    await this.audit(user, "platform.tenant.create", tenant.id, { organizationId });
    return { id: tenant.id, name: tenant.name, orgId: organizationId, status: tenant.status.toLowerCase() };
  }

  async tenantProfile(id: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, platformProfile: { isNot: null } },
      include: {
        platformProfile: true,
        branches: { orderBy: { createdAt: "asc" } },
        memberships: { include: { user: true, role: true, branch: true }, orderBy: { createdAt: "asc" } },
        roles: { include: { permissions: { include: { permission: true } } }, orderBy: { name: "asc" } },
        subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" } },
        auditEvents: {
          where: {
            OR: [
              { tenantId: id },
              { resourceId: id, resource: "platform" }
            ]
          },
          include: { actor: true },
          orderBy: { createdAt: "desc" },
          take: 100
        },
        _count: {
          select: {
            students: true,
            branches: true,
            memberships: true,
            classes: true
          }
        }
      }
    });

    if (!tenant?.platformProfile) throw new NotFoundException("School profile not found");

    const roleOrder = new Map(tenant.roles
      .slice()
      .sort((a, b) => {
        if (a.key === "admin" && b.key !== "admin") return -1;
        if (b.key === "admin" && a.key !== "admin") return 1;
        return a.name.localeCompare(b.name);
      })
      .map((role, index) => [role.id, index + 1]));
    const currentSubscription = tenant.subscriptions[0] ?? null;
    return {
      id: tenant.id,
      name: tenant.name,
      code: tenant.code,
      status: tenant.status.toLowerCase(),
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
      organization: {
        organizationId: tenant.platformProfile.organizationId,
        primaryDomain: tenant.platformProfile.primaryDomain,
        city: tenant.platformProfile.city,
        state: tenant.platformProfile.state,
        phone: tenant.platformProfile.phone,
        email: tenant.platformProfile.email,
        studentCapacity: tenant.platformProfile.studentCapacity,
        onboardingNotes: tenant.platformProfile.onboardingNotes
      },
      contact: {
        adminName: tenant.platformProfile.adminName,
        adminEmail: tenant.platformProfile.adminEmail,
        implementationOwner: tenant.platformProfile.implementationOwner
      },
      counts: {
        students: tenant._count.students,
        branches: tenant._count.branches,
        users: tenant._count.memberships,
        classes: tenant._count.classes
      },
      branches: tenant.branches.map((branch) => ({
        id: branch.id,
        code: branch.code,
        name: branch.name,
        createdAt: branch.createdAt.toISOString()
      })),
      usersAndRoles: {
        users: tenant.memberships.map((membership, index) => ({
          membershipId: membership.id,
          userId: membership.userId,
          displayUserId: `${tenant.code}-usr-${String(index + 1).padStart(3, "0")}`,
          displayName: membership.user.displayName,
          email: membership.user.email,
          phone: membership.user.phone,
          status: membership.status,
          branchId: membership.branchId,
          branchName: membership.branch?.name ?? null,
          roleId: membership.roleId,
          roleKey: membership.role.key,
          roleName: membership.role.name,
          createdAt: membership.createdAt.toISOString()
        })),
        roles: tenant.roles
          .slice()
          .sort((a, b) => (roleOrder.get(a.id) ?? 999) - (roleOrder.get(b.id) ?? 999))
          .map((role) => ({
          id: role.id,
          displayRoleId: `${tenant.code}-rls-${String(roleOrder.get(role.id) ?? 0).padStart(3, "0")}`,
          key: role.key,
          name: role.name,
          system: role.system,
          permissions: role.permissions.map((item) => item.permission.key)
        }))
      },
      subscription: currentSubscription ? {
        id: currentSubscription.id,
        status: currentSubscription.status,
        startsAt: currentSubscription.startsAt.toISOString(),
        renewsAt: currentSubscription.renewsAt?.toISOString() ?? null,
        plan: {
          id: currentSubscription.plan.id,
          code: currentSubscription.plan.code,
          name: currentSubscription.plan.name,
          billingCycle: currentSubscription.plan.billingCycle.toLowerCase(),
          basePrice: currentSubscription.plan.basePrice,
          description: currentSubscription.plan.description
        }
      } : null,
      subscriptionHistory: tenant.subscriptions.map((subscription) => ({
        id: subscription.id,
        invoiceId: null,
        status: subscription.status,
        startsAt: subscription.startsAt.toISOString(),
        renewsAt: subscription.renewsAt?.toISOString() ?? null,
        planName: subscription.plan.name,
        planCode: subscription.plan.code,
        amount: subscription.plan.basePrice,
        paidAt: null,
        downloadUrl: null
      })),
      addOns: [],
      payments: [],
      auditLogs: tenant.auditEvents.map((event) => ({
        id: event.id,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId,
        actor: event.actor ? {
          id: event.actor.id,
          name: event.actor.displayName,
          email: event.actor.email
        } : null,
        metadata: event.metadata,
        createdAt: event.createdAt.toISOString()
      }))
    };
  }

  async requestTenantEditOtp(user: AuthenticatedUser, id: string, dto: RequestPlatformTenantEditOtpDto) {
    this.context(user);
    const profile = await this.prisma.platformTenantProfile.findUnique({ where: { tenantId: id }, include: { tenant: true } });
    if (!profile) throw new NotFoundException("School profile not found");

    const challenge = await this.prisma.platformTenantEditChallenge.create({
      data: {
        profileId: profile.id,
        actorId: user.userId,
        otpHash: this.hashSecret(DEVELOPMENT_EDIT_OTP),
        expiresAt: this.minutesFromNow(OTP_TTL_MINUTES)
      }
    });

    await this.audit(user, "platform.tenant.edit_otp.request", id, {
      challengeId: challenge.id,
      reason: dto.reason?.trim() || null,
      delivery: "development",
      destination: "platform user email"
    });

    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt.toISOString(),
      delivery: "development",
      destination: "platform user email"
    };
  }

  async verifyTenantEditOtp(user: AuthenticatedUser, id: string, dto: VerifyPlatformTenantEditOtpDto) {
    this.context(user);
    const profile = await this.prisma.platformTenantProfile.findUnique({ where: { tenantId: id } });
    if (!profile) throw new NotFoundException("School profile not found");

    const challenge = await this.prisma.platformTenantEditChallenge.findFirst({
      where: {
        profileId: profile.id,
        actorId: user.userId,
        usedAt: null,
        verifiedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: "desc" }
    });
    if (!challenge) throw new BadRequestException("Edit OTP request is expired or missing");

    if (challenge.otpHash !== this.hashSecret(dto.otp.trim().toUpperCase())) {
      throw new BadRequestException("Invalid edit OTP");
    }

    const editToken = randomBytes(36).toString("base64url");
    const updated = await this.prisma.platformTenantEditChallenge.update({
      where: { id: challenge.id },
      data: {
        verifiedAt: new Date(),
        editTokenHash: this.hashSecret(editToken),
        expiresAt: this.minutesFromNow(EDIT_TOKEN_TTL_MINUTES)
      }
    });

    await this.audit(user, "platform.tenant.edit_otp.verify", id, { challengeId: challenge.id });

    return {
      editToken,
      expiresAt: updated.expiresAt.toISOString()
    };
  }

  async updateTenantProfile(user: AuthenticatedUser, id: string, dto: UpdatePlatformTenantProfileDto) {
    this.context(user);
    const tenant = await this.prisma.tenant.findFirst({ where: { id, platformProfile: { isNot: null } }, include: { platformProfile: true, subscriptions: { orderBy: { createdAt: "desc" }, take: 1 } } });
    if (!tenant?.platformProfile) throw new NotFoundException("School profile not found");

    const challenge = await this.prisma.platformTenantEditChallenge.findFirst({
      where: {
        profileId: tenant.platformProfile.id,
        actorId: user.userId,
        editTokenHash: this.hashSecret(dto.editToken),
        verifiedAt: { not: null },
        usedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
    if (!challenge) throw new ForbiddenException("Verified edit session is required");

    const primaryDomain = dto.primaryDomain.trim().toLowerCase();
    const existingDomain = await this.prisma.platformTenantProfile.findUnique({ where: { primaryDomain } });
    if (existingDomain && existingDomain.tenantId !== id) throw new ConflictException("Primary domain already exists");

    const plan = dto.planCode ? await this.prisma.platformPlan.findUnique({ where: { code: dto.planCode.trim().toUpperCase() } }) : null;
    if (dto.planCode && !plan) throw new NotFoundException("Plan not found");

    const renewsAt = dto.renewsAt ? new Date(dto.renewsAt) : null;
    if (dto.renewsAt && Number.isNaN(renewsAt?.getTime())) throw new BadRequestException("Renew date is invalid");

    await this.prisma.$transaction(async (tx) => {
      await tx.tenant.update({ where: { id }, data: { name: dto.schoolName.trim() } });
      await tx.platformTenantProfile.update({
        where: { tenantId: id },
        data: {
          primaryDomain,
          city: dto.city.trim(),
          state: dto.state.trim(),
          phone: dto.phone.trim(),
          email: dto.email.trim().toLowerCase(),
          adminName: dto.adminName.trim(),
          adminEmail: dto.adminEmail.trim().toLowerCase(),
          studentCapacity: dto.studentCapacity ?? null,
          implementationOwner: dto.implementationOwner.trim(),
          onboardingNotes: dto.onboardingNotes?.trim() || null
        }
      });
      if (plan) {
        const current = tenant.subscriptions[0];
        if (current) {
          await tx.platformSubscription.update({ where: { id: current.id }, data: { planId: plan.id, renewsAt } });
        } else {
          await tx.platformSubscription.create({ data: { tenantId: id, planId: plan.id, renewsAt, status: "ACTIVE" } });
        }
      }
      await tx.platformTenantEditChallenge.update({ where: { id: challenge.id }, data: { usedAt: new Date() } });
      await tx.auditEvent.create({
        data: {
          actorId: user.userId,
          action: "platform.tenant.profile.update",
          resource: "platform",
          resourceId: id,
          metadata: { challengeId: challenge.id, planCode: plan?.code ?? null }
        }
      });
    });

    return this.tenantProfile(id);
  }

  async resetTenantUserPassword(user: AuthenticatedUser, tenantId: string, membershipId: string, dto: PlatformSupportActionDto) {
    const { tenant, challenge } = await this.verifySupportAction(user, tenantId, dto.editToken, dto.supportKey);
    const membership = await this.prisma.userTenantMembership.findFirst({ where: { id: membershipId, tenantId }, include: { user: true, role: true } });
    if (!membership) throw new NotFoundException("Tenant user not found");

    const nextSupportKey = this.generateSupportKey();
    const passwordHash = await argon2.hash(DEVELOPMENT_RESET_PASSWORD, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: membership.userId }, data: { passwordHash } });
      await tx.platformTenantProfile.update({
        where: { tenantId },
        data: { supportKeyHash: this.hashSecret(nextSupportKey), supportKeyRotatedAt: new Date() }
      });
      await tx.platformTenantEditChallenge.update({ where: { id: challenge.id }, data: { usedAt: new Date() } });
      await tx.auditEvent.create({
        data: {
          tenantId,
          branchId: membership.branchId,
          actorId: user.userId,
          action: "platform.support.user.password_reset",
          resource: "user",
          resourceId: membership.userId,
          metadata: {
            organizationId: tenant.platformProfile?.organizationId,
            organizationName: tenant.name,
            targetUserEmail: membership.user.email,
            targetRole: membership.role.key,
            supportKeyRotated: true
          }
        }
      });
    });

    return { reset: true, developmentPassword: DEVELOPMENT_RESET_PASSWORD, nextSupportKey };
  }

  async changeTenantUserRole(user: AuthenticatedUser, tenantId: string, membershipId: string, dto: ChangeTenantUserRoleDto) {
    const { tenant, challenge } = await this.verifySupportAction(user, tenantId, dto.editToken, dto.supportKey);
    const membership = await this.prisma.userTenantMembership.findFirst({ where: { id: membershipId, tenantId }, include: { user: true, role: true } });
    if (!membership) throw new NotFoundException("Tenant user not found");
    const nextRole = await this.prisma.role.findFirst({ where: { id: dto.roleId, tenantId } });
    if (!nextRole) throw new NotFoundException("Role not found in this organization");

    const nextSupportKey = this.generateSupportKey();
    await this.prisma.$transaction(async (tx) => {
      await tx.userTenantMembership.update({ where: { id: membership.id }, data: { roleId: nextRole.id } });
      await tx.platformTenantProfile.update({
        where: { tenantId },
        data: { supportKeyHash: this.hashSecret(nextSupportKey), supportKeyRotatedAt: new Date() }
      });
      await tx.platformTenantEditChallenge.update({ where: { id: challenge.id }, data: { usedAt: new Date() } });
      await tx.auditEvent.create({
        data: {
          tenantId,
          branchId: membership.branchId,
          actorId: user.userId,
          action: "platform.support.user.role_change",
          resource: "user_tenant_membership",
          resourceId: membership.id,
          metadata: {
            organizationId: tenant.platformProfile?.organizationId,
            organizationName: tenant.name,
            targetUserId: membership.userId,
            targetUserEmail: membership.user.email,
            previousRole: membership.role.key,
            nextRole: nextRole.key,
            supportKeyRotated: true
          }
        }
      });
    });

    return { changed: true, nextSupportKey };
  }

  async plans() {
    const plans = await this.prisma.platformPlan.findMany({ include: { _count: { select: { subscriptions: true } } }, orderBy: { createdAt: "desc" } });
    return plans.map((plan) => ({ id: plan.id, code: plan.code, name: plan.name, billingCycle: plan.billingCycle.toLowerCase(), basePrice: plan.basePrice, description: plan.description, subscriptions: plan._count.subscriptions }));
  }

  async createPlan(user: AuthenticatedUser, dto: CreatePlatformPlanDto) {
    this.context(user);
    const code = dto.code.trim().toUpperCase();
    if (await this.prisma.platformPlan.findUnique({ where: { code } })) throw new ConflictException("Plan code already exists");
    const plan = await this.prisma.platformPlan.create({
      data: {
        code,
        name: dto.name.trim(),
        billingCycle: dto.billingCycle.toUpperCase() as "MONTHLY" | "ANNUAL" | "CONTRACT",
        basePrice: dto.basePrice,
        description: dto.description?.trim() || null
      }
    });
    await this.audit(user, "platform.plan.create", plan.id, { code });
    return { id: plan.id, code: plan.code, name: plan.name, billingCycle: plan.billingCycle.toLowerCase(), basePrice: plan.basePrice, description: plan.description, subscriptions: 0 };
  }

  private context(user: AuthenticatedUser) {
    if (!user.platform) throw new ForbiddenException("Active platform staff context is required");
  }

  private slug(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "school";
  }

  private async audit(user: AuthenticatedUser, action: string, resourceId: string, metadata: Prisma.InputJsonObject) {
    await this.prisma.auditEvent.create({ data: { actorId: user.userId, action, resource: "platform", resourceId, metadata } });
  }

  private async verifySupportAction(user: AuthenticatedUser, tenantId: string, editToken: string, supportKey: string) {
    this.context(user);
    const tenant = await this.prisma.tenant.findFirst({ where: { id: tenantId, platformProfile: { isNot: null } }, include: { platformProfile: true } });
    if (!tenant?.platformProfile) throw new NotFoundException("School profile not found");
    if (tenant.platformProfile.supportKeyHash !== this.hashSecret(supportKey.trim().toUpperCase())) {
      throw new ForbiddenException("Invalid organization support key");
    }

    const challenge = await this.prisma.platformTenantEditChallenge.findFirst({
      where: {
        profileId: tenant.platformProfile.id,
        actorId: user.userId,
        editTokenHash: this.hashSecret(editToken),
        verifiedAt: { not: null },
        usedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
    if (!challenge) throw new ForbiddenException("Verified support edit session is required");
    return { tenant, challenge };
  }

  private hashSecret(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }

  private minutesFromNow(minutes: number) {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private generateSupportKey() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  }
}
