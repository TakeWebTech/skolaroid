export interface AuthRole {
  membershipId: string;
  scope: "tenant" | "platform";
  tenantId: string | null;
  tenantName: string | null;
  branchId: string | null;
  branchName: string | null;
  roleId: string;
  roleKey: string;
  roleName: string;
  permissions: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
    expiresAt: string;
  };
  user: {
    id: string;
    displayName: string;
    email: string | null;
    phone: string | null;
    mfaEnabled: boolean;
  };
  roles: AuthRole[];
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
    expiresAt: string;
  };
}

export interface LogoutResponse {
  revoked: true;
}
