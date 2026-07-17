import { IsEmail, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreatePlatformTenantDto {
  @IsString()
  @MaxLength(160)
  schoolName!: string;

  @IsString()
  @MaxLength(40)
  organizationId!: string;

  @IsString()
  @MaxLength(160)
  primaryDomain!: string;

  @IsString()
  @MaxLength(80)
  city!: string;

  @IsString()
  @MaxLength(80)
  state!: string;

  @IsString()
  @MaxLength(40)
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(160)
  adminName!: string;

  @IsEmail()
  adminEmail!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  studentCapacity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  planCode?: string;

  @IsString()
  @MaxLength(80)
  implementationOwner!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  onboardingNotes?: string;
}

export class CreatePlatformPlanDto {
  @IsString()
  @MaxLength(80)
  name!: string;

  @IsString()
  @MaxLength(40)
  code!: string;

  @IsIn(["monthly", "annual", "contract"])
  billingCycle!: string;

  @IsInt()
  @Min(0)
  basePrice!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class RequestPlatformTenantEditOtpDto {
  @IsOptional()
  @IsString()
  @MaxLength(240)
  reason?: string;
}

export class VerifyPlatformTenantEditOtpDto {
  @IsString()
  @MaxLength(6)
  otp!: string;
}

export class UpdatePlatformTenantProfileDto {
  @IsString()
  @MaxLength(200)
  editToken!: string;

  @IsString()
  @MaxLength(160)
  schoolName!: string;

  @IsString()
  @MaxLength(160)
  primaryDomain!: string;

  @IsString()
  @MaxLength(80)
  city!: string;

  @IsString()
  @MaxLength(80)
  state!: string;

  @IsString()
  @MaxLength(40)
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(160)
  adminName!: string;

  @IsEmail()
  adminEmail!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  studentCapacity?: number;

  @IsString()
  @MaxLength(80)
  implementationOwner!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  onboardingNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  planCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  renewsAt?: string;
}

export class PlatformSupportActionDto {
  @IsString()
  @MaxLength(200)
  editToken!: string;

  @IsString()
  @MaxLength(6)
  supportKey!: string;
}

export class ChangeTenantUserRoleDto extends PlatformSupportActionDto {
  @IsString()
  @MaxLength(80)
  roleId!: string;
}
