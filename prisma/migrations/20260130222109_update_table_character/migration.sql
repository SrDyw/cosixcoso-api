-- DropIndex
DROP INDEX "characters_name_key";

-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "couple_id" VARCHAR(200) DEFAULT 'public';
