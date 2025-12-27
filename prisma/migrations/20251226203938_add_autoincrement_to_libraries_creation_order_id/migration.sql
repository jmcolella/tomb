-- AlterTable
-- Create sequence for auto-incrementing creation_order_id
CREATE SEQUENCE IF NOT EXISTS "libraries_creation_order_id_seq";

-- Set the sequence to start from the max value + 1 if there are existing rows
SELECT setval('libraries_creation_order_id_seq', COALESCE((SELECT MAX(creation_order_id) FROM "public"."libraries"), 0) + 1, false);

-- Alter the column to use the sequence as default
ALTER TABLE "public"."libraries" 
  ALTER COLUMN "creation_order_id" SET DEFAULT nextval('libraries_creation_order_id_seq');

-- Make the sequence owned by the column
ALTER SEQUENCE "libraries_creation_order_id_seq" OWNED BY "public"."libraries"."creation_order_id";

