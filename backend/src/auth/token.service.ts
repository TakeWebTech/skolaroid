import { randomBytes, createHash } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export interface AccessTokenClaims {
  sub: string;
  sid: string;
  tenantIds: string[];
  platform: boolean;
}

@Injectable()
export class TokenService {
  constructor(@Inject(JwtService) private readonly jwt: JwtService) {}

  createAccessToken(claims: AccessTokenClaims): Promise<string> {
    return this.jwt.signAsync(claims, {
      expiresIn: "15m",
      issuer: "smls",
      audience: "smls-web"
    });
  }

  createRefreshToken(): string {
    return randomBytes(48).toString("base64url");
  }

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
