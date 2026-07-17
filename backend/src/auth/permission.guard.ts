import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MembershipStatus, SessionStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { AuthenticatedUser } from "./jwt-auth.guard";
import { REQUIRED_PERMISSION } from "./require-permission.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<string>(REQUIRED_PERMISSION, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!permission) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const user = request.user;
    if (!user) throw new UnauthorizedException("Missing authenticated user");

    const session = await this.prisma.session.findFirst({
      where: { id: user.sessionId, userId: user.userId, status: SessionStatus.ACTIVE },
      select: { activeTenantId: true, activeBranchId: true }
    });

    if (permission.startsWith("platform.")) {
      const profile = await this.prisma.platformUserProfile.findFirst({
        where: {
          userId: user.userId,
          status: MembershipStatus.ACTIVE,
          role: { permissions: { some: { permission: { key: permission } } } }
        }
      });

      if (!profile) {
        throw new ForbiddenException(`Missing permission: ${permission}`);
      }

      request.user = {
        ...user,
        platform: true,
        activeTenantId: null,
        activeBranchId: null
      };
      return true;
    }

    if (!session?.activeTenantId) throw new ForbiddenException("No active tenant context");

    const membership = await this.prisma.userTenantMembership.findFirst({
      where: {
        userId: user.userId,
        tenantId: session.activeTenantId,
        branchId: session.activeBranchId,
        status: MembershipStatus.ACTIVE,
        role: { permissions: { some: { permission: { key: permission } } } }
      }
    });

    if (!membership) {
      throw new ForbiddenException(`Missing permission: ${permission}`);
    }

    request.user = {
      ...user,
      activeTenantId: session.activeTenantId,
      activeBranchId: session.activeBranchId
    };
    return true;
  }
}
