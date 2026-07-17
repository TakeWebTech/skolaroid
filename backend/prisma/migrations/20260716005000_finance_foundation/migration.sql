CREATE TYPE "FeeDemandStatus" AS ENUM ('DUE', 'PAID');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'CHEQUE', 'ONLINE');

CREATE TABLE "fee_demands" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "branch_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "label" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "due_date" DATE NOT NULL,
  "status" "FeeDemandStatus" NOT NULL DEFAULT 'DUE',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "fee_demands_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "branch_id" UUID NOT NULL,
  "demand_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "collected_by" UUID,
  "amount" INTEGER NOT NULL,
  "method" "PaymentMethod" NOT NULL,
  "receipt_no" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "fee_demands_tenant_id_branch_id_status_idx" ON "fee_demands"("tenant_id", "branch_id", "status");
CREATE INDEX "fee_demands_student_id_status_idx" ON "fee_demands"("student_id", "status");
CREATE UNIQUE INDEX "payments_receipt_no_key" ON "payments"("receipt_no");
CREATE INDEX "payments_tenant_id_branch_id_created_at_idx" ON "payments"("tenant_id", "branch_id", "created_at");
CREATE INDEX "payments_student_id_idx" ON "payments"("student_id");

ALTER TABLE "fee_demands" ADD CONSTRAINT "fee_demands_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fee_demands" ADD CONSTRAINT "fee_demands_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fee_demands" ADD CONSTRAINT "fee_demands_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "fee_demands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_collected_by_fkey" FOREIGN KEY ("collected_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
