import { SetMetadata } from "@nestjs/common";

export const REQUIRED_PERMISSION = "requiredPermission";

export function RequirePermission(permission: string) {
  return SetMetadata(REQUIRED_PERMISSION, permission);
}

