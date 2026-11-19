/*
  Warnings:

  - Changed the type of `question_id` on the `cosxs_qanswer ` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "cosxs_qanswer " DROP COLUMN "question_id",
ADD COLUMN     "question_id" INTEGER NOT NULL;
