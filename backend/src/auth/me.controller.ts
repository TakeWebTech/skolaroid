import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginResponse } from "./auth.types";
import { CurrentUser } from "./current-user";
import { SwitchContextDto } from "./dto/switch-context.dto";
import { AuthenticatedUser, JwtAuthGuard } from "./jwt-auth.guard";

export type MeResponse = Omit<LoginResponse, "accessToken" | "refreshToken">;

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth")
export class MeController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: "Current server-authorized user, session, roles, and permissions." })
  me(@CurrentUser() user: AuthenticatedUser): Promise<MeResponse> {
    return this.auth.me(user.userId, user.sessionId);
  }

  @Post("context")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: "Switch active tenant/branch context to an assigned membership." })
  switchContext(@CurrentUser() user: AuthenticatedUser, @Body() dto: SwitchContextDto): Promise<MeResponse> {
    return this.auth.switchContext(user.userId, user.sessionId, dto.membershipId);
  }
}
