import { authenticatedRequest } from "./auth-api";

export type PluginScope = "PLATFORM" | "TENANT" | "BOTH";
export type PluginInstallationStatus = "INSTALLED" | "DISABLED" | "ERROR";

export interface PluginInstallation {
  id: string;
  tenantId: string | null;
  platformWide: boolean;
  status: PluginInstallationStatus;
  config?: Record<string, unknown> | null;
  installedAt: string;
  updatedAt: string;
}

export interface PluginDefinition {
  id: string;
  key: string;
  name: string;
  scope: PluginScope;
  capabilities: string[];
  system: boolean;
  createdAt: string;
  updatedAt: string;
  installations: PluginInstallation[];
}

export interface PluginInstallResult extends PluginInstallation {
  plugin: Omit<PluginDefinition, "installations">;
}

export interface PluginSyncJob {
  id: string;
  capability: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";
  attempts: number;
  createdAt: string;
  completedAt: string | null;
  result: unknown;
  plugin: Omit<PluginDefinition, "installations">;
}

export interface PluginSyncRunResult {
  processed: number;
  succeeded: number;
  failed: number;
  results: Array<{ id: string; pluginKey: string; capability: string; status: string; message?: string }>;
}

export interface PluginSettingsResponse {
  pluginKey: string;
  installed: boolean;
  config: Record<string, unknown>;
}

export function listPlugins() {
  return authenticatedRequest<PluginDefinition[]>("/plugins");
}

export function installPlatformPlugin(key: string, config: Record<string, unknown> = {}) {
  return authenticatedRequest<PluginInstallResult>(`/plugins/${key}/install/platform`, {
    method: "POST",
    body: JSON.stringify({ config }),
  });
}

export function listPluginSyncJobs() {
  return authenticatedRequest<PluginSyncJob[]>("/plugins/sync/jobs");
}

export function runPluginSync(limit = 20, retryFailed = false) {
  return authenticatedRequest<PluginSyncRunResult>("/plugins/sync/run", {
    method: "POST",
    body: JSON.stringify({ limit, retryFailed }),
  });
}

export function getPlatformPluginSettings(key: string) {
  return authenticatedRequest<PluginSettingsResponse>(`/plugins/${key}/settings/platform`);
}

export function updatePlatformPluginSettings(key: string, config: Record<string, unknown>) {
  return authenticatedRequest<PluginSettingsResponse>(`/plugins/${key}/settings/platform`, {
    method: "POST",
    body: JSON.stringify({ config }),
  });
}
