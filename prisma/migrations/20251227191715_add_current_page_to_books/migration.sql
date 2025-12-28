-- AlterTable
-- Add current_page column to books table
-- This field stores the current reading page for the book
-- Default to 0 for existing records
ALTER TABLE "public"."books" 
  ADD COLUMN "current_page" INTEGER NOT NULL DEFAULT 0;

