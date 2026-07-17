import { authenticatedRequest } from "./auth-api";

export interface PlatformTenantRow {
  id: string;
  name: string;
  orgId: string;
  domain: string | null;
  city: string | null;
  state: string | null;
  plan: string;
  status: string;
  students: number;
}

export interface PlatformPlanRow {
  id: string;
  code: string;
  name: string;
  billingCycle: string;
  basePrice: number;
  description: string | null;
  subscriptions: number;
}

export interface PlatformTenantProfile {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    organizationId: string;
    primaryDomain: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    studentCapacity: number | null;
    onboardingNotes: string | null;
  };
  contact: {
    adminName: string;
    adminEmail: string;
    implementationOwner: string;
  };
  counts: {
    students: number;
    branches: number;
    users: number;
    classes: number;
  };
  branches: Array<{ id: string; code: string; name: string; createdAt: string }>;
  usersAndRoles: {
    users: Array<{ membershipId: string; userId: string; displayUserId: string; displayName: string; email: string | null; phone: string | null; status: string; branchId: string | null; branchName: string | null; roleId: string; roleKey: string; roleName: string; createdAt: string }>;
    roles: Array<{ id: string; displayRoleId: string; key: string; name: string; system: boolean; permissions: string[] }>;
  };
  subscription: {
    id: string;
    status: string;
    startsAt: string;
    renewsAt: string | null;
    plan: {
      id: string;
      code: string;
      name: string;
      billingCycle: string;
      basePrice: number;
      description: string | null;
    };
  } | null;
  subscriptionHistory: Array<{ id: string; invoiceId: string | null; status: string; startsAt: string; renewsAt: string | null; planName: string; planCode: string; amount: number; paidAt: string | null; downloadUrl: string | null }>;
  addOns: Array<{ id: string; name: string; status: string; renewsAt: string | null }>;
  payments: Array<{ id: string; amount: number; status: string; paidAt: string; reference: string }>;
  auditLogs: Array<{ id: string; action: string; resource: string; resourceId: string | null; actor: { id: string; name: string; email: string | null } | null; metadata: unknown; createdAt: string }>;
}

export function listPlatformTenants() {
  return authenticatedRequest<PlatformTenantRow[]>("/platform/tenants");
}

export function getPlatformTenantProfile(id: string) {
  return authenticatedRequest<PlatformTenantProfile>(`/platform/tenants/${id}/profile`);
}

export function requestPlatformTenantEditOtp(id: string, reason?: string) {
  return authenticatedRequest<{ challengeId: string; expiresAt: string; delivery: string; destination: string }>(`/platform/tenants/${id}/edit-otp`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function verifyPlatformTenantEditOtp(id: string, otp: string) {
  return authenticatedRequest<{ editToken: string; expiresAt: string }>(`/platform/tenants/${id}/edit-otp/verify`, {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export function updatePlatformTenantProfile(id: string, payload: {
  editToken: string;
  schoolName: string;
  primaryDomain: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  adminName: string;
  adminEmail: string;
  studentCapacity?: number;
  implementationOwner: string;
  onboardingNotes?: string;
  planCode?: string;
  renewsAt?: string;
}) {
  return authenticatedRequest<PlatformTenantProfile>(`/platform/tenants/${id}/profile`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPlatformTenantUserPassword(id: string, membershipId: string, payload: { editToken: string; supportKey: string }) {
  return authenticatedRequest<{ reset: true; developmentPassword: string; nextSupportKey: string }>(`/platform/tenants/${id}/users/${membershipId}/reset-password`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function changePlatformTenantUserRole(id: string, membershipId: string, payload: { editToken: string; supportKey: string; roleId: string }) {
  return authenticatedRequest<{ changed: true; nextSupportKey: string }>(`/platform/tenants/${id}/users/${membershipId}/role`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function suggestOrganizationId(name: string, city: string) {
  const params = new URLSearchParams({ name, city });
  return authenticatedRequest<{ organizationId: string }>(`/platform/tenants/organization-id-suggestion?${params.toString()}`);
}

export function createPlatformTenant(payload: {
  schoolName: string;
  organizationId: string;
  primaryDomain: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  adminName: string;
  adminEmail: string;
  studentCapacity?: number;
  planCode?: string;
  implementationOwner: string;
  onboardingNotes?: string;
}) {
  return authenticatedRequest<PlatformTenantRow>("/platform/tenants", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listPlatformPlans() {
  return authenticatedRequest<PlatformPlanRow[]>("/platform/plans");
}

export function createPlatformPlan(payload: { name: string; code: string; billingCycle: string; basePrice: number; description?: string }) {
  return authenticatedRequest<PlatformPlanRow>("/platform/plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
