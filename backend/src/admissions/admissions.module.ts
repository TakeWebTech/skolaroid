import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { AdmissionsController } from "./admissions.controller";
import { AdmissionsService } from "./admissions.service";

@Module({ imports: [AuthModule, DatabaseModule], controllers: [AdmissionsController], providers: [AdmissionsService] })
export class AdmissionsModule {}
