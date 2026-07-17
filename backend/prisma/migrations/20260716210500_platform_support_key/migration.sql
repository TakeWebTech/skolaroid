ALTER TABLE "platform_tenant_profiles"
  ADD COLUMN "support_key_hash" TEXT NOT NULL DEFAULT 'e0bebd22819993425814866b62701e2919df1c85dcb3c4dbac4094a21d0d60bf',
  ADD COLUMN "support_key_rotated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "platform_tenant_profiles" ALTER COLUMN "support_key_hash" DROP DEFAULT;
