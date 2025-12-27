-- AlterTable
-- Make library_sid nullable
ALTER TABLE "public"."books" 
  ALTER COLUMN "library_sid" DROP NOT NULL;

-- Add user_id column to books table
-- Note: If there are existing rows in the books table, you'll need to populate user_id
-- for those rows before this migration can succeed. You can do this by:
-- 1. First adding the column as nullable: ALTER TABLE "public"."books" ADD COLUMN "user_id" UUID;
-- 2. Updating existing rows: UPDATE "public"."books" SET "user_id" = '<some-user-uuid>' WHERE "user_id" IS NULL;
-- 3. Then making it NOT NULL: ALTER TABLE "public"."books" ALTER COLUMN "user_id" SET NOT NULL;
-- 
-- For now, this migration assumes the table is empty or you've handled existing rows.
ALTER TABLE "public"."books" 
  ADD COLUMN "user_id" UUID NOT NULL;

