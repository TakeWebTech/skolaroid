CREATE TABLE "platform_tenant_edit_challenges" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "profile_id" UUID NOT NULL,
  "actor_id" UUID NOT NULL,
  "otp_hash" TEXT NOT NULL,
  "edit_token_hash" TEXT,
  "verified_at" TIMESTAMPTZ(6),
  "expires_at" TIMESTAMPTZ(6) NOT NULL,
  "used_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_tenant_edit_challenges_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "platform_tenant_edit_challenges_profile_id_actor_id_expires_at_idx" ON "platform_tenant_edit_challenges"("profile_id", "actor_id", "expires_at");
CREATE INDEX "platform_tenant_edit_challenges_edit_token_hash_idx" ON "platform_tenant_edit_challenges"("edit_token_hash");

ALTER TABLE "platform_tenant_edit_challenges" ADD CONSTRAINT "platform_tenant_edit_challenges_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "platform_tenant_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_tenant_edit_challenges" ADD CONSTRAINT "platform_tenant_edit_challenges_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
