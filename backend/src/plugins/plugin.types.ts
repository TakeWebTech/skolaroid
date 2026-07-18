export type PluginScope = "platform" | "tenant" | "both";

export type PluginCapability =
  | "website.cms"
  | "website.plan.publish"
  | "website.module.publish"
  | "business.lead.sync"
  | "business.customer.sync"
  | "business.plan.sync"
  | "business.quotation.create"
  | "business.invoice.read";

export type PluginInstallScope = {
  tenantId?: string;
  platformWide?: boolean;
};

export type PluginResult = {
  ok: boolean;
  externalId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
};

export type WebsitePlanPayload = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  audience?: string;
  highlight?: boolean;
  billingCycle?: "monthly" | "annual" | "custom";
  basePrice?: number;
  features: { label: string; included?: boolean; note?: string }[];
};

export type WebsiteModulePayload = {
  id: string;
  title: string;
  slug: string;
  shortName?: string;
  tagline?: string;
  description?: string;
  features?: string[];
  roles?: string[];
  integrations?: string[];
};

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  source: string;
  notes?: string;
};

export type CustomerPayload = {
  id: string;
  tenantId: string;
  organisationName: string;
  email?: string;
  phone?: string;
  domain?: string;
};

export type PlanCommercialPayload = {
  id: string;
  name: string;
  code: string;
  billingCycle?: string;
  basePrice?: number;
  currency?: string;
};

export type QuotationPayload = {
  customerId: string;
  planId: string;
  tenantId?: string;
  notes?: string;
};

export type InvoiceQuery = {
  tenantId?: string;
  customerId?: string;
  from?: string;
  to?: string;
};

export type InvoiceSummary = {
  invoiceId: string;
  invoiceNumber: string;
  date: string;
  status: string;
  planName?: string;
  amount: number;
  currency: string;
  downloadUrl?: string;
};

export interface SkolaroidPlugin {
  key: string;
  name: string;
  scope: PluginScope;
  capabilities: PluginCapability[];
}

export interface WebsiteCmsPlugin extends SkolaroidPlugin {
  publishPlan(input: WebsitePlanPayload): Promise<PluginResult>;
  publishModule(input: WebsiteModulePayload): Promise<PluginResult>;
}

export interface BusinessOpsPlugin extends SkolaroidPlugin {
  syncLead(input: LeadPayload): Promise<PluginResult>;
  syncCustomer(input: CustomerPayload): Promise<PluginResult>;
  syncPlan(input: PlanCommercialPayload): Promise<PluginResult>;
  createQuotation(input: QuotationPayload): Promise<PluginResult>;
  listInvoices(input: InvoiceQuery): Promise<InvoiceSummary[]>;
}
