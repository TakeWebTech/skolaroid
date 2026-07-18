# Skolaroid Plugin Architecture

Skolaroid Core must stay independent from external systems such as Strapi, ERPNext, MSG91, payment gateways, biometric devices, and future integrations.

## Ownership

Skolaroid Core owns:

- Tenants, branches, users, roles, permissions, sessions, audit logs.
- Platform plans, entitlements, tenant subscriptions, and billing references.
- Plugin registry, plugin installation state, plugin configuration, sync jobs, and plugin audit logs.

Strapi Website CMS plugin owns:

- Public website content publishing.
- Product module copy, feature copy, public pricing presentation, FAQs, blogs, help articles, legal pages, testimonials, case studies, partners, and homepage content.
- Website-safe plan visibility only. It must not own invoices or private billing records.

ERPNext plugin owns:

- Demo enquiries, sales leads, follow-ups, quotations, customers, invoices, payments, accounting, job openings, and hiring applications.
- Commercial records and invoice documents.

## Plan Sync Flow

1. Platform admin creates or edits a plan in Skolaroid Core.
2. Core stores the canonical operational plan and entitlements.
3. Core queues plugin sync jobs.
4. Strapi plugin publishes website-safe pricing and entitlement copy.
5. ERPNext plugin creates or updates items, quotation templates, customer/subscription mappings, and invoice references.
6. Core reads invoice/payment history through the ERPNext plugin interface.

## Sync Runner

Installed plugins now do more than record installation state:

1. Platform actions, such as creating a plan, queue `PluginSyncJob` rows.
2. Platform Admin can open `Platform -> Plugins -> Plugin actions`.
3. `Run pending sync` calls `POST /api/v1/plugins/sync/run`.
4. The backend loads installed plugin config or backend environment variables.
5. The matching adapter pushes data to Strapi or ERPNext.
6. The job is marked `SUCCEEDED` or `FAILED`, and a plugin audit log is written.

For local development, configure backend environment variables:

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_read_write_token
ERPNEXT_URL=https://your-erpnext-site.example
ERPNEXT_API_KEY=your_erpnext_key
ERPNEXT_API_SECRET=your_erpnext_secret
```

The current runner is manual and platform-triggered. A worker or cron should call the same service method later for automatic background processing.

## Plugin Installation Scope

Platform plugins:

- Installed by platform admin.
- Can be used by platform staff.
- Can be made available to tenants.
- Examples: Strapi CMS, ERPNext, platform email provider, analytics warehouse.

Tenant plugins:

- Installed or enabled for a specific tenant.
- Can store tenant-specific configuration.
- Can be restricted by plan entitlements.
- Examples: MSG91 sender, payment gateway, biometric device connector, WhatsApp provider.

## Required Core Tables

- `PluginDefinition`
- `PluginInstallation`
- `PluginSetting`
- `PluginSyncJob`
- `PluginAuditLog`

## Required Backend Interfaces

```ts
export interface SkolaroidPlugin {
  key: string;
  name: string;
  scope: "platform" | "tenant" | "both";
  capabilities: string[];
}

export interface WebsiteCmsPlugin {
  publishPlan(input: WebsitePlanPayload): Promise<PluginResult>;
  publishModule(input: WebsiteModulePayload): Promise<PluginResult>;
  publishTestimonial(input: WebsiteTestimonialPayload): Promise<PluginResult>;
}

export interface BusinessOpsPlugin {
  syncLead(input: LeadPayload): Promise<PluginResult>;
  syncCustomer(input: CustomerPayload): Promise<PluginResult>;
  syncPlan(input: PlanCommercialPayload): Promise<PluginResult>;
  createQuotation(input: QuotationPayload): Promise<PluginResult>;
  listInvoices(input: InvoiceQuery): Promise<InvoiceSummary[]>;
}
```

## First Built-in Plugin Adapters

- `strapi-website-cms`
- `erpnext-business-ops`

These adapters must live behind the plugin module. Core product services should call plugin interfaces or queue plugin sync jobs, not import Strapi or ERPNext clients directly.
