CREATE TYPE "AdmissionStage" AS ENUM ('NEW', 'UNDER_REVIEW', 'INTERVIEW', 'OFFERED', 'REJECTED');

CREATE TABLE "admission_applications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "branch_id" UUID NOT NULL,
  "student_name" TEXT NOT NULL,
  "grade" TEXT NOT NULL,
  "guardian_name" TEXT NOT NULL,
  "guardian_phone" TEXT NOT NULL,
  "guardian_email" TEXT,
  "source" TEXT NOT NULL DEFAULT 'Portal',
  "stage" "AdmissionStage" NOT NULL DEFAULT 'NEW',
  "notes" TEXT,
  "reviewed_by_id" UUID,
  "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "admission_applications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "admission_applications_tenant_id_branch_id_stage_idx" ON "admission_applications"("tenant_id", "branch_id", "stage");
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
