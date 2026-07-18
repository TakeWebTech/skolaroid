import { Injectable } from "@nestjs/common";
import {
  BusinessOpsPlugin,
  CustomerPayload,
  InvoiceQuery,
  InvoiceSummary,
  LeadPayload,
  PlanCommercialPayload,
  PluginCapability,
  PluginResult,
  QuotationPayload,
} from "../plugin.types";

@Injectable()
export class ErpnextBusinessOpsPlugin implements BusinessOpsPlugin {
  readonly key = "erpnext-business-ops";
  readonly name = "ERPNext Business Operations";
  readonly scope = "platform" as const;
  readonly capabilities: PluginCapability[] = [
    "business.lead.sync",
    "business.customer.sync",
    "business.plan.sync",
    "business.quotation.create",
    "business.invoice.read",
  ];

  async syncLead(input: LeadPayload, config?: Record<string, unknown>): Promise<PluginResult> {
    const client = erpClient(config);
    if (!client) return this.notConfigured("syncLead", input.email);
    const result = await client.post("/api/resource/Lead", {
      lead_name: input.name,
      email_id: input.email,
      mobile_no: input.phone,
      company_name: input.organisation,
      source: input.source,
      notes: input.notes,
    });
    return { ok: true, externalId: result.name ?? input.email, message: "Synced lead to ERPNext." };
  }

  async syncCustomer(input: CustomerPayload, config?: Record<string, unknown>): Promise<PluginResult> {
    const client = erpClient(config);
    if (!client) return this.notConfigured("syncCustomer", input.tenantId);
    const customerName = input.organisationName;
    await client.upsert("Customer", customerName, {
      customer_name: customerName,
      customer_type: "Company",
      customer_group: "Commercial",
      territory: "All Territories",
      email_id: input.email,
      mobile_no: input.phone,
      website: input.domain,
    });
    return { ok: true, externalId: customerName, message: "Synced customer to ERPNext." };
  }

  async syncPlan(input: PlanCommercialPayload, config?: Record<string, unknown>): Promise<PluginResult> {
    const client = erpClient(config);
    if (!client) return this.notConfigured("syncPlan", input.code);
    await client.upsert("Item", input.code, {
      item_code: input.code,
      item_name: input.name,
      item_group: "Services",
      stock_uom: "Nos",
      is_stock_item: 0,
      standard_rate: input.basePrice ?? 0,
      description: input.billingCycle ? `${input.name} (${input.billingCycle})` : input.name,
    });
    return { ok: true, externalId: input.code, message: "Synced plan to ERPNext." };
  }

  async createQuotation(input: QuotationPayload): Promise<PluginResult> {
    return this.notConfigured("createQuotation", `${input.customerId}:${input.planId}`);
  }

  async listInvoices(_input: InvoiceQuery): Promise<InvoiceSummary[]> {
    return [];
  }

  private notConfigured(action: string, externalId: string): PluginResult {
    return {
      ok: false,
      externalId,
      message: `${this.name} ${action} adapter is registered but not configured yet.`,
    };
  }
}

function erpClient(config?: Record<string, unknown>) {
  const baseUrl = stringConfig(config, "baseUrl") ?? process.env.ERPNEXT_URL;
  const apiKey = stringConfig(config, "apiKey") ?? process.env.ERPNEXT_API_KEY;
  const apiSecret = stringConfig(config, "apiSecret") ?? process.env.ERPNEXT_API_SECRET;
  if (!baseUrl || !apiKey || !apiSecret) return null;
  return {
    post: (path: string, body: Record<string, unknown>) => erpFetch<{ data?: { name?: string } }>(baseUrl, path, apiKey, apiSecret, { method: "POST", body: JSON.stringify(body) }).then((result) => result.data ?? {}),
    upsert: async (doctype: string, name: string, body: Record<string, unknown>) => {
      const path = `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
      const existing = await erpFetch(baseUrl, path, apiKey, apiSecret).then(() => true).catch(() => false);
      if (existing) {
        await erpFetch(baseUrl, path, apiKey, apiSecret, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await erpFetch(baseUrl, `/api/resource/${encodeURIComponent(doctype)}`, apiKey, apiSecret, { method: "POST", body: JSON.stringify(body) });
      }
    },
  };
}

async function erpFetch<T = unknown>(baseUrl: string, path: string, apiKey: string, apiSecret: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`), {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `token ${apiKey}:${apiSecret}`,
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = body && typeof body === "object" ? JSON.stringify(body) : response.statusText;
    throw new Error(`ERPNext request failed: ${message}`);
  }
  return body as T;
}

function stringConfig(config: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = config?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
