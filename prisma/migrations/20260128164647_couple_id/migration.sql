-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "couple_id" VARCHAR(200) DEFAULT 'public';

-- AlterTable
ALTER TABLE "cosx_events" ADD COLUMN     "couple_id" VARCHAR(200) DEFAULT 'public';
