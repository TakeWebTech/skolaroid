import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PermissionGuard } from "./permission.guard";
import { RequirePermission } from "./require-permission.decorator";

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth/capabilities")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CapabilitiesController {
  @Get("attendance")
  @RequirePermission("attendance.mark")
  attendance() {
    return { allowed: true, permission: "attendance.mark" };
  }

  @Get("admin")
  @RequirePermission("admin.dashboard.view")
  admin() {
    return { allowed: true, permission: "admin.dashboard.view" };
  }

  @Get("finance")
  @RequirePermission("payments.collect")
  finance() {
    return { allowed: true, permission: "payments.collect" };
  }
}

