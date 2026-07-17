CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUAL', 'CONTRACT');

CREATE TABLE "platform_tenant_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "organization_id" TEXT NOT NULL,
  "primary_domain" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "admin_name" TEXT NOT NULL,
  "admin_email" TEXT NOT NULL,
  "student_capacity" INTEGER,
  "implementation_owner" TEXT NOT NULL,
  "onboarding_notes" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "platform_tenant_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_plans" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "billing_cycle" "BillingCycle" NOT NULL,
  "base_price" INTEGER NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "platform_plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_subscriptions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "plan_id" UUID NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "starts_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "renews_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "platform_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "platform_tenant_profiles_tenant_id_key" ON "platform_tenant_profiles"("tenant_id");
CREATE UNIQUE INDEX "platform_tenant_profiles_organization_id_key" ON "platform_tenant_profiles"("organization_id");
CREATE UNIQUE INDEX "platform_tenant_profiles_primary_domain_key" ON "platform_tenant_profiles"("primary_domain");
CREATE INDEX "platform_tenant_profiles_organization_id_idx" ON "platform_tenant_profiles"("organization_id");
CREATE UNIQUE INDEX "platform_plans_code_key" ON "platform_plans"("code");
CREATE INDEX "platform_subscriptions_tenant_id_status_idx" ON "platform_subscriptions"("tenant_id", "status");
CREATE INDEX "platform_subscriptions_plan_id_idx" ON "platform_subscriptions"("plan_id");

ALTER TABLE "platform_tenant_profiles" ADD CONSTRAINT "platform_tenant_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_subscriptions" ADD CONSTRAINT "platform_subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_subscriptions" ADD CONSTRAINT "platform_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "platform_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
