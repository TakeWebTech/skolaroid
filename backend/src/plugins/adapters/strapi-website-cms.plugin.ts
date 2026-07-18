import { Injectable } from "@nestjs/common";
import {
  PluginCapability,
  PluginResult,
  WebsiteCmsPlugin,
  WebsiteModulePayload,
  WebsitePlanPayload,
} from "../plugin.types";

@Injectable()
export class StrapiWebsiteCmsPlugin implements WebsiteCmsPlugin {
  readonly key = "strapi-website-cms";
  readonly name = "Strapi Website CMS";
  readonly scope = "platform" as const;
  readonly capabilities: PluginCapability[] = [
    "website.cms",
    "website.plan.publish",
    "website.module.publish",
  ];

  async publishPlan(input: WebsitePlanPayload, config?: Record<string, unknown>): Promise<PluginResult> {
    const baseUrl = stringConfig(config, "baseUrl") ?? process.env.STRAPI_URL;
    const token = stringConfig(config, "apiToken") ?? process.env.STRAPI_API_TOKEN;
    if (!baseUrl || !token) return this.notConfigured("publishPlan", input.slug);

    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = {
      data: {
        name: input.name,
        slug,
        tagline: input.tagline ?? "",
        billingCycle: input.billingCycle ?? "custom",
        basePrice: input.basePrice ?? 0,
        highlight: input.highlight ?? false,
        features: input.features ?? [],
      },
    };

    const existing = await strapiFetch<{ data?: Array<{ documentId?: string; id: number }> }>(baseUrl, `/api/pricing-plans?filters[slug][$eq]=${encodeURIComponent(slug)}`, token);
    const first = existing.data?.[0];
    if (first) {
      const id = first.documentId ?? first.id;
      await strapiFetch(baseUrl, `/api/pricing-plans/${id}`, token, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await strapiFetch(baseUrl, "/api/pricing-plans", token, { method: "POST", body: JSON.stringify(payload) });
    }

    return { ok: true, externalId: slug, message: "Published plan to Strapi." };
  }

  async publishModule(input: WebsiteModulePayload, config?: Record<string, unknown>): Promise<PluginResult> {
    const baseUrl = stringConfig(config, "baseUrl") ?? process.env.STRAPI_URL;
    const token = stringConfig(config, "apiToken") ?? process.env.STRAPI_API_TOKEN;
    if (!baseUrl || !token) return this.notConfigured("publishModule", input.slug);

    const payload = {
      data: {
        title: input.title,
        slug: input.slug,
        shortName: input.shortName ?? input.title,
        tagline: input.tagline ?? "",
        description: input.description ?? "",
        features: input.features ?? [],
        roles: input.roles ?? [],
        integrations: input.integrations ?? [],
      },
    };
    const existing = await strapiFetch<{ data?: Array<{ documentId?: string; id: number }> }>(baseUrl, `/api/product-modules?filters[slug][$eq]=${encodeURIComponent(input.slug)}`, token);
    const first = existing.data?.[0];
    if (first) {
      const id = first.documentId ?? first.id;
      await strapiFetch(baseUrl, `/api/product-modules/${id}`, token, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await strapiFetch(baseUrl, "/api/product-modules", token, { method: "POST", body: JSON.stringify(payload) });
    }

    return { ok: true, externalId: input.slug, message: "Published module to Strapi." };
  }

  private notConfigured(action: string, externalId: string): PluginResult {
    return {
      ok: false,
      externalId,
      message: `${this.name} ${action} adapter is registered but not configured yet.`,
    };
  }
}

async function strapiFetch<T = unknown>(baseUrl: string, path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`), {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = body && typeof body === "object" && "error" in body ? JSON.stringify((body as { error: unknown }).error) : response.statusText;
    throw new Error(`Strapi request failed: ${message}`);
  }
  return body as T;
}

function stringConfig(config: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = config?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
