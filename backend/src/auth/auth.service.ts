import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionStatus, UserStatus, MembershipStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { LoginResponse, LogoutResponse, RefreshResponse } from "./auth.types";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

const SESSION_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PasswordService) private readonly passwords: PasswordService,
    @Inject(TokenService) private readonly tokens: TokenService
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: dto.identifier.trim() }],
        status: UserStatus.ACTIVE
      },
      include: {
        platformProfile: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        },
        memberships: {
          where: { status: MembershipStatus.ACTIVE },
          include: {
            tenant: true,
            branch: true,
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await this.passwords.verify(user.passwordHash, dto.password);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const activePlatformProfile = user.platformProfile?.status === MembershipStatus.ACTIVE ? user.platformProfile : null;
    if (user.memberships.length === 0 && !activePlatformProfile) {
      throw new ForbiddenException("No active access");
    }

    const refreshToken = this.tokens.createRefreshToken();
    const refreshTokenHash = this.tokens.hashToken(refreshToken);
    const refreshTokenFamilyHash = this.tokens.hashToken(`${refreshToken}:family`);
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    const firstMembership = user.memberships[0] ?? null;

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        activeTenantId: firstMembership?.tenantId ?? null,
        activeBranchId: firstMembership?.branchId ?? null,
        refreshTokenHash,
        refreshTokenFamilyHash,
        status: SessionStatus.ACTIVE,
        expiresAt
      }
    });

    const accessToken = await this.tokens.createAccessToken({
      sub: user.id,
      sid: session.id,
      tenantIds: user.memberships.map((membership) => membership.tenantId),
      platform: Boolean(activePlatformProfile)
    });

    return {
      accessToken,
      refreshToken,
      session: {
        id: session.id,
        expiresAt: session.expiresAt.toISOString()
      },
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        mfaEnabled: user.mfaEnabled
      },
      roles: this.authRoles({ ...user, platformProfile: activePlatformProfile })
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const refreshTokenHash = this.tokens.hashToken(refreshToken);
    const session = await this.prisma.session.findFirst({
      where: {
        refreshTokenHash,
        status: SessionStatus.ACTIVE,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          include: {
            platformProfile: {
              include: { role: { include: { permissions: { include: { permission: true } } } } }
            },
            memberships: {
              where: { status: MembershipStatus.ACTIVE },
              include: { tenant: true }
            }
          }
        }
      }
    });

    if (!session || session.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const activePlatformProfile = session.user.platformProfile?.status === MembershipStatus.ACTIVE ? session.user.platformProfile : null;
    if (session.user.memberships.length === 0 && !activePlatformProfile) {
      await this.revokeSession(session.id);
      throw new ForbiddenException("No active access");
    }

    const nextRefreshToken = this.tokens.createRefreshToken();
    const nextRefreshTokenHash = this.tokens.hashToken(nextRefreshToken);
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

    const updatedSession = await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: nextRefreshTokenHash,
        expiresAt,
        status: SessionStatus.ACTIVE,
        revokedAt: null
      }
    });

    const accessToken = await this.tokens.createAccessToken({
      sub: session.userId,
      sid: updatedSession.id,
      tenantIds: session.user.memberships.map((membership) => membership.tenantId),
      platform: Boolean(activePlatformProfile)
    });

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      session: {
        id: updatedSession.id,
        expiresAt: updatedSession.expiresAt.toISOString()
      }
    };
  }

  async me(userId: string, sessionId: string): Promise<Omit<LoginResponse, "accessToken" | "refreshToken">> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        status: SessionStatus.ACTIVE,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          include: {
            platformProfile: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: { permission: true }
                    }
                  }
                }
              }
            },
            memberships: {
              where: { status: MembershipStatus.ACTIVE },
              include: {
                tenant: true,
                branch: true,
                role: {
                  include: {
                    permissions: {
                      include: { permission: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!session || session.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Session is no longer active");
    }

    const activePlatformProfile = session.user.platformProfile?.status === MembershipStatus.ACTIVE ? session.user.platformProfile : null;
    if (session.user.memberships.length === 0 && !activePlatformProfile) {
      throw new ForbiddenException("No active access");
    }

    return {
      session: {
        id: session.id,
        expiresAt: session.expiresAt.toISOString()
      },
      user: {
        id: session.user.id,
        displayName: session.user.displayName,
        email: session.user.email,
        phone: session.user.phone,
        mfaEnabled: session.user.mfaEnabled
      },
      roles: this.authRoles({ ...session.user, platformProfile: activePlatformProfile })
    };
  }

  async switchContext(userId: string, sessionId: string, membershipId: string): Promise<Omit<LoginResponse, "accessToken" | "refreshToken">> {
    const membership = await this.prisma.userTenantMembership.findFirst({
      where: {
        id: membershipId,
        userId,
        status: MembershipStatus.ACTIVE
      }
    });

    if (!membership) {
      throw new ForbiddenException("Context is not assigned to this user");
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        activeTenantId: membership.tenantId,
        activeBranchId: membership.branchId
      }
    });

    return this.me(userId, sessionId);
  }

  async logout(refreshToken: string): Promise<LogoutResponse> {
    const refreshTokenHash = this.tokens.hashToken(refreshToken);
    const session = await this.prisma.session.findFirst({
      where: { refreshTokenHash, status: SessionStatus.ACTIVE }
    });

    if (session) {
      await this.revokeSession(session.id);
    }

    return { revoked: true };
  }

  private async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date()
      }
    });
  }

  private authRoles(user: {
    platformProfile?: {
      id: string;
      roleId: string;
      status: MembershipStatus;
      role: {
        key: string;
        name: string;
        permissions: { permission: { key: string } }[];
      };
    } | null;
    memberships: {
      id: string;
      tenantId: string;
      tenant: { name: string };
      branchId: string | null;
      branch?: { name: string } | null;
      roleId: string;
      role: {
        key: string;
        name: string;
        permissions: { permission: { key: string } }[];
      };
    }[];
  }) {
    const tenantRoles = user.memberships.map((membership) => ({
      membershipId: membership.id,
      scope: "tenant" as const,
      tenantId: membership.tenantId,
      tenantName: membership.tenant.name,
      branchId: membership.branchId,
      branchName: membership.branch?.name ?? null,
      roleId: membership.roleId,
      roleKey: membership.role.key,
      roleName: membership.role.name,
      permissions: membership.role.permissions.map((rolePermission) => rolePermission.permission.key)
    }));

    if (!user.platformProfile) return tenantRoles;

    return [
      {
        membershipId: user.platformProfile.id,
        scope: "platform" as const,
        tenantId: null,
        tenantName: null,
        branchId: null,
        branchName: null,
        roleId: user.platformProfile.roleId,
        roleKey: user.platformProfile.role.key,
        roleName: user.platformProfile.role.name,
        permissions: user.platformProfile.role.permissions.map((rolePermission) => rolePermission.permission.key)
      },
      ...tenantRoles
    ];
  }
}
