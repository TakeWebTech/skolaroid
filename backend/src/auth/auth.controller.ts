import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginResponse, LogoutResponse, RefreshResponse } from "./auth.types";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post("login")
  @ApiOkResponse({ description: "Authenticated session with server-authorized roles." })
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.auth.login(dto);
  }

  @Post("refresh")
  @ApiOkResponse({ description: "Rotated refresh token and new access token." })
  refresh(@Body() dto: RefreshTokenDto): Promise<RefreshResponse> {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post("logout")
  @ApiOkResponse({ description: "Session revoked." })
  logout(@Body() dto: LogoutDto): Promise<LogoutResponse> {
    return this.auth.logout(dto.refreshToken);
  }
}
