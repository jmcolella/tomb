-- AlterTable
-- Rename column and change type from VARCHAR to UUID
ALTER TABLE "public"."libraries" 
  RENAME COLUMN "user_sid" TO "user_id";

-- Change the column type from VARCHAR to UUID
-- This will fail if existing data is not valid UUID format
ALTER TABLE "public"."libraries" 
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::UUID;

