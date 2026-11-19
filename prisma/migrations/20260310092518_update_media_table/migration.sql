/*
  Warnings:

  - Added the required column `created_at` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "couple_id" VARCHAR(200) DEFAULT 'public',
ADD COLUMN     "created_at" VARCHAR(30) NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "date_string" TEXT,
ADD COLUMN     "description" TEXT;
