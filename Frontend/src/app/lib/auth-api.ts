import type { RoleId } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000/api/v1";
const AUTH_STORAGE_KEY = "smls.auth";

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

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
    expiresAt: string;
  };
  user?: {
    id: string;
    displayName: string;
    email: string | null;
    phone: string | null;
    mfaEnabled: boolean;
  };
  roles?: AuthRole[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export class NetworkError extends Error {
  constructor() {
    super("Cannot reach the SMLS API. Check that the backend server is running on port 3000.");
  }
}

export async function login(identifier: string, password: string): Promise<AuthSession> {
  return request<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function refresh(refreshToken: string): Promise<AuthSession> {
  return request<AuthSession>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logout(refreshToken: string): Promise<void> {
  await request("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function me(accessToken: string): Promise<AuthSession> {
  return request<AuthSession>("/auth/me", {
    method: "GET",
    headers: { authorization: `Bearer ${accessToken}` },
  });
}

export async function switchContext(accessToken: string, membershipId: string): Promise<AuthSession> {
  return request<AuthSession>("/auth/context", {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ membershipId }),
  });
}

export async function authenticatedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = readAuth();
  if (!session?.accessToken) {
    throw new ApiError("Sign in required", 401);
  }
  try {
    return await request<T>(path, {
      ...init,
      headers: {
        authorization: `Bearer ${session.accessToken}`,
        ...init.headers,
      },
    });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !session.refreshToken) {
      throw error;
    }
    const refreshed = await refresh(session.refreshToken);
    saveAuth(refreshed);
    return request<T>(path, {
      ...init,
      headers: {
        authorization: `Bearer ${refreshed.accessToken}`,
        ...init.headers,
      },
    });
  }
}

export function saveAuth(session: AuthSession) {
  const existing = readAuth();
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...existing, ...session }));
}

export function readAuth(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function roleFromSession(session: AuthSession): RoleId | null {
  const key = session.roles?.[0]?.roleKey;
  if (key === "teacher" || key === "student" || key === "parent" || key === "admin" || key === "principal" || key === "accountant" || key === "platform") {
    return key;
  }
  return null;
}

async function request<T = unknown>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new NetworkError();
  }
  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(messageFromBody(body) ?? "Request failed", response.status);
  }

  return body as T;
}

function messageFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const message = (body as { message?: unknown }).message;
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return null;
}
