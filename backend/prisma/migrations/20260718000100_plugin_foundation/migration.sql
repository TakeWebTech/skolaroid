CREATE TYPE "PluginScope" AS ENUM ('PLATFORM', 'TENANT', 'BOTH');
CREATE TYPE "PluginInstallationStatus" AS ENUM ('INSTALLED', 'DISABLED', 'ERROR');
CREATE TYPE "PluginSyncJobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');

CREATE TABLE "plugin_definitions" (
  "id" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "scope" "PluginScope" NOT NULL,
  "capabilities" TEXT[],
  "system" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "plugin_definitions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plugin_installations" (
  "id" UUID NOT NULL,
  "plugin_id" UUID NOT NULL,
  "tenant_id" UUID,
  "platform_wide" BOOLEAN NOT NULL DEFAULT false,
  "status" "PluginInstallationStatus" NOT NULL DEFAULT 'INSTALLED',
  "config" JSONB,
  "installed_by_id" UUID,
  "installed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "plugin_installations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plugin_settings" (
  "id" UUID NOT NULL,
  "installation_id" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB,
  "encrypted" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "plugin_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plugin_sync_jobs" (
  "id" UUID NOT NULL,
  "plugin_id" UUID NOT NULL,
  "installation_id" UUID,
  "tenant_id" UUID,
  "plan_id" UUID,
  "capability" TEXT NOT NULL,
  "status" "PluginSyncJobStatus" NOT NULL DEFAULT 'PENDING',
  "payload" JSONB NOT NULL,
  "result" JSONB,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "run_after" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "started_at" TIMESTAMPTZ(6),
  "completed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "plugin_sync_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plugin_audit_logs" (
  "id" UUID NOT NULL,
  "plugin_id" UUID NOT NULL,
  "installation_id" UUID,
  "tenant_id" UUID,
  "actor_id" UUID,
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "resource_id" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "plugin_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "plugin_definitions_key_key" ON "plugin_definitions"("key");
CREATE INDEX "plugin_definitions_scope_idx" ON "plugin_definitions"("scope");
CREATE UNIQUE INDEX "plugin_installations_plugin_id_tenant_id_key" ON "plugin_installations"("plugin_id", "tenant_id");
CREATE INDEX "plugin_installations_tenant_id_status_idx" ON "plugin_installations"("tenant_id", "status");
CREATE INDEX "plugin_installations_platform_wide_status_idx" ON "plugin_installations"("platform_wide", "status");
CREATE UNIQUE INDEX "plugin_settings_installation_id_key_key" ON "plugin_settings"("installation_id", "key");
CREATE INDEX "plugin_sync_jobs_status_run_after_idx" ON "plugin_sync_jobs"("status", "run_after");
CREATE INDEX "plugin_sync_jobs_tenant_id_created_at_idx" ON "plugin_sync_jobs"("tenant_id", "created_at");
CREATE INDEX "plugin_sync_jobs_plugin_id_capability_idx" ON "plugin_sync_jobs"("plugin_id", "capability");
CREATE INDEX "plugin_audit_logs_tenant_id_created_at_idx" ON "plugin_audit_logs"("tenant_id", "created_at");
CREATE INDEX "plugin_audit_logs_actor_id_created_at_idx" ON "plugin_audit_logs"("actor_id", "created_at");
CREATE INDEX "plugin_audit_logs_plugin_id_action_idx" ON "plugin_audit_logs"("plugin_id", "action");

ALTER TABLE "plugin_installations" ADD CONSTRAINT "plugin_installations_plugin_id_fkey" FOREIGN KEY ("plugin_id") REFERENCES "plugin_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_installations" ADD CONSTRAINT "plugin_installations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_installations" ADD CONSTRAINT "plugin_installations_installed_by_id_fkey" FOREIGN KEY ("installed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "plugin_settings" ADD CONSTRAINT "plugin_settings_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "plugin_installations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_sync_jobs" ADD CONSTRAINT "plugin_sync_jobs_plugin_id_fkey" FOREIGN KEY ("plugin_id") REFERENCES "plugin_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_sync_jobs" ADD CONSTRAINT "plugin_sync_jobs_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "plugin_installations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "plugin_sync_jobs" ADD CONSTRAINT "plugin_sync_jobs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_sync_jobs" ADD CONSTRAINT "plugin_sync_jobs_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "platform_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "plugin_audit_logs" ADD CONSTRAINT "plugin_audit_logs_plugin_id_fkey" FOREIGN KEY ("plugin_id") REFERENCES "plugin_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_audit_logs" ADD CONSTRAINT "plugin_audit_logs_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "plugin_installations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "plugin_audit_logs" ADD CONSTRAINT "plugin_audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plugin_audit_logs" ADD CONSTRAINT "plugin_audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
