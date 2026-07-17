import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { ChangeTenantUserRoleDto, CreatePlatformPlanDto, CreatePlatformTenantDto, PlatformSupportActionDto, RequestPlatformTenantEditOtpDto, UpdatePlatformTenantProfileDto, VerifyPlatformTenantEditOtpDto } from "./platform.dto";
import { PlatformService } from "./platform.service";

@ApiTags("platform")
@ApiBearerAuth()
@Controller("platform")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PlatformController {
  constructor(@Inject(PlatformService) private readonly platform: PlatformService) {}

  @Get("tenants/organization-id-suggestion")
  @RequirePermission("platform.tenants.create")
  organizationIdSuggestion(@Query("name") name = "", @Query("city") city?: string) {
    return this.platform.organizationIdSuggestion(name, city);
  }

  @Get("tenants")
  @RequirePermission("platform.tenants.view")
  tenants() {
    return this.platform.tenants();
  }

  @Post("tenants")
  @RequirePermission("platform.tenants.create")
  createTenant(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePlatformTenantDto) {
    return this.platform.createTenant(user, dto);
  }

  @Get("tenants/:id/profile")
  @RequirePermission("platform.tenants.view")
  tenantProfile(@Param("id") id: string) {
    return this.platform.tenantProfile(id);
  }

  @Post("tenants/:id/edit-otp")
  @RequirePermission("platform.tenants.manage")
  requestTenantEditOtp(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: RequestPlatformTenantEditOtpDto) {
    return this.platform.requestTenantEditOtp(user, id, dto);
  }

  @Post("tenants/:id/edit-otp/verify")
  @RequirePermission("platform.tenants.manage")
  verifyTenantEditOtp(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: VerifyPlatformTenantEditOtpDto) {
    return this.platform.verifyTenantEditOtp(user, id, dto);
  }

  @Post("tenants/:id/profile")
  @RequirePermission("platform.tenants.manage")
  updateTenantProfile(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: UpdatePlatformTenantProfileDto) {
    return this.platform.updateTenantProfile(user, id, dto);
  }

  @Post("tenants/:id/users/:membershipId/reset-password")
  @RequirePermission("platform.tenants.manage")
  resetTenantUserPassword(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Param("membershipId") membershipId: string, @Body() dto: PlatformSupportActionDto) {
    return this.platform.resetTenantUserPassword(user, id, membershipId, dto);
  }

  @Post("tenants/:id/users/:membershipId/role")
  @RequirePermission("platform.tenants.manage")
  changeTenantUserRole(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Param("membershipId") membershipId: string, @Body() dto: ChangeTenantUserRoleDto) {
    return this.platform.changeTenantUserRole(user, id, membershipId, dto);
  }

  @Get("plans")
  @RequirePermission("platform.plans.view")
  plans() {
    return this.platform.plans();
  }

  @Post("plans")
  @RequirePermission("platform.plans.manage")
  createPlan(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePlatformPlanDto) {
    return this.platform.createPlan(user, dto);
  }
}
