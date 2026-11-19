/*
  Warnings:

  - You are about to drop the column `emnji` on the `Journal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "emnji",
ADD COLUMN     "emoji" INTEGER NOT NULL DEFAULT 1;
