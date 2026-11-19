/*
  Warnings:

  - You are about to drop the column `priority` on the `cosxs_todo ` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `cosxs_todo ` table. All the data in the column will be lost.
  - Made the column `description` on table `cosxs_todo ` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cosxs_todo " DROP COLUMN "priority",
DROP COLUMN "title",
ADD COLUMN     "color" VARCHAR(10) NOT NULL DEFAULT '#fff',
ALTER COLUMN "description" SET NOT NULL;
