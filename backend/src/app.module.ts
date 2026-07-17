import { AcademicsModule } from "./academics/academics.module";
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { AssignmentsModule } from "./assignments/assignments.module";
import { AdmissionsModule } from "./admissions/admissions.module";
import { CommunicationModule } from "./communication/communication.module";
import { DatabaseModule } from "./database/database.module";
import { ExamsModule } from "./exams/exams.module";
import { FinanceModule } from "./finance/finance.module";
import { HealthModule } from "./health/health.module";
import { PeopleModule } from "./people/people.module";
import { PlatformModule } from "./platform/platform.module";

@Module({
  imports: [DatabaseModule, HealthModule, AuthModule, AttendanceModule, PeopleModule, AssignmentsModule, ExamsModule, FinanceModule, AdmissionsModule, CommunicationModule, AcademicsModule, PlatformModule]
})
export class AppModule {}
