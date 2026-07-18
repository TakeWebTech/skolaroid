import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { ErpnextBusinessOpsPlugin } from "./adapters/erpnext-business-ops.plugin";
import { StrapiWebsiteCmsPlugin } from "./adapters/strapi-website-cms.plugin";
import { PluginRegistryService } from "./plugin-registry.service";
import { PluginsController } from "./plugins.controller";
import { PluginsService } from "./plugins.service";

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [PluginsController],
  providers: [
    PluginRegistryService,
    StrapiWebsiteCmsPlugin,
    ErpnextBusinessOpsPlugin,
    PluginsService,
  ],
  exports: [PluginRegistryService, PluginsService],
})
export class PluginsModule {}
