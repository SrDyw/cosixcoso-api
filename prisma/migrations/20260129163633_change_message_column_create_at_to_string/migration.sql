-- AlterTable
ALTER TABLE "cosxs_messages" ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE VARCHAR(50);
