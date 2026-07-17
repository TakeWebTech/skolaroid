import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { CommunicationController } from "./communication.controller";
import { CommunicationService } from "./communication.service";

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [CommunicationController],
  providers: [CommunicationService]
})
export class CommunicationModule {}
