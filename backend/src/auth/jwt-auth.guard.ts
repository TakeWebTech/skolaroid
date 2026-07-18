import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SessionStatus, UserStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
  tenantIds: string[];
  platform?: boolean;
  activeTenantId?: string | null;
  activeBranchId?: string | null;
}

interface AccessTokenPayload {
  sub?: string;
  sid?: string;
  tenantIds?: string[];
  platform?: boolean;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined>; user?: AuthenticatedUser }>();
    const token = this.extractBearerToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException("Missing access token");
    }

    const payload = await this.verifyToken(token);
    if (!payload.sub || !payload.sid || !Array.isArray(payload.tenantIds)) {
      throw new UnauthorizedException("Invalid access token");
    }

    const session = await this.prisma.session.findFirst({
      where: {
        id: payload.sid,
        userId: payload.sub,
        status: SessionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
        user: { status: UserStatus.ACTIVE }
      }
    });

    if (!session) {
      throw new UnauthorizedException("Session is no longer active");
    }

    request.user = {
      userId: payload.sub,
      sessionId: payload.sid,
      tenantIds: payload.tenantIds,
      platform: payload.platform === true
    };

    return true;
  }

  private extractBearerToken(value: string | string[] | undefined): string | null {
    const header = Array.isArray(value) ? value[0] : value;
    if (!header?.startsWith("Bearer ")) return null;
    return header.slice("Bearer ".length).trim();
  }

  private async verifyToken(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        issuer: "skolaroid",
        audience: "skolaroid-web"
      });
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }
}
