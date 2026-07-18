import { Body, Controller, Get, Inject, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { PluginRegistryService } from "./plugin-registry.service";
import { PluginsService } from "./plugins.service";

@ApiTags("plugins")
@ApiBearerAuth()
@Controller("plugins")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PluginsController {
  constructor(
    @Inject(PluginRegistryService) private readonly registry: PluginRegistryService,
    @Inject(PluginsService) private readonly plugins: PluginsService,
  ) {}

  @Get()
  @RequirePermission("platform.settings.view")
  list() {
    return this.plugins.catalog();
  }

  @Get("tenants/:tenantId/installed")
  @RequirePermission("platform.tenants.view")
  tenantInstalled(@Param("tenantId") tenantId: string) {
    return this.plugins.tenantPlugins(tenantId);
  }

  @Get("sync/jobs")
  @RequirePermission("platform.settings.view")
  syncJobs() {
    return this.plugins.syncJobs();
  }

  @Post("sync/run")
  @RequirePermission("platform.settings.manage")
  runSync(@CurrentUser() user: AuthenticatedUser, @Body() body: { limit?: number; retryFailed?: boolean }) {
    return this.plugins.runPendingSyncJobs(user.userId, body.limit, body.retryFailed);
  }

  @Get(":key/settings/platform")
  @RequirePermission("platform.settings.view")
  platformSettings(@Param("key") key: string) {
    return this.plugins.platformSettings(key);
  }

  @Post(":key/settings/platform")
  @RequirePermission("platform.settings.manage")
  updatePlatformSettings(@CurrentUser() user: AuthenticatedUser, @Param("key") key: string, @Body() body: { config?: Record<string, unknown> }) {
    return this.plugins.updatePlatformSettings(key, user.userId, body.config ?? {});
  }

  @Get(":key")
  @RequirePermission("platform.settings.view")
  get(@Param("key") key: string) {
    return this.registry.find(key) ?? null;
  }

  @Post(":key/install/platform")
  @RequirePermission("platform.settings.manage")
  installPlatform(@CurrentUser() user: AuthenticatedUser, @Param("key") key: string, @Body() body: { config?: Record<string, unknown> }) {
    return this.plugins.platformInstall(key, user.userId, body.config);
  }

  @Post(":key/install/tenants/:tenantId")
  @RequirePermission("platform.tenants.manage")
  installTenant(@CurrentUser() user: AuthenticatedUser, @Param("key") key: string, @Param("tenantId") tenantId: string, @Body() body: { config?: Record<string, unknown> }) {
    return this.plugins.tenantInstall(key, tenantId, user.userId, body.config);
  }
}
