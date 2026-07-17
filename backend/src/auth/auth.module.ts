import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CapabilitiesController } from "./capabilities.controller";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { MeController } from "./me.controller";
import { PermissionGuard } from "./permission.guard";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "development-only-change-me"
    })
  ],
  controllers: [AuthController, MeController, CapabilitiesController],
  providers: [AuthService, PasswordService, TokenService, JwtAuthGuard, PermissionGuard],
  exports: [JwtModule, AuthService, PasswordService, TokenService, JwtAuthGuard, PermissionGuard]
})
export class AuthModule {}
