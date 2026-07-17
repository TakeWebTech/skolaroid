import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { CollectPaymentDto } from "./finance.dto";
import { FinanceService } from "./finance.service";

@ApiTags("finance")
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FinanceController {
  constructor(@Inject(FinanceService) private readonly finance: FinanceService) {}

  @Get("finance/fees/summary")
  @RequirePermission("fees.view")
  summary(@CurrentUser() user: AuthenticatedUser) { return this.finance.summary(user); }

  @Get("parent/fees")
  @RequirePermission("guardian.fees.view")
  parentFees(@CurrentUser() user: AuthenticatedUser) { return this.finance.parentFees(user); }

  @Post("payments/offline")
  @RequirePermission("payments.collect")
  collect(@CurrentUser() user: AuthenticatedUser, @Body() dto: CollectPaymentDto) { return this.finance.collect(user, dto); }

  @Post("payments/checkout")
  @RequirePermission("fees.pay")
  checkout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CollectPaymentDto) { return this.finance.checkout(user, dto); }
}
