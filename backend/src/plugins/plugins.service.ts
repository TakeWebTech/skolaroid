import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { ErpnextBusinessOpsPlugin } from "./adapters/erpnext-business-ops.plugin";
import { StrapiWebsiteCmsPlugin } from "./adapters/strapi-website-cms.plugin";
import { PluginRegistryService } from "./plugin-registry.service";
import { BusinessOpsPlugin, PluginResult, PluginScope, SkolaroidPlugin, WebsiteCmsPlugin } from "./plugin.types";

function dbScope(scope: PluginScope) {
  if (scope === "platform") return "PLATFORM";
  if (scope === "tenant") return "TENANT";
  return "BOTH";
}

@Injectable()
export class PluginsService implements OnModuleInit {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PluginRegistryService) private readonly registry: PluginRegistryService,
    @Inject(StrapiWebsiteCmsPlugin) private readonly strapi: StrapiWebsiteCmsPlugin,
    @Inject(ErpnextBusinessOpsPlugin) private readonly erpnext: ErpnextBusinessOpsPlugin,
  ) {}

  async onModuleInit() {
    this.registry.register(this.strapi);
    this.registry.register(this.erpnext);
    for (const plugin of this.registry.list()) {
      await this.upsertDefinition(plugin);
    }
  }

  async catalog() {
    return this.prisma.pluginDefinition.findMany({
      include: {
        installations: {
          select: {
            id: true,
            tenantId: true,
            platformWide: true,
            status: true,
            config: true,
            installedAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async platformInstall(pluginKey: string, actorId: string, config?: Record<string, unknown>) {
    const plugin = await this.pluginDefinition(pluginKey);
    if (plugin.scope === "TENANT") throw new BadRequestException("This plugin can only be installed for a tenant");
    const existing = await this.prisma.pluginInstallation.findFirst({
      where: { pluginId: plugin.id, platformWide: true, tenantId: null },
    });
    const installation = existing ? await this.prisma.pluginInstallation.update({
      where: { id: existing.id },
      data: {
        platformWide: true,
        installedById: actorId,
        config: (config ?? {}) as Prisma.InputJsonObject,
        status: "INSTALLED",
      },
      include: { plugin: true },
    }) : await this.prisma.pluginInstallation.create({
      data: {
        pluginId: plugin.id,
        platformWide: true,
        installedById: actorId,
        config: (config ?? {}) as Prisma.InputJsonObject,
        status: "INSTALLED",
      },
      include: { plugin: true },
    });
    await this.audit(plugin.id, installation.id, null, actorId, "plugin.platform.install", "plugin", pluginKey, { configKeys: Object.keys(config ?? {}) });
    return installation;
  }

  async tenantInstall(pluginKey: string, tenantId: string, actorId: string, config?: Record<string, unknown>) {
    const plugin = await this.pluginDefinition(pluginKey);
    if (plugin.scope === "PLATFORM") throw new BadRequestException("This plugin can only be installed platform-wide");
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException("Tenant not found");
    const installation = await this.prisma.pluginInstallation.upsert({
      where: { pluginId_tenantId: { pluginId: plugin.id, tenantId } },
      create: {
        pluginId: plugin.id,
        tenantId,
        platformWide: false,
        installedById: actorId,
        config: (config ?? {}) as Prisma.InputJsonObject,
        status: "INSTALLED",
      },
      update: {
        installedById: actorId,
        config: (config ?? {}) as Prisma.InputJsonObject,
        status: "INSTALLED",
      },
      include: { plugin: true, tenant: true },
    });
    await this.audit(plugin.id, installation.id, tenantId, actorId, "plugin.tenant.install", "plugin", pluginKey, { configKeys: Object.keys(config ?? {}) });
    return installation;
  }

  async tenantPlugins(tenantId: string) {
    return this.prisma.pluginInstallation.findMany({
      where: { tenantId },
      include: { plugin: true },
      orderBy: { installedAt: "desc" },
    });
  }

  async platformSettings(pluginKey: string) {
    const installation = await this.platformInstallation(pluginKey);
    return {
      pluginKey,
      installed: Boolean(installation),
      config: redactConfig(configObject(installation?.config) ?? {}),
    };
  }

  async updatePlatformSettings(pluginKey: string, actorId: string, config: Record<string, unknown>) {
    const plugin = await this.pluginDefinition(pluginKey);
    if (plugin.scope === "TENANT") throw new BadRequestException("This plugin can only be configured for a tenant");
    const existing = await this.prisma.pluginInstallation.findFirst({
      where: { pluginId: plugin.id, platformWide: true, tenantId: null },
    });
    if (!existing) throw new BadRequestException("Install the plugin before configuring settings");
    const existingConfig = configObject(existing.config) ?? {};
    const nextConfig = mergeConfig(existingConfig, config);
    const installation = await this.prisma.pluginInstallation.update({
      where: { id: existing.id },
      data: {
        config: nextConfig as Prisma.InputJsonObject,
        installedById: actorId,
        status: "INSTALLED",
      },
      include: { plugin: true },
    });
    await this.audit(plugin.id, installation.id, null, actorId, "plugin.platform.settings.update", "plugin", pluginKey, { configKeys: Object.keys(config) });
    return { pluginKey, installed: true, config: redactConfig(nextConfig) };
  }

  async syncJobs() {
    return this.prisma.pluginSyncJob.findMany({
      include: { plugin: true, installation: true, tenant: true, plan: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async runPendingSyncJobs(actorId: string, limit = 20, retryFailed = false) {
    const jobs = await this.prisma.pluginSyncJob.findMany({
      where: {
        status: retryFailed ? { in: ["PENDING", "FAILED"] } : "PENDING",
        runAfter: { lte: new Date() },
      },
      include: { plugin: true, installation: true },
      orderBy: { createdAt: "asc" },
      take: Math.min(Math.max(limit, 1), 50),
    });

    const results = [];
    for (const job of jobs) {
      results.push(await this.runSyncJob(job.id, actorId));
    }
    return {
      processed: results.length,
      succeeded: results.filter((result) => result.status === "SUCCEEDED").length,
      failed: results.filter((result) => result.status === "FAILED").length,
      results,
    };
  }

  private async runSyncJob(jobId: string, actorId: string) {
    const started = await this.prisma.pluginSyncJob.update({
      where: { id: jobId },
      data: {
        status: "RUNNING",
        attempts: { increment: 1 },
        startedAt: new Date(),
      },
      include: { plugin: true, installation: true },
    });

    try {
      const result = await this.executeCapability(started.plugin.key, started.capability, started.payload, configObject(started.installation?.config));
      await this.prisma.pluginSyncJob.update({
        where: { id: started.id },
        data: {
          status: result.ok ? "SUCCEEDED" : "FAILED",
          result: result as Prisma.InputJsonObject,
          completedAt: new Date(),
        },
      });
      await this.audit(started.pluginId, started.installationId, started.tenantId, actorId, result.ok ? "plugin.sync.succeeded" : "plugin.sync.failed", "plugin_sync_job", started.id, { capability: started.capability, message: result.message });
      return { id: started.id, pluginKey: started.plugin.key, capability: started.capability, status: result.ok ? "SUCCEEDED" : "FAILED", message: result.message };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Plugin sync failed";
      await this.prisma.pluginSyncJob.update({
        where: { id: started.id },
        data: {
          status: "FAILED",
          result: { ok: false, message },
          completedAt: new Date(),
        },
      });
      await this.audit(started.pluginId, started.installationId, started.tenantId, actorId, "plugin.sync.failed", "plugin_sync_job", started.id, { capability: started.capability, message });
      return { id: started.id, pluginKey: started.plugin.key, capability: started.capability, status: "FAILED", message };
    }
  }

  private async executeCapability(pluginKey: string, capability: string, payload: unknown, config?: Record<string, unknown>): Promise<PluginResult> {
    if (pluginKey === "strapi-website-cms" && capability === "website.plan.publish") {
      const plugin = this.registry.websiteCms(pluginKey) as (WebsiteCmsPlugin & { publishPlan(input: never, config?: Record<string, unknown>): Promise<PluginResult> }) | undefined;
      if (!plugin) throw new NotFoundException("Website CMS plugin adapter not found");
      return plugin.publishPlan(payload as never, config);
    }
    if (pluginKey === "strapi-website-cms" && capability === "website.module.publish") {
      const plugin = this.registry.websiteCms(pluginKey) as (WebsiteCmsPlugin & { publishModule(input: never, config?: Record<string, unknown>): Promise<PluginResult> }) | undefined;
      if (!plugin) throw new NotFoundException("Website CMS plugin adapter not found");
      return plugin.publishModule(payload as never, config);
    }
    if (pluginKey === "erpnext-business-ops" && capability === "business.plan.sync") {
      const plugin = this.registry.businessOps(pluginKey) as (BusinessOpsPlugin & { syncPlan(input: never, config?: Record<string, unknown>): Promise<PluginResult> }) | undefined;
      if (!plugin) throw new NotFoundException("Business ops plugin adapter not found");
      return plugin.syncPlan(payload as never, config);
    }
    throw new BadRequestException(`Unsupported plugin capability: ${pluginKey}:${capability}`);
  }

  async enqueuePlanSync(planId: string) {
    const plan = await this.prisma.platformPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException("Plan not found");
    const plugins = await this.prisma.pluginDefinition.findMany({
      where: {
        key: { in: ["strapi-website-cms", "erpnext-business-ops"] },
        installations: { some: { platformWide: true, status: "INSTALLED" } },
      },
      include: { installations: { where: { platformWide: true, status: "INSTALLED" }, take: 1 } },
    });

    await Promise.all(plugins.map((plugin) => this.prisma.pluginSyncJob.create({
      data: {
        pluginId: plugin.id,
        installationId: plugin.installations[0]?.id ?? null,
        planId: plan.id,
        capability: plugin.key === "strapi-website-cms" ? "website.plan.publish" : "business.plan.sync",
        payload: plugin.key === "strapi-website-cms" ? {
          id: plan.id,
          name: plan.name,
          slug: plan.code.toLowerCase(),
          billingCycle: plan.billingCycle.toLowerCase(),
          basePrice: plan.basePrice,
          tagline: plan.description ?? "",
          features: [],
        } : {
          id: plan.id,
          code: plan.code,
          name: plan.name,
          billingCycle: plan.billingCycle,
          basePrice: plan.basePrice,
          description: plan.description,
        },
      },
    })));
  }

  private async upsertDefinition(plugin: SkolaroidPlugin) {
    await this.prisma.pluginDefinition.upsert({
      where: { key: plugin.key },
      create: {
        key: plugin.key,
        name: plugin.name,
        scope: dbScope(plugin.scope),
        capabilities: plugin.capabilities,
        system: true,
      },
      update: {
        name: plugin.name,
        scope: dbScope(plugin.scope),
        capabilities: plugin.capabilities,
      },
    });
  }

  private async pluginDefinition(key: string) {
    const plugin = await this.prisma.pluginDefinition.findUnique({ where: { key } });
    if (!plugin) throw new NotFoundException("Plugin not found");
    return plugin;
  }

  private async platformInstallation(pluginKey: string) {
    const plugin = await this.pluginDefinition(pluginKey);
    return this.prisma.pluginInstallation.findFirst({
      where: { pluginId: plugin.id, platformWide: true, tenantId: null },
    });
  }

  private async audit(pluginId: string, installationId: string | null, tenantId: string | null, actorId: string | null, action: string, resource: string, resourceId: string, metadata?: Record<string, unknown>) {
    await this.prisma.pluginAuditLog.create({
      data: {
        pluginId,
        installationId,
        tenantId,
        actorId,
        action,
        resource,
        resourceId,
        metadata: (metadata ?? {}) as Prisma.InputJsonObject,
      },
    });
  }
}

function configObject(value: Prisma.JsonValue | undefined): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function mergeConfig(existing: Record<string, unknown>, incoming: Record<string, unknown>) {
  const next = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    if (typeof value === "string" && value.trim() === "") continue;
    if (value === undefined || value === null) continue;
    next[key] = typeof value === "string" ? value.trim() : value;
  }
  return next;
}

function redactConfig(config: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(config).map(([key, value]) => [
    key,
    isSecretKey(key) && value ? "********" : value,
  ]));
}

function isSecretKey(key: string) {
  return /token|secret|password/i.test(key);
}
