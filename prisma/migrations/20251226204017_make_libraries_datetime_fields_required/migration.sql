-- AlterTable
-- Update any existing NULL values in datetime_created to current timestamp
UPDATE "public"."libraries" 
SET "datetime_created" = NOW() 
WHERE "datetime_created" IS NULL;

-- Update any existing NULL values in datetime_updated to current timestamp
UPDATE "public"."libraries" 
SET "datetime_updated" = NOW() 
WHERE "datetime_updated" IS NULL;

-- Alter the columns to be NOT NULL
ALTER TABLE "public"."libraries" 
  ALTER COLUMN "datetime_created" SET NOT NULL,
  ALTER COLUMN "datetime_updated" SET NOT NULL;

