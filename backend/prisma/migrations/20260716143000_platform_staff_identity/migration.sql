CREATE TABLE "platform_roles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "system" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "platform_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_role_permissions" (
  "role_id" UUID NOT NULL,
  "permission_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id")
);

CREATE TABLE "platform_user_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "platform_user_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "platform_roles_key_key" ON "platform_roles"("key");
CREATE INDEX "platform_role_permissions_permission_id_idx" ON "platform_role_permissions"("permission_id");
CREATE UNIQUE INDEX "platform_user_profiles_user_id_key" ON "platform_user_profiles"("user_id");
CREATE INDEX "platform_user_profiles_role_id_idx" ON "platform_user_profiles"("role_id");
CREATE INDEX "platform_user_profiles_status_idx" ON "platform_user_profiles"("status");

ALTER TABLE "platform_role_permissions" ADD CONSTRAINT "platform_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "platform_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_role_permissions" ADD CONSTRAINT "platform_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_user_profiles" ADD CONSTRAINT "platform_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_user_profiles" ADD CONSTRAINT "platform_user_profiles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "platform_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
