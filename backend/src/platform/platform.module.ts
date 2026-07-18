import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { PluginsModule } from "../plugins/plugins.module";
import { PlatformController } from "./platform.controller";
import { PlatformService } from "./platform.service";

@Module({
  imports: [AuthModule, DatabaseModule, PluginsModule],
  controllers: [PlatformController],
  providers: [PlatformService]
})
export class PlatformModule {}
